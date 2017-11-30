export type ConnectionInfo = {
  name: string,
  db: number,
};

export type ConnectionAction =
  | {
      type: 'add',
      data: ConnectionInfo,
    }
  | {
      type: 'remove',
      name: string,
    }
  | {
      type: 'info',
      id: string,
      data: Object,
    };
