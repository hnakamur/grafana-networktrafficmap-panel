// Libraries
import React, { PureComponent } from 'react';
import { PanelEditorProps } from '@grafana/ui';

import { NodesEditor } from './NodesEditor';
import { LinksEditor } from './LinksEditor';
import { DisplayOptionsEditor } from './DisplayOptionsEditor';
import { NetworkTrafficMapOptions, DisplayOptions, Node, Link } from './types';

export class NetworkTrafficMapEditor extends PureComponent<PanelEditorProps<NetworkTrafficMapOptions>> {
  onNodesChanged = (nodes: Node[]) =>
    this.props.onOptionsChange({
      ...this.props.options,
      nodes
    });

  onLinksChanged = (links: Link[]) =>
    this.props.onOptionsChange({
      ...this.props.options,
      links
    });

  onDisplayOptionsChanged = (displayOptions: DisplayOptions) =>
    this.props.onOptionsChange({
      ...this.props.options,
      displayOptions,
    });

  render() {
    const { options } = this.props;
    const { displayOptions, nodes, links } = options;
    const nodeOptions = nodes.map(node => (
      { value: node.id, label: node.label }
    ));

    return (
      <>
        <NodesEditor onChange={this.onNodesChanged} nodes={nodes} />
        <LinksEditor onChange={this.onLinksChanged} links={links} nodeOptions={nodeOptions} />
        <DisplayOptionsEditor onChange={this.onDisplayOptionsChanged} options={displayOptions} />
      </>
    );
  }
}
