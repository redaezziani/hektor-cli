import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import terminalLink from 'terminal-link';
import chalkPipe from 'chalk-pipe';
import ora from 'ora';
import inquirer from 'inquirer';
import { sleep } from '../utils/helpers.js';
import { PROJECT_TYPES } from '../constants/project-types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Handle exit gracefully
process.on('SIGINT', () => {
  console.log('\n');
  console.log(chalk.cyan('👋 Goodbye! CLI execution was cancelled.'));
  process.exit(0);
});

export async function init(options) {
  // Custom inquirer prompt handler to catch CTRL+C
  const promptWithCatch = async (prompts) => {
    try {
      return await inquirer.prompt(prompts);
    } catch (error) {
      if (error.message && error.message.includes('User force closed the prompt')) {
        console.log('\n');
        console.log(chalk.cyan('👋 Goodbye! CLI execution was cancelled.'));
        process.exit(0);
      }
      throw error;
    }
  };
  console.log("\n");
  const rainbow = chalkAnimation.karaoke(' Welcome to Hektor');
  await sleep(2000);
  rainbow.stop();

  // Use the custom prompt handler instead of direct inquirer calls
  const nameAnswer = await promptWithCatch([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      default: 'express-ts-app',
      validate: (input) => input.trim() !== '' ? true : 'Project name cannot be empty'
    }
  ]);
  
  const projectName = nameAnswer.name;
  
  const templateAnswer = await promptWithCatch([
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { name: 'Base (Routes, Controllers, Services, DTOs structure)', value: 'express-ts-base' },
        { name: 'CRUD (Base + CRUD operations sample)', value: 'express-ts-crud' }
      ],
    }
  ]);
  
  const templateType = templateAnswer.template;
  
  // Ask about code formatting, linting and git using checkboxes instead of yes/no prompts
  const configOptionAnswer = await promptWithCatch([
    {
      type: 'checkbox',
      name: 'options',
      message: 'Select configuration options:',
      choices: [
        { 
          name: chalk.blue('Prettier') + chalk.gray(' - Code formatting'),
          value: 'prettier',
          checked: true
        },
        {
          name: chalk.yellow('ESLint') + chalk.gray(' - Code linting'),
          value: 'eslint',
          checked: true
        },
        {
          name: chalk.green('Git') + chalk.gray(' - Initialize repository'),
          value: 'git',
          checked: true
        }
      ]
    }
  ]);
  
  const selectedOptions = configOptionAnswer.options;
  const prettier = selectedOptions.includes('prettier');
  const eslint = selectedOptions.includes('eslint');
  const git = selectedOptions.includes('git');
  
  const spinner = ora({
    text: `Creating ${chalk.cyan(templateType)} project...`,
    color: 'cyan',
  }).start();
  
  try {
    const projectDir = path.join(process.cwd(), projectName);
    await fs.mkdir(projectDir, { recursive: true });
    
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: 'Express TypeScript Application',
      main: 'dist/index.js',
      scripts: {
        start: 'node dist/index.js',
        dev: 'nodemon --exec ts-node src/index.ts',
        build: 'tsc',
        test: 'jest'
      },
      keywords: ['express', 'typescript', 'api'],
      author: '',
      license: 'ISC',
      dependencies: {
        'express': '^4.18.2',
        'body-parser': '^1.20.2',
        'cors': '^2.8.5',
        'dotenv': '^16.3.1'
      },
      devDependencies: {
        '@types/express': '^4.17.21',
        '@types/cors': '^2.8.17',
        '@types/node': '^20.10.5',
        'typescript': '^5.3.3',
        'ts-node': '^10.9.2',
        'nodemon': '^3.0.2',
        'jest': '^29.7.0',
        '@types/jest': '^29.5.11',
        'ts-jest': '^29.1.1'
      }
    };
    
    // Add Prettier configuration if selected
    if (prettier) {
      packageJson.devDependencies['prettier'] = '^3.0.3';
      packageJson.scripts['format'] = 'prettier --write "src/**/*.ts"';
      
      await fs.writeFile(
        path.join(projectDir, '.prettierrc'),
        JSON.stringify({
          semi: true,
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 100,
          tabWidth: 2
        }, null, 2)
      );
    }
    
    // Add ESLint configuration if selected
    if (eslint) {
      packageJson.devDependencies['eslint'] = '^8.55.0';
      packageJson.devDependencies['@typescript-eslint/eslint-plugin'] = '^6.14.0';
      packageJson.devDependencies['@typescript-eslint/parser'] = '^6.14.0';
      packageJson.scripts['lint'] = 'eslint "src/**/*.ts"';
      packageJson.scripts['lint:fix'] = 'eslint "src/**/*.ts" --fix';
      
      await fs.writeFile(
        path.join(projectDir, '.eslintrc.json'),
        JSON.stringify({
          "parser": "@typescript-eslint/parser",
          "plugins": ["@typescript-eslint"],
          "extends": [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended"
          ],
          "rules": {
            "no-console": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-unused-vars": "error"
          },
          "parserOptions": {
            "ecmaVersion": 2022,
            "sourceType": "module"
          },
          "env": {
            "node": true,
            "es6": true
          }
        }, null, 2)
      );
    }
    
    // Combine Prettier and ESLint if both are selected
    if (prettier && eslint) {
      packageJson.devDependencies['eslint-config-prettier'] = '^9.1.0';
      packageJson.devDependencies['eslint-plugin-prettier'] = '^5.0.1';
      
      // Update ESLint config to work with Prettier
      const eslintConfig = {
        "parser": "@typescript-eslint/parser",
        "plugins": ["@typescript-eslint", "prettier"],
        "extends": [
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:prettier/recommended"
        ],
        "rules": {
          "no-console": "warn",
          "@typescript-eslint/explicit-function-return-type": "warn",
          "@typescript-eslint/no-unused-vars": "error",
          "prettier/prettier": "error"
        },
        "parserOptions": {
          "ecmaVersion": 2022,
          "sourceType": "module"
        },
        "env": {
          "node": true,
          "es6": true
        }
      };
      
      await fs.writeFile(
        path.join(projectDir, '.eslintrc.json'),
        JSON.stringify(eslintConfig, null, 2)
      );
    }
    
    await fs.writeFile(
      path.join(projectDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    const tsConfig = {
      compilerOptions: {
        target: 'es2022',
        module: 'commonjs',
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', '**/*.test.ts']
    };
    
    await fs.writeFile(
      path.join(projectDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
    
    await fs.writeFile(
      path.join(projectDir, '.env'),
      'PORT=3000\nNODE_ENV=development\n'
    );
    
    await fs.writeFile(
      path.join(projectDir, '.gitignore'),
      'node_modules\ndist\n.env\n.DS_Store\n'
    );
    
    const folders = [
      'src',
      'src/controllers',
      'src/routes',
      'src/services',
      'src/models',
      'src/dtos',
      'src/middlewares',
      'src/utils',
      'src/config'
    ];
    
    for (const folder of folders) {
      await fs.mkdir(path.join(projectDir, folder), { recursive: true });
    }
    
    
    await fs.writeFile(
      path.join(projectDir, 'src', 'index.ts'),
      `import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as apiRouter } from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express TypeScript API' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`
    );
    
    await fs.writeFile(
      path.join(projectDir, 'src', 'routes', 'index.ts'),
      `import { Router } from 'express';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export { router };
`
    );
    
    await fs.writeFile(
      path.join(projectDir, 'src', 'config', 'database.ts'),
      `// Database configuration will go here
// Example for MongoDB connection:
/*
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
*/
`
    );
    
    if (templateType === 'express-ts-crud') {
      await fs.writeFile(
        path.join(projectDir, 'src', 'models', 'User.ts'),
        `export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// This is a mock database for example purposes
export const users: User[] = [];
`
      );
      
      await fs.writeFile(
        path.join(projectDir, 'src', 'dtos', 'UserDto.ts'),
        `export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}
`
      );
      
      await fs.writeFile(
        path.join(projectDir, 'src', 'services', 'UserService.ts'),
        `import { User, users } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../dtos/UserDto';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  getAllUsers(): User[] {
    return users;
  }
  
  getUserById(id: string): User | undefined {
    return users.find(user => user.id === id);
  }
  
  createUser(userData: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    return newUser;
  }
  
  updateUser(id: string, userData: UpdateUserDto): User | undefined {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return undefined;
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date()
    };
    
    users[userIndex] = updatedUser;
    return updatedUser;
  }
  
  deleteUser(id: string): boolean {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }
    
    users.splice(userIndex, 1);
    return true;
  }
}
`
      );
      
      await fs.writeFile(
        path.join(projectDir, 'src', 'controllers', 'UserController.ts'),
        `import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto } from '../dtos/UserDto';

