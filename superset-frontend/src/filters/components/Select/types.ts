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
  AppSection,
  Behavior,
  ChartProps,
  DataRecord,
  FilterState,
  GenericDataType,
  QueryFormData,
  ChartDataResponseResult,
} from '@superset-ui/core';
import { RefObject } from 'react';
import { FilterBarOrientation } from 'src/dashboard/types';
import { PluginFilterHooks, PluginFilterStylesProps } from '../types';

export type SelectValue = (number | string | null)[] | null | undefined;

export interface PluginFilterSelectCustomizeProps {
  defaultValue?: SelectValue;
  enableEmptyFilter: boolean;
  inverseSelection: boolean;
  creatable: boolean;
  multiSelect: boolean;
  defaultToFirstItem: boolean;
  searchAllOptions: boolean;
  sortAscending?: boolean;
  sortMetric?: string;
}

export type PluginFilterSelectQueryFormData = QueryFormData &
  PluginFilterStylesProps &
  PluginFilterSelectCustomizeProps;

export interface PluginFilterSelectChartProps extends ChartProps {
  queriesData: ChartDataResponseResult[];
}

export type PluginFilterSelectProps = PluginFilterStylesProps & {
  coltypeMap: Record<string, GenericDataType>;
  data: DataRecord[];
  behaviors: Behavior[];
  appSection: AppSection;
  formData: PluginFilterSelectQueryFormData;
  filterState: FilterState;
  isRefreshing: boolean;
  showOverflow: boolean;
  parentRef?: RefObject<any>;
  inputRef?: RefObject<any>;
  filterBarOrientation?: FilterBarOrientation;
  isOverflowingFilterBar?: boolean;
  clearAllTrigger?: Record<string, boolean>;
  onClearAllComplete?: (filterId: string) => void;
} & PluginFilterHooks;

export const DEFAULT_FORM_DATA: PluginFilterSelectCustomizeProps = {
  defaultValue: null,
  enableEmptyFilter: false,
  inverseSelection: false,
  defaultToFirstItem: false,
  creatable: true,
  multiSelect: true,
  searchAllOptions: false,
  sortAscending: true,
};
