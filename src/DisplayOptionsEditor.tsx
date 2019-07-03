import React, { ChangeEvent, PureComponent } from 'react';

import {
  FormField,
  ThresholdsEditor,
  Threshold,
  PanelOptionsGrid,
  PanelOptionsGroup,
} from '@grafana/ui';

import { DisplayOptions } from './types';

export interface Props {
  options: DisplayOptions;
  onChange: (options: DisplayOptions) => void;
}

interface State {
  nodeWidth: number;
  nodeHeight: number;
  edgeWidth: number;
  edgeInterval: number;
  thresholds: Threshold[];
}

export class DisplayOptionsEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { ...props.options };
  }

  onNodeWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
		if (!isNaN(parsedValue)) {
			this.setState({ nodeWidth: parsedValue });
		}
  };

  onNodeHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
		if (!isNaN(parsedValue)) {
			this.setState({ nodeHeight: parsedValue });
		}
  };

  onEdgeWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
		if (!isNaN(parsedValue)) {
			this.setState({ edgeWidth: parsedValue });
		}
  };

  onEdgeIntervalChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(event.target.value);
		if (!isNaN(parsedValue)) {
			this.setState({ edgeInterval: parsedValue });
		}
  };

  updateDisplayOptions = () => {
    this.props.onChange({ ...this.state } as DisplayOptions);
  };

  onThresholdsChanged = (thresholds: Threshold[]) => {
    this.setState({ thresholds });
    this.props.onChange({ ...this.state, thresholds } as DisplayOptions);
  }

  render() {
    const { nodeWidth, nodeHeight, edgeWidth, edgeInterval, thresholds } = this.state;
    return (
      <PanelOptionsGrid>
        <PanelOptionsGroup title="Display">
          <FormField
            label="Node width"
            labelWidth={10}
            inputWidth={8}
            onBlur={this.updateDisplayOptions}
            onChange={this.onNodeWidthChange}
            value={nodeWidth}
          />
          <FormField
            label="Node height"
            labelWidth={10}
            inputWidth={8}
            onBlur={this.updateDisplayOptions}
            onChange={this.onNodeHeightChange}
            value={nodeHeight}
          />
          <FormField
            label="Edge width"
            labelWidth={10}
            inputWidth={8}
            onBlur={this.updateDisplayOptions}
            onChange={this.onEdgeWidthChange}
            value={edgeWidth}
          />
          <FormField
            label="Edge interval"
            labelWidth={10}
            inputWidth={8}
            onBlur={this.updateDisplayOptions}
            onChange={this.onEdgeIntervalChange}
            value={edgeInterval}
          />
        </PanelOptionsGroup>

        <ThresholdsEditor onChange={this.onThresholdsChanged} thresholds={thresholds} />
      </PanelOptionsGrid>
    );
  }
}
