import React, { ReactElement } from 'react';
import uuid from 'uuid/v4';
import ReactJson from 'react-json-view';

type Prop = {
  onChange: (src: Object) => void,
  desc: string,
  content: Object | [{ key: string, value: string }],
  onSave: () => void,
  onRefresh: () => void,
};

export default function DataView(props: Prop): ?ReactElement<*> {
  if (props.content == null) return null;
  if (props.content instanceof Array) {
    const items = [];
    props.content.forEach(({ key, value }) => {
      const id = uuid();
      items.push(<dt key={id}>{key}</dt>);
      items.push(<dd key={`key:${id}`}>{value}</dd>);
    });
    return (
      <div className="overflow-y mh-100">
        <dl>{items}</dl>
      </div>
    );
  }
  const viewProps = {
    name: props.desc,
    iconStyle: 'circle',
    onEdit: ({ updated_src }) => {
      props.onChange(updated_src);
    },
    onAdd: ({ updated_src }) => {
      props.onChange(updated_src);
    },
    onDelete: ({ updated_src }) => {
      props.onChange(updated_src);
    },
    onSelect: () => {},
  };
  if (props.content instanceof Object) {
    return (
      <div className="mh-100 d-flex flex-column">
        <div
          className="btn-toolbar flex-no-shrink"
          role="toolbar"
          aria-label="Toolbar with button groups"
        >
          <div className="btn-group mr-2" role="group" aria-label="First group">
            <button type="button" className="btn btn-secondary" onClick={props.onSave}>
              save
            </button>
            <button type="button" className="btn btn-secondary" onClick={props.onRefresh}>
              refresh
            </button>
          </div>
        </div>
        <div className="overflow-y mt-2">
          <ReactJson className="" src={props.content} {...viewProps} />
        </div>
      </div>
    );
  }

  return (
    <textarea
      className="form-control"
      rows="4"
      value={props.content}
      onChange={({ target: { value } }) => props.onChange(value)}
    />
  );
}
