import { execSync } from 'child_process';
import path from 'path';
import rimraf from 'rimraf';

export function gitInit(root: string): boolean {
  let didInit = false
  try {
    execSync('git --version', { stdio: 'ignore' })

    execSync('git init', { stdio: 'ignore' })
    didInit = true

    execSync('git checkout -b main', { stdio: 'ignore' })

    execSync('git add -A', { stdio: 'ignore' })
    execSync('git commit -m "Initial commit"', {
      stdio: 'ignore',
    })
    return true
  } catch (e) {
    if (didInit) {
      try {
        rimraf.sync(path.join(root, '.git'))
      } catch (_) {}
    }
    return false
  }
}