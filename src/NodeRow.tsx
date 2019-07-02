import React, { ChangeEvent, PureComponent } from 'react';

import { FormField } from '@grafana/ui';

import { Node } from './types';

export interface Props {
  node: Node;
  updateNode: (node: Node) => void;
  removeNode: () => void;
}

interface State {
  id: number;
  label: string;
  x: number;
  y: number;
}

export default class NodeRow extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { ...props.node };
  }

  onNodeLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ label: event.target.value });
  };

  onNodeXChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
		if (!isNaN(parsedValue)) {
			this.setState({ x: parsedValue });
		}
  };

  onNodeYChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
		if (!isNaN(parsedValue)) {
			this.setState({ y: parsedValue });
		}
  };

  updateNode = () => {
    this.props.updateNode({ ...this.state } as Node);
  };

  renderRow() {
    const { label, x, y } = this.state;

    return (
      <>
        <FormField
          label="Label"
          labelWidth={4}
          inputWidth={8}
          onBlur={this.updateNode}
          onChange={this.onNodeLabelChange}
          value={label}
        />
        <FormField
          label="X"
          labelWidth={4}
          inputWidth={8}
          onBlur={this.updateNode}
          onChange={this.onNodeXChange}
          value={x}
        />
        <FormField
          label="Y"
          labelWidth={4}
          inputWidth={8}
          onBlur={this.updateNode}
          onChange={this.onNodeYChange}
          value={y}
        />
      </>
    );
  }

  render() {
    return (
      <div className="gf-form-inline">
        {this.renderRow()}
        <div className="gf-form">
          <button onClick={this.props.removeNode} className="gf-form-label gf-form-label--btn">
            <i className="fa fa-times" />
          </button>
        </div>
      </div>
    );
  }
}
