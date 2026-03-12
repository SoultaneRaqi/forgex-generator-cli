import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateFile = async (type, name, options, config) => {
  try {
    const folderName = `${name.toLowerCase()}s`; // e.g., 'User' -> 'users'
    const fileName = `${name.toLowerCase()}.${type}.js`; // e.g., 'user.controller.js'
    
    // Target path: user-project/src/modules/users/user.controller.js
    const targetDir = path.join(process.cwd(), 'src', 'modules', folderName);
    const targetPath = path.join(targetDir, fileName);

    // Template path: ForgeX-CLI/src/templates/components/controller.ejs
    const templatePath = path.join(__dirname, '../templates/components', `${type}.ejs`);

    // 1. Ensure the target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // 2. Check if the file already exists to prevent accidental overwrites
    try {
      await fs.access(targetPath);
      // If we get here, the file exists! Check for the --force flag
      if (!options.force) {
        console.log(chalk.yellow(`\n⚠ Skipped: ${chalk.bold(fileName)} already exists.`));
        console.log(chalk.gray(`  (Use --force to overwrite)`));
        return false;
      }
      console.log(chalk.yellow(`\n⚠ Overwriting existing ${chalk.bold(fileName)}...`));
    } catch (err) {
      // File doesn't exist, which is perfect. Proceed.
    }

    // 3. Compile the EJS template
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledCode = ejs.render(templateContent, {
      name, // e.g., 'User'
      config,
      options
    });

    // 4. Write the file
    await fs.writeFile(targetPath, compiledCode);

    // 5. Print the beautiful success message
    console.log(chalk.green(`✔ Created: ${chalk.bold(`src/modules/${folderName}/${fileName}`)}`));
    return true;

  } catch (error) {
    console.error(chalk.red(`\n✖ Failed to generate ${type}:`), error.message);
    return false;
  }
};