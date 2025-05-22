import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import { readJson } from '@tomjs/node';
import semver from 'semver';

const exec = util.promisify(cp.exec);

export type PackageManagerCLI = 'npm' | 'pnpm' | 'yarn';
export type PackageManagerId = 'npm' | 'pnpm' | 'yarn' | 'berry';

export interface PackageManager {
  /**
   * The main CLI, e.g. the `npm` in `npm install`, `npm test`, etc.
   */
  cli: PackageManagerCLI;
  /**
   * How the package manager should be referred to in user-facing messages (since there are two different configs for some, e.g. yarn and berry).
   */
  id: PackageManagerId;
  /**
   * List of lockfile names expected for this package manager, relative to CWD. e.g. `['package-lock.json', 'npm-shrinkwrap.json']`.
   */
  lockfiles: string[];
  /**
   * The version of the package manager.
   */
  version: string;
}

const configs: Record<PackageManagerId, PackageManager> = {
  npm: {
    cli: 'npm',
    id: 'npm',
    lockfiles: ['package-lock.json', 'npm-shrinkwrap.json'],
    version: '',
  },
  pnpm: {
    cli: 'pnpm',
    id: 'pnpm',
    lockfiles: ['pnpm-lock.yaml'],
    version: '',
  },
  yarn: {
    cli: 'yarn',
    id: 'yarn',
    lockfiles: ['yarn.lock'],
    version: '',
  },
  berry: {
    cli: 'yarn',
    id: 'berry',
    lockfiles: ['yarn.lock'],
    version: '',
  },
};

function configFromPackageManagerField(pkg: any): PackageManager | undefined {
  if (!pkg || typeof pkg.packageManager !== 'string') {
    return undefined;
  }

  const [cli, version] = pkg.packageManager.split('@') as [PackageManagerCLI, string];

  if (cli === 'yarn' && version && semver.gte(version, '2.0.0')) {
    return configs.berry;
  }

  const config = configs[cli];
  if (config) {
    return config;
  }

  throw new Error(`Invalid package manager: ${pkg.packageManager}`);
}

function findLockfile(rootDirectory: string, config: PackageManager): string | undefined {
  return config.lockfiles
    .map(filename => path.resolve(rootDirectory || '.', filename))
    .find(filepath => fs.existsSync(filepath));
}

function configFromLockfile(rootDirectory: string): PackageManager | undefined {
  return [configs.npm, configs.pnpm, configs.yarn].find(config =>
    findLockfile(rootDirectory, config),
  );
}

export async function getPackageManager(rootDir: string): Promise<PackageManager> {
  const pkg = await readJson(path.join(rootDir, 'package.json'));
  const pm = configFromPackageManagerField(pkg) || configFromLockfile(rootDir) || configs.npm;

  // check version
  const { stdout, stderr } = await exec(`${pm.cli} --version`);
  if (stderr) {
    throw new Error(`Get package manager ${pm.id} version failed: \n${stderr}`);
  }

  pm.version = (stdout || '').trim().replace(/\n|\r/g, '');

  if (!pm.version) {
    throw new Error(
      `Package manager ${pm.id} has unknown version, please make sure ${pm.id} has been installed`,
    );
  }

  return pm;
}
