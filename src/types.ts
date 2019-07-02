import { Threshold } from '@grafana/ui';
import cytoscape from 'cytoscape';

export interface NetworkTrafficMapOptions {
  nodes: Node[];
  links: Link[];
  displayOptions: DisplayOptions;
}

export interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface Link {
  id: number;
  sourceID: number;
  targetID: number;
  forwardSeriesName: string;
  reverseSeriesName: string;
}

export interface DisplayOptions {
  edgeWidth: number;
  edgeInterval: number;
  thresholds: Threshold[];
}

export const standardDisplayOptions: DisplayOptions = {
  edgeWidth: 10,
  edgeInterval: 80,
  // NOTE: This color codes were copied from
  // https://jfly.uni-koeln.de/colorset/
  thresholds: [
    { index: 0, value: -Infinity, color: '#ffffff' },
    { index: 1, value: 1, color: '#c9ace6' },
    { index: 2, value: 10, color: '#005aff' },
    { index: 3, value: 25, color: '#4dc4ff' },
    { index: 4, value: 40, color: '#03af16' },
    { index: 5, value: 55, color: '#fff100' },
    { index: 6, value: 70, color: '#f6aa00' },
    { index: 7, value: 85, color: '#ff4b00' }
  ],
};

export const defaults: NetworkTrafficMapOptions = {
  nodes: [],
  links: [],
  displayOptions: standardDisplayOptions,
};

export interface NetworkTrafficMapState {
  cy: cytoscape;
}
