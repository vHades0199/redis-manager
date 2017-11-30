import { Response } from 'express';
import IORedis, { RedisOptions, Redis } from 'ioredis';
import inflection from 'inflection';

import { Request } from '../../interfaces';

interface T extends Request {
  body: RedisOptions;
}

export default function ({ redisConnections, body }: T, res: Response, next) {
  const { url } = body;
  let client: Redis = redisConnections.get(url);
  if (!client) {
    client = new IORedis({ url });
    redisConnections.set(url, client);
  }
  client.info((err, serverInfo) => {
    if (err) next(err);
    else {
      const infoLines = serverInfo.split('\n').map((line) => {
        const parts = line.trim().split(':');
        return {
          key: inflection.humanize(parts[0]),
          value: parts.slice(1).join(':'),
        };
      });
      res.json(infoLines);
    }
  });
}
