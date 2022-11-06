import invariant from 'tiny-invariant';

export function getEnv() {
  invariant(
    process.env.SESSION_SECRET,
    'process.env.SESSION_SECRET not defined'
  );

  return {
    SESSION_SECRET: process.env.SESSION_SECRET,
  };
}

type ENV = ReturnType<typeof getEnv>;

// App puts these on
declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
