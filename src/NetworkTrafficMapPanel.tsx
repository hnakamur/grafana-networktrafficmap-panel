// Libraries
import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import cyCanvas from 'cytoscape-canvas';

// Types
import { PanelProps, getColorFromThreshold } from '@grafana/ui';
import { NetworkTrafficMapOptions } from './types';

cyCanvas(cytoscape);

const getLastNonNullRowInRows = rows => {
  if (rows.length === 0) {
    return [null, null];
  }
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i][0] !== null) {
      return rows[i];
    }
  }
  return rows[0];
};

const toLastNonNullRowBySeriesName = data => {
  let map = {};
  if (data && data.series) {
    data.series.forEach(series => {
      const fields = series.fields;
      if (!fields || fields.length !== 2) {
        console.log('toLastNonNullRowByFieldName, unexpected fields length, data=', data);
      }
      map[series.name] = getLastNonNullRowInRows(series.rows);
    });
  }
  return map;
};

const getTrafficValue = (rowsBySeriesName, seriesName) => {
  const row = rowsBySeriesName[seriesName];
  return row ? row[0] : undefined;
};

const formatTrafficLabel = value => {
  if (value === undefined) {
    return 'no series';
  }
  if (value === null) {
    return 'no data';
  }
  return `${value.toFixed(1)}%`;
}

const setEmptyJointPosition = (cy, elem) => {
  const realLinkID = elem.data('realLinkID');
  const realLink = cy.$('#' + realLinkID);
  const midpoint = realLink.midpoint();
  elem.position(midpoint);
};


interface NetworkTrafficMapPanelProps extends PanelProps<NetworkTrafficMapOptions> {}

export const NetworkTrafficMapPanel: React.FunctionComponent<NetworkTrafficMapPanelProps> = ({
  data,
  timeRange,
  width,
  height,
  options,
  onOptionsChange,
}) => {
  if (!data) {
    return (
      <div className="panel-empty">
        <p>No data found in response</p>
      </div>
    );
  }

  const cyWrapper = useRef(null);
  useEffect(() => {
    const { nodes, links, displayOptions } = options;
    const { nodeHeight, nodeWidth, edgeWidth, edgeInterval, thresholds } = displayOptions;
    const validLinks = links.filter(link => (link.sourceID && link.targetID));
    const rowsBySeriesName = toLastNonNullRowBySeriesName(data);

    const realNodeElems: object[] = nodes.map(node => ({
      data: { id: `node${node.id}`, label: node.label },
      position: { x: node.x, y: node.y },
      classes: 'real-node'
    }));

    const realLinkElems: object[] = validLinks.map(link => ({
      data: {
        id: `link${link.id}`,
        source: `node${link.sourceID}`,
        target: `node${link.targetID}`
      },
      classes: 'real-link'
    }));

    const emptyJointElems: object[] = validLinks.map(link => ({
      data: {
        id: `joint${link.id}`,
        realLinkID: `link${link.id}`
      },
      classes: 'empty-joint'
    }));

    const sourceMidEdgeElems: object[] = validLinks.map(link => {
      const value = getTrafficValue(rowsBySeriesName, link.forwardSeriesName);
      const color = getColorFromThreshold(value, thresholds);

      return {
        data: {
          id: `edge${link.sourceID}-${link.id}`,
          source: `node${link.sourceID}`,
          target: `joint${link.id}`,
          label: formatTrafficLabel(value),
          lineColor: color
        },
        classes: 'edge'
      };
    });

    const targetMidEdgeElems: object[] = validLinks.map(link => {
      const value = getTrafficValue(rowsBySeriesName, link.reverseSeriesName);
      const color = getColorFromThreshold(value, thresholds);

      return {
        data: {
          id: `edge${link.targetID}-${link.id}`,
          source: `node${link.targetID}`,
          target: `joint${link.id}`,
          label: formatTrafficLabel(value),
          lineColor: color
        },
        classes: 'edge'
      };
    });

    const elems = realNodeElems.concat(realLinkElems, emptyJointElems, sourceMidEdgeElems, targetMidEdgeElems);

    const cy = cytoscape({
      container: cyWrapper.current,
      elements: elems,
      style: [
        {
          selector: '.real-node',
          style: {
            'background-color': '#ccc',
            'height': nodeHeight,
            'width': nodeWidth
          }
        },
        {
          selector: '.real-node[label]',
          style: {
            'color': '#000',
            'font-weight': 'bold',
            'label': 'data(label)',
            'text-background-color': '#fff',
            'text-background-opacity': 1,
            'text-background-shape': 'rectangle',
            'text-border-color': '#000',
            'text-border-opacity': 1,
            'text-border-width': '1px',
            'text-halign': 'center',
            'text-valign': 'center',
            'text-wrap': 'wrap'
          }
        },
        {
          selector: '.real-link',
          style: {
            'curve-style': 'bezier',
            'opacity': 0,
            'width': '1px',
            'height': '1px',
            'border-width': 0,
            'control-point-step-size': edgeInterval
          }
        },
        {
          selector: '.empty-joint',
          style: {
            'content': '',
            'background-opacity': 0,
            'width': '2px',
            'height': '2px',
            'border-width': 0
          }
        },
        {
          selector: '.edge',
          style: {
            'curve-style': 'bezier',
            'width': `${edgeWidth}px`,
            'line-color': 'data(lineColor)',
            'target-arrow-color': 'data(lineColor)',
            'target-arrow-shape': 'triangle'
          }
        },
        {
          selector: '.edge[label]',
          style: {
            'label': 'data(label)',
            'text-border-opacity': 1,
            'text-border-color': '#000',
            'text-border-width': '1px',
            'text-background-padding': '4px',
            'text-background-opacity': 1,
            'text-background-color': '#fff',
            'text-background-shape': 'rectangle'
          }
        },
      ],
      layout: {
        name: 'preset'
      }
    });

    cy.$('.empty-joint').forEach(elem => {
      setEmptyJointPosition(cy, elem);
    });

    cy.$('.real-node').on('position', evt => {
      let joints = evt.target.neighborhood().filter('.empty-joint');
      joints.forEach(elem => {
        setEmptyJointPosition(cy, elem);
      });
    });

    return () => {
      cy.destroy();
    };
  });

  return (
    <div ref={cyWrapper} style={{width: '100%', height: '100%'}} />
  );
};
