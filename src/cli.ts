#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';

import { createProject } from './actions/create-project';
import capitalize from './tools/capitalize';
import { Entities } from './tools/entity';


const cli = new Command()
  .name("bat-framework");

cli
  .command('init [projectName]')
  .description('creates a new apps script project')
  .action((projectName) => {
    const isDev = process.env.NODE_ENV === "development"
    const rootDir = isDev ? path.resolve(`./${projectName}`, 'test') : path.resolve(`./${projectName}`);

    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir, {
        recursive: true
      });
    }

    try {
      createProject({ appPath: rootDir, appName: projectName });
    } catch (err) {
      console.log('Could not create a new apps script project. Please try again', err);
    }
  });

cli
  .command('create [entityType] [name]')
  .description(`creates a new entity of type ${Entities.map(e => capitalize(e.toLowerCase())).join(' or ')}`)
  .action((entityType, name) => {
    if (entityType === 'function') {
      // create new function
    } else {
      console.log('not implemented yet')
    }
  });

cli
  .command('entityTypes')
  .description(`list all entity types`)
  .action(() => {
    Entities.map(e => console.log(capitalize(e.toLowerCase())))
  });

cli.parse(process.argv);
