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
  edgeWidth: number;
  edgeInterval: number;
  thresholds: Threshold[];
}

export class DisplayOptionsEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { ...props.options };
  }

  onEdgeWdithChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    const { edgeWidth, edgeInterval, thresholds } = this.state;
    return (
      <PanelOptionsGrid>
        <PanelOptionsGroup title="Display">
          <FormField
            label="Edge width"
            labelWidth={10}
            inputWidth={8}
            onBlur={this.updateDisplayOptions}
            onChange={this.onEdgeWdithChange}
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
