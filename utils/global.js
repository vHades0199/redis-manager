import { Redis } from 'ioredis';
import { Collection } from 'immutable';

export function getConnection(connectionId: string) {
  const connections: Collection<string, Redis> = global.redisConnections;

  return connections.find((v, k) => k.startsWith(connectionId));
}

export function get() {}
