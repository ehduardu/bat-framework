import spawn from 'cross-spawn';

export function install(root: string, dependencies: string[] | null, isDev = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = 'yarnpkg';
    const args = dependencies? ['add', '--exact'] : ['install'];

    if (isDev) {
      args.push('--dev')
    }

    if (dependencies) {
      args.push(...dependencies);
    }

    args.push('--cwd', root);

    const child = spawn(command, args, { stdio: 'inherit', env: { ...process.env } });
    child.on('close', (code) => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` });
        return;
      }
      resolve();
    })
  })
}