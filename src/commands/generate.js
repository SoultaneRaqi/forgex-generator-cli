import chalk from 'chalk';
import { readConfig } from '../utils/readConfig.js';
import { generateFile } from '../utils/generator.js';
import { injectRoute } from '../utils/routeInjector.js';

/**
 * Validates a resource/file name before generation.
 * Returns an error message string if invalid, or null if valid.
 */
const validateName = (name) => {
  if (!name || name.trim() === '') {
    return 'Name cannot be empty.';
  }
  if (!/^[a-zA-Z]/.test(name)) {
    return 'Name must start with a letter. (e.g. "Product", not "1Product")';
  }
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'Name can only contain letters and numbers — no spaces, hyphens, or special characters.';
  }
  return null;
};

export const generateCommand = async (type, name, options) => {
  try {
    // --- Input Validation ---
    const validationError = validateName(name);
    if (validationError) {
      console.error(chalk.red.bold(`\n✖ Invalid name: "${name}"`));
      console.error(chalk.yellow(`  ${validationError}\n`));
      process.exit(1);
    }

    const config = await readConfig();
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    console.log(chalk.bgCyan.black(` ForgeX Generator \n`));

    if (type === 'resource') {
      console.log(chalk.white(`Forging a customized resource for ${chalk.bold(formattedName)}...\n`));

      const filesToGenerate = [];
      if (options.controller) filesToGenerate.push('controller');
      if (options.route) filesToGenerate.push('route');
      if (options.service) filesToGenerate.push('service');
      if (options.model) filesToGenerate.push('model');

      for (const fileType of filesToGenerate) {
        await generateFile(fileType, formattedName, options, config);
      }

      if (options.route) {
        await injectRoute(formattedName);
      }

    } else {
      console.log(chalk.white(`Forging ${chalk.bold(type)} for ${chalk.bold(formattedName)}...\n`));
      await generateFile(type, formattedName, options, config);

      if (type === 'route') {
        await injectRoute(formattedName);
      }
    }

    console.log('');

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error);
  }
};