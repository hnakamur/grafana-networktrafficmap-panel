import React, { PureComponent } from 'react';

import LinkRow from './LinkRow';
import { Link } from './types';
import { PanelOptionsGroup, SelectOptionItem } from '@grafana/ui';

export interface Props {
  nodeOptions: Array<SelectOptionItem<number>>;
  links: Link[];
  onChange: (links: Link[]) => void;
}

interface State {
  links: Link[];
  nextIdToAdd: number;
}

export class LinksEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const links = props.links;

    this.state = {
      links: links,
      nextIdToAdd: links.length > 0 ? this.getMaxIdFromLinks(links) : 1,
    };
  }

  getMaxIdFromLinks(links: Link[]) {
    return Math.max.apply(null, links.map(node => node.id).map(n => n)) + 1;
  }

  addLink = () =>
    this.setState(prevState => ({
      links: [
        ...prevState.links,
        {
          id: prevState.nextIdToAdd,
          sourceID: 0,
          targetID: 0,
          forwardSeriesName: '',
          reverseSeriesName: '',
        },
      ],
      nextIdToAdd: prevState.nextIdToAdd + 1,
    }));

  onRemoveLink = (id: number) => {
    this.setState(
      prevState => ({
        links: prevState.links.filter(l => {
          return l.id !== id;
        }),
      }),
      () => {
        this.props.onChange(this.state.links);
      }
    );
  };

  updateLink = (link: Link) => {
    this.setState(
      prevState => ({
        links: prevState.links.map(l => {
          if (l.id === link.id) {
            return { ...link };
          }

          return l;
        }),
      }),
      () => {
        this.props.onChange(this.state.links);
      }
    );
  };

  render() {
    const { nodeOptions } = this.props;
    const { links } = this.state;

    return (
      <PanelOptionsGroup title="Add links" onAdd={this.addLink}>
        {links.length > 0 &&
          links.map((link) => (
            <LinkRow
              key={link.id}
              nodeOptions={nodeOptions}
              link={link}
              updateLink={this.updateLink}
              removeLink={() => this.onRemoveLink(link.id)}
            />
          ))}
      </PanelOptionsGroup>
    );
  }
}
