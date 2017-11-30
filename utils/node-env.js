const { NODE_ENV = 'development' } = process.env;

const NODE_ENV_CONTANT = {
  DEV: 'development',
  PROC: 'production',
  TEST: 'test',
};
export default NODE_ENV_CONTANT;
export const isDev = NODE_ENV === NODE_ENV_CONTANT.DEV;
export const isProc = NODE_ENV === NODE_ENV_CONTANT.PROC;
