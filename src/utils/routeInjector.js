import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export const injectRoute = async (name) => {
  try {
    const routesPath = path.join(process.cwd(), 'src', 'core', 'routes.js');
    const folderName = `${name.toLowerCase()}s`; // e.g., 'products'
    const routeFileName = `${name.toLowerCase()}.route.js`; // e.g., 'product.route.js'
    const routeVariableName = `${name.toLowerCase()}Routes`; // e.g., 'productRoutes'

    // 1. Read the central routes.js file
    let routesContent;
    try {
      routesContent = await fs.readFile(routesPath, 'utf-8');
    } catch (err) {
      console.log(chalk.yellow(`\n⚠ Could not find src/core/routes.js to auto-inject the route.`));
      return false;
    }

    const importStatement = `import ${routeVariableName} from '../modules/${folderName}/${routeFileName}';`;
    const registerStatement = `router.use('/${folderName}', ${routeVariableName});`;

    // 2. Prevent duplicate injections if they run the command twice
    if (routesContent.includes(importStatement) || routesContent.includes(registerStatement)) {
      return true; 
    }

    // 3. Inject the Import Statement
    const importAnchor = '// 1. Import module routes here';
    routesContent = routesContent.replace(
      importAnchor,
      `${importAnchor}\n${importStatement}`
    );

    // 4. Inject the Register Statement
    const registerAnchor = '// 2. Register module routes here';
    routesContent = routesContent.replace(
      registerAnchor,
      `${registerAnchor}\n${registerStatement}`
    );

    // 5. Save the updated file
    await fs.writeFile(routesPath, routesContent);
    console.log(chalk.green(`✔ Auto-injected route into: ${chalk.bold('src/core/routes.js')}`));
    
    return true;
  } catch (error) {
    console.error(chalk.red(`\n✖ Failed to inject route:`), error.message);
    return false;
  }
};