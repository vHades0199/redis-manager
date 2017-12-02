import { Request, Response } from 'express';
import IORedis, { RedisOptions, Redis } from 'ioredis';
import inflection from 'inflection';
import { Collection } from 'immutable';
import uuid from 'uuid/v4';

interface T extends Request {
  body: RedisOptions;
}

export default function (req: T, res: Response) {
  const {
    port, host, password, url,
  } = req.body;
  const connections: Collection<string, Redis> = global.redisConnections;
  const redisUrl = url || `redis://:${password}@${host}:${port}`;
  let client: Redis = connections.find((v, k) => k.endsWith(redisUrl));
  if (!client) {
    client = new IORedis(redisUrl, {
      retryStrategy(times) {
        if (times < 2) {
          return 500;
        }
        return null;
      },
    });
  }
  client.info((err, serverInfo) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    const id = uuid();
    global.redisConnections = connections.set(`${id}|${redisUrl}`, client);
    const infoLines = serverInfo.split('\n').map((line) => {
      const parts = line.trim().split(':');
      return {
        key: inflection.humanize(parts[0]),
        value: parts.slice(1).join(':'),
      };
    });
    res.json({ id, url: redisUrl, info: infoLines });
  });
}
