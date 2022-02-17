import chalk from "chalk";

const error = (text: string) => {
  console.log();
  console.log(chalk.red.bold("error: ") + text);
  console.log(); 
}

export default {
  error,
}
