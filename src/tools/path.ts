import path from "path";
import fs from 'fs';


export const getResolvedPath = (projectName: string) => {
  const isDev = process.env.NODE_ENV === "development"
  const appPath = isDev ? path.resolve(`./${projectName}`, 'test') : path.resolve(`./${projectName}`);

  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath, {
      recursive: true
    });
  }
  return appPath;

} 
