#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';

import { createProject } from './actions/create-project';
import capitalize from './tools/capitalize';
import { Entities } from './tools/entity';
import { createApi } from './actions/api/create';


const cli = new Command()
  .name("bat-framework");

cli
  .command('init [projectName]')
  .description('creates a new apps script project')
  .action(async (projectName) => {
    const isDev = process.env.NODE_ENV === "development"
    const rootDir = isDev ? path.resolve(`./${projectName}`, 'test') : path.resolve(`./${projectName}`);

    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir, {
        recursive: true
      });
    }

    try {
      await createProject({ appPath: rootDir, appName: projectName });
    } catch (err) {
      console.log('Could not create a new apps script project. Please try again', err);
    }
  });

cli
  .command('init-api [projectName]')
  .description('creates a new apps script API')
  .action(async (projectName: string) => await createApi({ projectName }))


cli.parse(process.argv);
