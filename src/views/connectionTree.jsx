import React, { ReactElement } from 'react';
import { JSONTreeProps } from 'react-json-tree';

import JSONTree from '../components/BootstrapJSONTree';

type Prop = {
  data: Object,
  onShowInfo: (connectionId: string) => void,
  onShowKey: (connectionId: string, key: string) => void,
};
export default function ConnectionTree(props: Prop): ?ReactElement<*> {
  const treeProps: JSONTreeProps = {
    labelRenderer: (raw: [string, string]) => {
      if (raw[0].indexOf('|') >= 0) {
        const data = raw[0].split('|');
        switch (data[0]) {
          case 'server':
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  props.onShowInfo(data[2]);
                }}
                className="text-nowrap btn btn-sm btn-primary"
              >
                {data[1]}
              </button>
            );
          case 'key': {
            const serverArgs = raw[raw.length - 1].split('|');
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  props.onShowKey(data[1], serverArgs[2]);
                }}
                className="text-nowrap btn btn-sm btn-primary"
              >
                {data[1]}
              </button>
            );
          }
          default:
            break;
        }
      }
      return <strong>{raw[0]}</strong>;
    },
    getItemString: (type, data, itemType, itemString) => (
      <span className="text-nowrap">
        {itemType} <strong className="badge badge-secondary">{itemString}</strong>
      </span>
    ),
  };
  return <JSONTree data={props.data} hideRoot {...treeProps} />;
}
