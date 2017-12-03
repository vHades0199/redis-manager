export type ConnectionInfo = {
  id: string,
  name: string,
  info: Array<{ key: string, value: string }>,
  keys: Array<string | [string]>,
};

export type ConnectionAction =
  | {
      type: 'add',
      id: string,
      data: ConnectionInfo,
    }
  | {
      type: 'remove',
      name: string,
    }
  | {
      type: 'scan',
      id: string,
      data: string,
    };
