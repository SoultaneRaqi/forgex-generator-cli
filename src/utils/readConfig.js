import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export const readConfig = async () => {
  // process.cwd() gets the folder where the user is currently typing the command
  const configPath = path.join(process.cwd(), 'forgex.fx');
  
  try {
    const fileData = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    // If the file doesn't exist, they aren't in a ForgeX project!
    if (error.code === 'ENOENT') {
      console.error(chalk.red.bold('\n✖ ForgeX Error: forgex.fx not found!'));
      console.error(chalk.yellow('Make sure you are running this command inside the root of a ForgeX generated project.\n'));
      process.exit(1);
    }
    
    // If the file exists but isn't valid JSON
    console.error(chalk.red.bold('\n✖ ForgeX Error: Could not parse forgex.fx.'));
    console.error(chalk.yellow('The file might be corrupted.\n'));
    process.exit(1);
  }
};