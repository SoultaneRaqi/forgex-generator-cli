import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { readConfig } from '../utils/readConfig.js';

/**
 * Converts a folder name to a display-friendly resource name.
 * Handles both pluralized (products -> Product) and non-pluralized (auth -> Auth) folder names.
 */
const toDisplayName = (folderName) => {
  return folderName.charAt(0).toUpperCase() + folderName.slice(1);
};

export const listCommand = async () => {
  try {
    await readConfig();

    const modulesDir = path.join(process.cwd(), 'src', 'modules');

    let modules;
    try {
      modules = await fs.readdir(modulesDir, { withFileTypes: true });
    } catch (err) {
      console.log(chalk.yellow('\n⚠ No modules directory found. Run "forgex gen:resource <name>" to create one.\n'));
      return;
    }

    const resources = [];

    for (const mod of modules) {
      if (mod.isDirectory()) {
        const modPath = path.join(modulesDir, mod.name);
        const files = await fs.readdir(modPath);

        const hasController = files.some(f => f.includes('.controller.js'));
        const hasRoute = files.some(f => f.includes('.route.js'));
        const hasService = files.some(f => f.includes('.service.js'));
        const hasModel = files.some(f => f.includes('.model.js'));

        resources.push({
          Resource: toDisplayName(mod.name),
          Controller: hasController ? '✔' : '✖',
          Route: hasRoute ? '✔' : '✖',
          Service: hasService ? '✔' : '✖',
          Model: hasModel ? '✔' : '✖',
          Endpoint: hasRoute ? `/api/v1/${mod.name}` : 'Internal (No Route)'
        });
      }
    }

    console.log('\n' + chalk.bgCyan.black(' ForgeX Project Resources '));

    if (resources.length === 0) {
      console.log(chalk.yellow('\nNo resources found. Time to forge some!\n'));
    } else {
      console.log('');
      console.table(resources);
      console.log('');
    }

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error);
  }
};