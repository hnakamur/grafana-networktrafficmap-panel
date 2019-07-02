import React, { PureComponent } from 'react';

import NodeRow from './NodeRow';
import { Node } from './types';
import { PanelOptionsGroup } from '@grafana/ui';

export interface Props {
  nodes: Node[];
  onChange: (nodes: Node[]) => void;
}

interface State {
  nodes: Node[];
  nextIdToAdd: number;
}

export class NodesEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const nodes = props.nodes;

    this.state = {
      nodes: nodes,
      nextIdToAdd: nodes.length > 0 ? this.getMaxIdFromNodes(nodes) : 1,
    };
  }

  getMaxIdFromNodes(nodes: Node[]) {
    return Math.max.apply(null, nodes.map(node => node.id).map(n => n)) + 1;
  }

  addNode = () =>
    this.setState(prevState => ({
      nodes: [
        ...prevState.nodes,
        {
          id: prevState.nextIdToAdd,
          label: '',
          x: 0,
          y: 0,
        },
      ],
      nextIdToAdd: prevState.nextIdToAdd + 1,
    }));

  onRemoveNode = (id: number) => {
    this.setState(
      prevState => ({
        nodes: prevState.nodes.filter(m => {
          return m.id !== id;
        }),
      }),
      () => {
        this.props.onChange(this.state.nodes);
      }
    );
  };

  updateNode = (node: Node) => {
    this.setState(
      prevState => ({
        nodes: prevState.nodes.map(n => {
          if (n.id === node.id) {
            return { ...node };
          }

          return n;
        }),
      }),
      () => {
        this.props.onChange(this.state.nodes);
      }
    );
  };

  render() {
    const { nodes } = this.state;

    return (
      <PanelOptionsGroup title="Add nodes" onAdd={this.addNode}>
        {nodes.length > 0 &&
          nodes.map((node, index) => (
            <NodeRow
              key={`${node.label}-${index}`}
              node={node}
              updateNode={this.updateNode}
              removeNode={() => this.onRemoveNode(node.id)}
            />
          ))}
      </PanelOptionsGroup>
    );
  }
}
