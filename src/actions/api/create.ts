import chalk from 'chalk';
import path from 'path';

import logger from '../../tools/logger';
import { getResolvedPath } from '../../tools/path';
import CopyingProjectService from '../../services/copyingProject';


export async function createApi({ projectName }: createApi) {
  try {
    const appPath = getResolvedPath(projectName);

    if (!projectName) {
      logger.error(chalk.blueBright("argument projectName not specified!"));
      process.exit(1);
    }

    const copyingProject = new CopyingProjectService();
    copyingProject.execute({ projectName, appPath, templateType: 'api' })
  } catch (error) {
    console.log('Could not create a new apps script project. Please try again', error);
  }
}
