import chalk from 'chalk';
import { readConfig } from '../utils/readConfig.js';
import { generateFile } from '../utils/generator.js'; 
import { injectRoute } from '../utils/routeInjector.js';
export const generateCommand = async (type, name, options) => {
  try {
    const config = await readConfig();
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    console.log(chalk.bgCyan.black(` ForgeX Generator \n`));
    
    if (type === 'resource') {
      console.log(chalk.white(`Forging a customized resource for ${chalk.bold(formattedName)}...\n`));
      
      // Conditionally build the array based on user flags
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
      // Generate just the single requested file
      await generateFile(type, formattedName, options, config);

      if (type === 'route') {
        await injectRoute(formattedName);
      }
    }

    console.log(''); // Add a blank line at the end for clean terminal spacing

  } catch (error) {
    console.error(chalk.red('An unexpected error occurred:'), error);
  }
};