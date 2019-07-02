import cloneDeep from 'lodash/cloneDeep';

import { PanelModel } from '@grafana/ui';

import { NetworkTrafficMapOptions } from './types';

const optionsToKeep = ['displayOptions'];

export const sharedNetworkTrafficMapOptionsCheck = (
  options: Partial<NetworkTrafficMapOptions> | any,  prevPluginId: string,
  prevOptions: any
) => {
  for (const k of optionsToKeep) {
    if (prevOptions.hasOwnProperty(k)) {
      options[k] = cloneDeep(prevOptions[k]);
    }
  }
  return options;
};

export const sharedNetworkTrafficMapMigrationCheck = (panel: PanelModel<NetworkTrafficMapOptions>) => {
  if (!panel.options) {
    // This happens on the first load or when migrating from angular
    return {};
  }

  // no migration support yet.
  return panel.options;
};
