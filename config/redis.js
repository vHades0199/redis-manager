import Redis from 'ioredis';

const op = {
  host: 'localhost',
  port: 6379,
  label: 'local',
  options: {
    db: '0',
    // password: 'p84ecb170fa4d0246640d907ddf7c233e852d35791b717c402bb1a8408c5b8a6f',
  },
};
const client = new Redis(op.port, op.host, op.options);
export default client;
const redisConnections = [
  {
    label: 'lyd',
    options: {
      host: 'ec2-34-252-202-201.eu-west-1.compute.amazonaws.com',
      port: '34949',
      db: '0',
      password: 'p84ecb170fa4d0246640d907ddf7c233e852d35791b717c402bb1a8408c5b8a6f',
    },
  },
];
