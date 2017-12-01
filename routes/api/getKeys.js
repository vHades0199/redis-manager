import { Request, Response } from 'express';

import { getConnection } from '../../utils/global';

export default function (req: Request, res: Response, next) {
  const { connectionId, limit = 100, pattern = '*' } = req.params;
  const client = getConnection(connectionId);
  if (!client) {
    res.send(400);
    return;
  }
  client.keys(pattern, (err, result) => {
    let keys = result;
    if (err) {
      console.error('getKeys', err);
      next(err);
      return;
    }
    console.log(`found ${keys.length} keys for "${pattern}"`);

    if (keys.length > limit) {
      keys = keys.slice(0, limit);
    }

    keys = keys.sort();
    res.json(keys);
  });
}
