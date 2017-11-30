import { RedisOptions } from 'ioredis';
import { Request as ExRequest } from 'express';

export interface Request extends ExRequest {
  redisConnections: Map<string, RedisOptions>;
}
