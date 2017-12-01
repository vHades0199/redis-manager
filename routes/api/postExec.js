import { Request, Response } from 'express';

import { getConnection } from '../../utils/global';

export default function (req: Request, res: Response) {
  const { cmd, connectionId } = req.body;
  const client = getConnection(connectionId);
  if (!client) {
    res.send(400);
    return;
  }
  const parts = cmd.split(' ');
  const commandName = parts[0].toLowerCase();
  if (!(commandName in client)) {
    res.send(400, 'ERROR: Invalid Command');
    return;
  }
  const args = parts.slice(1);
  args.push((err, results) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    return res.json(results);
  });
  client[commandName](...args);
}
