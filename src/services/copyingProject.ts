import { execSync } from 'child_process';
import chalk from 'chalk';
import path from 'path';
import fs, { appendFile } from 'fs';
import cpy from 'cpy';
import os from 'os';

import { gitInit } from '../tools/git';
import { install } from '../tools/install';
import apiPackageJSON from '../../templates/api/package.json';
import projectPackageJSON from '../../templates/project/package.json';

interface IRequest {
  appPath: string;
  projectName: string;
  templateType: 'api' | 'project';
}

export default class CopyingProjectService {
  #canWrite = async (path: string) => {
    try {
      await fs.promises.access(path, (fs.constants || fs).W_OK)
      return true
    } catch {
      return false
    }
  }

  async execute({ appPath, projectName, templateType }: IRequest) {
    const canWrite = await this.#canWrite(path.dirname(appPath));
    if (!canWrite) {
      console.error(
        'The application path is not writable, please check folder permissions and try again.'
      );
      console.error(
        'It is likely you do not have write permissions for this folder.'
      );
      process.exit(1);
    }

    await fs.promises.mkdir(appPath, { recursive: true });

    console.log(`Creating a new apps script project in ${chalk.green(appPath)}`);
    process.chdir(appPath);

    console.log(`Copying ${chalk.cyan('template')} and ${chalk.cyan('base files')}`)
    const rootDirName = path.resolve(__dirname, '..', '..');
    await cpy(['.*', '.**', '**', '*.**'], appPath, {
      parents: true,
      dot: true,
      cwd: path.join(rootDirName, 'templates', templateType),
    });

    let packageJSON;

    if(templateType === 'api'){
      packageJSON = apiPackageJSON;
    } else if (templateType === 'project'){
      packageJSON = projectPackageJSON;
    } 

    fs.writeFileSync(
      path.join(appPath, 'package.json'),
      JSON.stringify(packageJSON, null, 2) + os.EOL
    );

    console.log('Installing development dependencies...');
    await install(appPath, [
      "@google/clasp@2.3.0",
    ], true);

    console.log('Initializing git...');
    const gitInitialized = gitInit(appPath);
    if (gitInitialized) {
      console.log('Git repository initialized\n');
    } else {
      console.log(`${chalk.yellow('Attention!')} ${chalk.redBright('git repository it not initialized!')}`);
      console.log('Inside that directory, you need to run this commands:\n');
      console.log(chalk.cyan('   git init'));
    }

    console.log(`${chalk.green('Success!')} Created ${projectName} at ${chalk.cyan(appPath)}\n`);
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
  }

}