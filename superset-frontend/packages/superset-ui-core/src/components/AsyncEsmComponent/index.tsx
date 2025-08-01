/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  useEffect,
  useState,
  RefObject,
  forwardRef,
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

import { Loading } from '../Loading';
import type { PlaceholderProps } from './types';

function DefaultPlaceholder({
  width,
  height,
  showLoadingForImport = false,
  placeholderStyle: style,
}: PlaceholderProps) {
  return (
    // since `width` defaults to 100%, we can display the placeholder once
    // height is specified.
    (height && (
      <div key="async-asm-placeholder" style={{ width, height, ...style }}>
        {showLoadingForImport && <Loading position="floating" />}
      </div>
    )) ||
    // `|| null` is for in case of height=0.
    null
  );
}

/**
 * Asynchronously import an ES module as a React component, render a placeholder
 * first (if provided) and re-render once import is complete.
 */
export function AsyncEsmComponent<
  P = PlaceholderProps,
  M = ComponentType<P> | { default: ComponentType<P> },
>(
  /**
   * A promise generator that returns the React component to render.
   */
  loadComponent: Promise<M> | (() => Promise<M>),
  /**
   * Placeholder while still importing.
   */
  placeholder: ComponentType<
    PlaceholderProps & Partial<P>
  > | null = DefaultPlaceholder,
) {
  // component props + placeholder props
  type FullProps = P & PlaceholderProps;
  let promise: Promise<M> | undefined;
  let component: ComponentType<FullProps>;

  /**
   * Safely wait for promise, make sure the loader function only execute once.
   */
  function waitForPromise() {
    if (!promise) {
      // load component on initialization
      promise =
        loadComponent instanceof Promise ? loadComponent : loadComponent();
    }
    if (!component) {
      promise.then(result => {
        component = ((result as { default?: ComponentType<P> }).default ||
          result) as ComponentType<FullProps>;
      });
    }
    return promise;
  }

  type AsyncComponent = ForwardRefExoticComponent<
    PropsWithoutRef<FullProps> & RefAttributes<ComponentType<FullProps>>
  > & {
    preload?: typeof waitForPromise;
  };

  const AsyncComponent: AsyncComponent = forwardRef(function AsyncComponent(
    props: FullProps,
    ref: RefObject<ComponentType<FullProps>>,
  ) {
    const [loaded, setLoaded] = useState(component !== undefined);
    useEffect(() => {
      let isMounted = true;
      if (!loaded) {
        // update state to trigger a re-render
        waitForPromise().then(() => {
          if (isMounted) {
            setLoaded(true);
          }
        });
      }
      return () => {
        isMounted = false;
      };
    });
    const Component = component || placeholder;
    return Component ? (
      // placeholder does not get the ref
      // @ts-ignore: Suppress TypeScript error for ref assignment
      <Component ref={Component === component ? ref : null} {...props} />
    ) : null;
  });
  // preload the async component before rendering
  AsyncComponent.preload = waitForPromise;

  return AsyncComponent as AsyncComponent & {
    preload: typeof waitForPromise;
  };
}

export type { PlaceholderProps };
