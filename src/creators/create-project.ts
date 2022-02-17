import chalk from 'chalk';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import cpy from 'cpy';
import os from 'os';

import { gitInit } from '../tools/git';
import { install } from '../tools/install';
import logger from '../tools/logger';

interface createProject {
  appPath: string;
  appName: string;
}

export async function createProject({ appPath, appName }: createProject) {
  const root = path.resolve(appPath);

  if (!appName) {
    logger.error(chalk.blueBright("argument projectName not specified!"));
    process.exit(1);
  }

  async function canWrite(path: string) {
    try {
      await fs.promises.access(path, (fs.constants || fs).W_OK)
      return true
    } catch {
      return false
    }
  }

  if (!(await canWrite(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.'
    );
    console.error(
      'It is likely you do not have write permissions for this folder.'
    );
    process.exit(1);
  }

  await fs.promises.mkdir(root, { recursive: true });
  const originalDirectory = process.cwd();

  console.log(`Creating a new apps script project in ${chalk.green(root)}`);
  process.chdir(root);

  const packageJSON = {
    "name": appName,
    "version": '1.0.0',
    "description": "Starter project for using React with Google Apps Script to build Web Apps",
    "scripts": {
      "test": "test",
      "login": "clasp login",
      "setup:use-id": "clasp setting scriptId",
      "build": "webpack --mode production",
      "deploy": "npm run build && npx clasp push"
    },
    "keywords": [
      "react",
      "google",
      "apps",
      "script",
      "sheets"
    ],
    "author": "Carlos Eduardo",
    "license": "MIT",
    "engines": {
      "node": ">=10.0.0",
      "npm": ">=6.0.0"
    },
    "dependencies": {
      "prop-types": "^15.7.2",
      "react": "^16.13.0",
      "react-bootstrap": "^1.0.1",
      "react-dom": "^16.13.0",
      "react-router-dom": "^5.2.0",
      "react-transition-group": "^4.4.1",
      "styled-components": "^5.1.1"
    },
    "devDependencies": {
      "@babel/cli": "^7.8.4",
      "@babel/core": "^7.8.7",
      "@babel/plugin-proposal-class-properties": "^7.8.3",
      "@babel/plugin-proposal-object-rest-spread": "^7.8.3",
      "@babel/plugin-transform-object-assign": "^7.8.3",
      "@babel/polyfill": "^7.8.7",
      "@babel/preset-env": "^7.8.7",
      "@babel/preset-react": "^7.8.3",
      "babel-eslint": "^10.1.0",
      "babel-loader": "^8.0.6",
      "babel-plugin-add-module-exports": "^1.0.2",
      "babel-plugin-transform-es3-member-expression-literals": "^6.22.0",
      "babel-plugin-transform-es3-property-literals": "^6.22.0",
      "copy-webpack-plugin": "^5.1.1",
      "css-loader": "^3.4.2",
      "dynamic-cdn-webpack-plugin": "^5.0.0",
      "eslint": "^6.8.0",
      "eslint-config-airbnb-base": "^14.0.0",
      "eslint-config-prettier": "^6.10.0",
      "eslint-config-standard": "^14.1.0",
      "eslint-loader": "^3.0.3",
      "eslint-plugin-babel": "^5.3.0",
      "eslint-plugin-googleappsscript": "^1.0.3",
      "eslint-plugin-import": "^2.20.1",
      "eslint-plugin-jsx-a11y": "^6.2.3",
      "eslint-plugin-node": "^11.0.0",
      "eslint-plugin-prettier": "^3.1.2",
      "eslint-plugin-promise": "^4.2.1",
      "eslint-plugin-react": "^7.19.0",
      "eslint-plugin-standard": "^4.0.1",
      "gas-lib": "^2.0.3",
      "gas-types-detailed": "^1.0.0",
      "gas-webpack-plugin": "^1.0.2",
      "html-webpack-inline-source-plugin": "0.0.10",
      "html-webpack-plugin": "^3.2.0",
      "module-to-cdn": "^3.1.5",
      "prettier": "^1.19.1",
      "style-loader": "^1.1.3",
      "tern": "^0.24.3",
      "terser-webpack-plugin": "^2.3.5",
      "webpack": "^4.42.0",
      "webpack-clean": "^1.2.3",
      "webpack-cli": "^3.3.11"
    }
  };

  console.log(`Copying ${chalk.cyan('template')} and ${chalk.cyan('base files')}`)
  const rootDirName = path.resolve(__dirname, '..', '..');
  await cpy(['.*', '.**', '**', '*.**'], root, {
    parents: true,
    dot: true,
    cwd: path.join(rootDirName, 'templates', 'project'),
  });

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJSON, null, 2) + os.EOL
  );


  console.log('Installing development dependencies...');
  await install(root, [
    "@google/clasp@2.3.0",
  ], true);

  const gitInitialized = gitInit(root);
  if (gitInitialized) {
    console.log('Git repository initialized\n');
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${chalk.cyan(appPath)}\n`);
  console.log(`${chalk.yellow('Attention!')} Before start, make sure to change the scriptId in the ${chalk.cyan('.clasp.json')}`);
  console.log('Inside that directory, you can run several commands:\n');
  console.log(chalk.cyan('   yarn login'));
  console.log('    To do login in google clasp.\n');
  console.log(chalk.cyan('   yarn build'));
  console.log('    Builds the app to dist folder.\n');
  console.log(chalk.cyan('   yarn deploy'));
  console.log('    Builds the app and push to gas server.\n');
  console.log('We suggest that you begin by typing:\n');
  console.log(`   ${chalk.cyan('yarn login\n')}`);

  if (!gitInitialized) {
    console.log(`${chalk.yellow('Attention!')} ${chalk.redBright('git repository it not initialized!')}`);
    console.log('Inside that directory, you need to run this commands:\n');
    console.log(chalk.cyan('   git init'));
  }
}
