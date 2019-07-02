import { PanelPlugin } from '@grafana/ui';
import { NetworkTrafficMapOptions, defaults } from './types';
import { NetworkTrafficMapPanel } from './NetworkTrafficMapPanel';
import { NetworkTrafficMapEditor } from './NetworkTrafficMapEditor';
import { sharedNetworkTrafficMapOptionsCheck, sharedNetworkTrafficMapMigrationCheck } from './NetworkTrafficMapOptions';

export const plugin = new PanelPlugin<NetworkTrafficMapOptions>(NetworkTrafficMapPanel)
  .setDefaults(defaults)
  .setEditor(NetworkTrafficMapEditor)
  .setPanelChangeHandler(sharedNetworkTrafficMapOptionsCheck)
  .setMigrationHandler(sharedNetworkTrafficMapMigrationCheck);
