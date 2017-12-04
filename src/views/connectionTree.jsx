import React, { ReactElement } from 'react';
import { JSONTreeProps } from 'react-json-tree';

import JSONTree from '../components/BootstrapJSONTree';

type Prop = {
  data: Object,
  onShowInfo: (connectionId: string) => void,
  onShowKey: (connectionId: string, key: string) => void,
};
export default function ConnectionTree(props: Prop): ?ReactElement<*> {
  const createButtonInfo = (onClick, content) => (
    <button
      onClick={onClick}
      className="btn btn-sm btn-light py-0 px-1"
      style={{ verticalAlign: 'baseline', color: 'inherit', textTransform: 'inherit' }}
    >
      {content}
    </button>
  );

  const treeProps: JSONTreeProps = {
    labelRenderer: (raw: [string, string]) => {
      if (raw[0].indexOf('|') >= 0) {
        const data = raw[0].split('|');
        switch (data[0]) {
          case 'server':
            return createButtonInfo((e) => {
              e.preventDefault();
              e.stopPropagation();
              props.onShowInfo(data[2]);
            }, data[1]);
          case 'key': {
            const serverArgs = raw[raw.length - 1].split('|');
            return createButtonInfo((e) => {
              e.preventDefault();
              e.stopPropagation();
              props.onShowKey(data[1], serverArgs[2]);
            }, data[1]);
          }
          default:
            break;
        }
      }
      return <span className="pl-1">{raw[0]}</span>;
    },
  };
  return (
    <div className="bg-light h-100">
      <JSONTree data={props.data} hideRoot className="h-100 py-1" {...treeProps} />
    </div>
  );
}
