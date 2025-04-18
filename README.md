# Express TypeScript CLI

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A professional command-line interface for quickly scaffolding Express TypeScript applications with clean architecture.

![CLI Demo](https://example.com/cli-demo.gif)

## Features

- 🚀 **Quick Scaffolding**: Generate Express TypeScript applications in seconds
- 🏗️ **Clean Architecture**: Choose between base structure or full CRUD template
- 📦 **Production Ready**: Includes all the necessary dependencies and configuration
- 🔧 **Flexible**: Customize your project with interactive prompts
- 🎨 **Beautiful UI**: Colorful terminal output with animations

## Installation

### Global Installation (recommended)

```bash
npm install -g hektor-cli
```

### Local Installation

```bash
npm install hektor-cli
```

## Usage

### Initialize a new Express TypeScript project

```bash
hektor init
```

This command starts an interactive prompt that guides you through creating a new Express TypeScript application:

1. Enter a project name (defaults to "express-ts-app")
2. Choose a template:
   - **Base Template**: Provides a clean architecture with routes, controllers, services, and DTOs folder structure
   - **CRUD Template**: Includes everything from the base template plus a complete working example of CRUD operations

## Project Structure

### Base Template

```
express-ts-app/
├── src/
│   ├── controllers/
│   ├── routes/
│   │   └── index.ts
│   ├── services/
│   ├── models/
│   ├── dtos/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   │   └── database.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

### CRUD Template

Includes everything from the base template plus:

```
express-ts-app/
├── src/
│   ├── controllers/
│   │   └── UserController.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   └── UserService.ts
│   ├── models/
│   │   └── User.ts
│   ├── dtos/
│   │   └── UserDto.ts
│   └── ...
└── ...
```

## CRUD API Endpoints

When using the CRUD template, the following REST API endpoints are available:

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update an existing user
- `DELETE /api/users/:id` - Delete a user

## Development

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/hektor-cli.git
cd hektor-cli
```

2. Install dependencies
```bash
npm install
```

3. Link the package locally
```bash
npm link
```

4. Run the CLI
```bash
hektor init
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Commander.js](https://github.com/tj/commander.js/)
- [Chalk](https://github.com/chalk/chalk)
- [Inquirer](https://github.com/SBoudrias/Inquirer.js/)

## Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

---

Made with ❤️ and code