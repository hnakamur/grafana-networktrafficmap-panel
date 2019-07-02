import React, { ChangeEvent, PureComponent } from 'react';

import { FormField, FormLabel, Select, SelectOptionItem } from '@grafana/ui';

import { Link } from './types';

export interface Props {
  nodeOptions: Array<SelectOptionItem<number>>;
  link: Link;
  updateLink: (link: Link) => void;
  removeLink: () => void;
}

interface State {
  id: number;
  sourceID: number;
  targetID: number;
  forwardSeriesName: string;
  reverseSeriesName: string;
}

export default class LinkRow extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { ...props.link };
  }

  onSourceIDChange = (sourceID: number) => {
    this.setState({ sourceID });
    if (this.state.targetID) {
      this.props.updateLink({ ...this.state, sourceID } as Link);
    }
  };

  onTargetIDChange = (targetID: number) => {
    this.setState({ targetID });
    if (this.state.sourceID) {
      this.props.updateLink({ ...this.state, targetID } as Link);
    }
  };

  onForwardSeriesNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ forwardSeriesName: event.target.value });
  };

  onReverseSeriesNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ reverseSeriesName: event.target.value });
  };

  updateLink = () => {
    this.props.updateLink({ ...this.state } as Link);
  };

  render() {
    const { nodeOptions } = this.props;
    const { sourceID, targetID, forwardSeriesName, reverseSeriesName } = this.state;

    return (
      <div className="gf-form-inline">
        <div className="gf-form">
          <FormLabel width={4}>Source</FormLabel>
          <Select
            placeholder="Choose source"
            isSearchable={false}
            options={nodeOptions}
            value={nodeOptions.find(n => n.value === sourceID)}
            // @ts-ignore
            onChange={source => this.onSourceIDChange(source.value)}
            width={8}
          />
        </div>
        <div className="gf-form">
          <FormLabel width={4}>Target</FormLabel>
          <Select
            placeholder="Choose target"
            isSearchable={false}
            options={nodeOptions}
            value={nodeOptions.find(n => n.value === targetID)}
            // @ts-ignore
            onChange={target => this.onTargetIDChange(target.value)}
            width={8}
          />
        </div>
        <FormField
          label="Forward Series"
          labelWidth={8}
          onBlur={this.updateLink}
          onChange={this.onForwardSeriesNameChange}
          value={forwardSeriesName}
          inputWidth={16}
        />
        <FormField
          label="Reverse Series"
          labelWidth={8}
          onBlur={this.updateLink}
          onChange={this.onReverseSeriesNameChange}
          value={reverseSeriesName}
          inputWidth={16}
        />
        <div className="gf-form">
          <button onClick={this.props.removeLink} className="gf-form-label gf-form-label--btn">
            <i className="fa fa-times" />
          </button>
        </div>
      </div>
    );
  }
}