const userService = new UserService();

export class UserController {
  getAllUsers(req: Request, res: Response): void {
    const users = userService.getAllUsers();
    res.json(users);
  }
  
  getUserById(req: Request, res: Response): void {
    const id = req.params.id;
    const user = userService.getUserById(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  }
  
  createUser(req: Request, res: Response): void {
    const userData: CreateUserDto = req.body;
    
    if (!userData.name || !userData.email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }
    
    const newUser = userService.createUser(userData);
    res.status(201).json(newUser);
  }
  
  updateUser(req: Request, res: Response): void {
    const id = req.params.id;
    const userData: UpdateUserDto = req.body;
    
    const updatedUser = userService.updateUser(id, userData);
    
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(updatedUser);
  }
  
  deleteUser(req: Request, res: Response): void {
    const id = req.params.id;
    const deleted = userService.deleteUser(id);
    
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(204).send();
  }
}
`
      );
      
      await fs.writeFile(
        path.join(projectDir, 'src', 'routes', 'userRoutes.ts'),
        `import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export { router as userRouter };
`
      );
      
      await fs.writeFile(
        path.join(projectDir, 'src', 'routes', 'index.ts'),
        `import { Router } from 'express';
import { userRouter } from './userRoutes';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Use user routes
router.use('/users', userRouter);

export { router };
`
      );
      
      packageJson.dependencies['uuid'] = '^9.0.1';
      packageJson.devDependencies['@types/uuid'] = '^9.0.7';
      
      await fs.writeFile(
        path.join(projectDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
    }
    
    // Initialize Git repository if selected
    if (git) {
      try {
        spinner.info('Initializing Git repository...');
        execSync('git init', { cwd: projectDir });
        execSync('git add .', { cwd: projectDir });
        execSync('git commit -m "Initial commit from Hektor CLI"', { 
          cwd: projectDir,
          env: { ...process.env, GIT_COMMITTER_NAME: 'Hektor CLI', GIT_COMMITTER_EMAIL: 'hektor@example.com' }
        });
        spinner.succeed('Git repository initialized');
      } catch (gitError) {
        spinner.warn(`Git initialization failed: ${gitError.message}`);
        console.log(chalk.yellow('You can initialize git manually after project setup.'));
      }
    }
    
    spinner.succeed(`${chalk.green('Successfully')} created ${chalk.cyan(templateType)} project!`);
    
    console.log('\n');
    console.log(chalk.green.bold('✅ Project initialized successfully!'));
    console.log(chalk.yellow('Run the following commands to get started:'));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));
    console.log('\n');
    
    if (prettier) {
      console.log(chalk.blue('🔍 Code formatting:'));
      console.log(chalk.cyan('  npm run format  - Format code with Prettier'));
    }
    
    if (eslint) {
      console.log(chalk.blue('🔍 Code linting:'));
      console.log(chalk.cyan('  npm run lint     - Check for code issues'));
      console.log(chalk.cyan('  npm run lint:fix - Fix code issues automatically'));
    }
    
    if (templateType === 'express-ts-crud') {
      console.log(chalk.magenta('✨ CRUD API endpoints:'));
      console.log(chalk.cyan('  GET    /api/users     - Get all users'));
      console.log(chalk.cyan('  GET    /api/users/:id - Get user by ID'));
      console.log(chalk.cyan('  POST   /api/users     - Create new user'));
      console.log(chalk.cyan('  PUT    /api/users/:id - Update user'));
      console.log(chalk.cyan('  DELETE /api/users/:id - Delete user'));
      console.log('\n');
    }
    
  } catch (error) {
    spinner.fail(`Failed to create project: ${error.message}`);
    console.error(chalk.red('Error details:'), error);
  }
}