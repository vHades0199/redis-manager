import React, { Component, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import JSONTree, { JSONTreeProps } from 'react-json-tree';

type HTMLAttributes = {
  style?: CSSProperties,
  className?: string,
};
type NestedNode<T> =
  | CSSProperties
  | ((
      _: T,
      keyPath: [string],
      nodeType: string,
      expanded: boolean,
      expandable: boolean
    ) => T);
type Theme<T> = {
  tree: CSSProperties | ((_: T) => T),
  value: CSSProperties | ((_: T, nodeType: string) => T),
  valueText: CSSProperties | ((_: T, nodeType: string) => T),
  arrow:
    | CSSProperties
    | ((
        _: T,
        nodeType: string,
        expanded: boolean,
        arrowStyle: string
      ) => T),
  arrowContainer: CSSProperties | ((_: T, arrowStyle: string) => T),
  nestedNode: NestedNode<T>,
  nestedNodeItemString: NestedNode<T>,
  nestedNodeItemType: NestedNode<T>,
  nestedNodeChildren: NestedNode<T>,
};

// ex theme: https://github.com/alexkuz/react-json-tree/blob/feature-refactor-styling/src/createStylingFromTheme.js
const colorsClass = {
  BACKGROUND_COLOR: '',
  TEXT_COLOR: '',
  STRING_COLOR: '',
  DATE_COLOR: '',
  NUMBER_COLOR: '',
  BOOLEAN_COLOR: '',
  NULL_COLOR: '',
  UNDEFINED_COLOR: '',
  FUNCTION_COLOR: '',
  SYMBOL_COLOR: '',
  LABEL_COLOR: 'text-info',
  ARROW_COLOR: '',
  ITEM_STRING_COLOR: 'text-secondary',
  ITEM_STRING_EXPANDED_COLOR: 'text-danger',
};

const bootstrapTheme: Theme<HTMLAttributes> = {
  tree: () => ({
    'data-theme': 'tree',
    className: 'list-unstyled py-1',
    style: {
      fontFamily: 'monospace',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
    },
  }),

  value: () => ({
    'data-theme': 'value',
    className: 'py-1 ml-3',
    style: {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
    },
  }),

  label: () => ({
    'data-theme': 'label',
    className: `text-nowrap mb-0 ${colorsClass.LABEL_COLOR}`,
  }),

  valueLabel: () => ({
    'data-theme': 'valueLabel',
    className: 'mr-1 mb-0',
  }),

  valueText: () => ({
    'data-theme': 'valueText',
  }),

  itemRange: () => ({
    'data-theme': 'itemRange',
    className: `mb-2 ${colorsClass.LABEL_COLOR}`,
    style: { cursor: 'pointer' },
  }),

  arrow: (_, nodeType, expanded) => ({
    'data-theme': 'arrow',
    className: 'small position-relative',
    style: {
      transition: '150ms',
      WebkitTransition: '150ms',
      MozTransition: '150ms',
      WebkitTransform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
      MozTransform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
      transform: expanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)',
      transformOrigin: '45% 50% 0px',
    },
  }),

  arrowContainer: (_, arrowStyle) => ({
    'data-theme': 'arrowContainer',
    className: `d-inline-block ${arrowStyle === 'double' ? 'mr-2' : 'mr-1'}`,
    style: {
      cursor: 'pointer',
    },
  }),

  /* arrowSign: ({ style }, arrowStyle) => ({
    className: 'd-inline-block py-1',
    style: {
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTopWidth: 5,
      borderTopStyle: 'solid',
      borderTopColor: colorsClass.ARROW_COLOR,
    },
  }), */

  arrowSignInner: {
    position: 'absolute',
    top: 0,
    left: -5,
  },

  nestedNode: (_, keyPath) => ({
    'data-theme': 'nestedNode',
    className: `position-relative pt-1 pb-2 ${keyPath.length > 1 ? 'ml-3' : 'ml-1'}`,
  }),

  nestedNodeLabel: (_, nodeType, expanded) => ({
    'data-theme': 'nestedNodeLabel',
    style: {
      textTransform: expanded ? 'uppercase' : _.style.textTransform,
    },
  }),

  nestedNodeItemString: (_, __, ___, expanded) => ({
    'data-theme': 'nestedNodeItemString',
    className: `${
      expanded ? colorsClass.ITEM_STRING_EXPANDED_COLOR : colorsClass.ITEM_STRING_COLOR
    } pl-3`,
    style: {
      cursor: 'default',
      verticalAlign: 'text-bottom',
    },
  }),

  nestedNodeItemType: () => ({
    'data-theme': 'nestedNodeItemType',
    className: 'small',
  }),

  nestedNodeChildren: (_, expanded) => ({
    'data-theme': 'nestedNodeChildren',
    className: 'm-0 p-0 list-unstyled',
    style: {
      display: expanded ? 'block' : 'none',
    },
  }),
};

export default class BootstrapJSONTree extends Component<JSONTreeProps, {}> {
  constructor(props) {
    super(props);

    this.state = { useDefault: false };
  }

  render() {
    return (
      <JSONTree
        {...this.props}
        invertTheme={false}
        theme={this.state.useDefault ? false : bootstrapTheme}
        getItemString={(type, data, itemType, itemString) => (
          <span className="text-nowrap">
            {itemType} <span className="text-secondary font-italic">{itemString}</span>
          </span>
        )}
      />
    );
  }
}
BootstrapJSONTree.propTypes = {
  data: PropTypes.object.isRequired,
  hideRoot: PropTypes.bool,
};
BootstrapJSONTree.defaultProps = {
  hideRoot: false,
};
