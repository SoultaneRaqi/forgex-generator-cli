```markdown
# 🛠️ ForgeX CLI

**ForgeX CLI** is a developer-experience focused command line tool for **Node.js and Express** that generates production-ready backend architectures and removes repetitive boilerplate.  

Inspired by **Laravel Artisan**, ForgeX helps developers scaffold controllers, routes, services, and models while automatically wiring them together. The goal is to make building scalable Express backends **faster, cleaner, and more structured**.

---

# 🚀 Why ForgeX?

Express is extremely flexible, but it does not enforce a default project structure. Every developer ends up reinventing the same architecture and writing the same boilerplate code.

ForgeX solves this by:

- Generating **standardized backend architectures**
- Automating **file generation**
- Auto-wiring routes into the application
- Integrating **Prisma ORM**
- Providing a **Laravel-like development workflow**

Instead of spending time creating folders and files manually, developers can focus on building features.

---

# ✨ Features

### Project Scaffolding
Generate a fully structured Node.js + Express backend with one command.

### Architecture Selection
Choose between:

**Standard (Layered Architecture)**

```

src/
controllers/
routes/
services/
models/
middlewares/
config/

```

**Advanced (Modular / Feature-Based Architecture)**

```

src/
core/
modules/
users/
user.controller.js
user.service.js
user.routes.js
user.model.js

````

### File Generators
Create backend components instantly:

- Controllers
- Routes
- Services
- Models

### Auto Route Wiring
When a route is generated, ForgeX automatically:

- imports the route
- registers it in `app.js`

Example:

```js
app.use('/api/users', userRoutes)
````

No manual editing required.

### Prisma ORM Integration

ForgeX can configure **Prisma** automatically for:

* PostgreSQL
* MySQL
* MongoDB

### Resource Generator

Generate a complete backend resource:

```
Controller
Service
Model
Route
```

All connected automatically.

### Postman Collection Generator

ForgeX automatically generates and updates:

```
postman_collection.json
```

Developers can instantly test new endpoints.

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/SoultaneRaqi/ForgeX-CLI.git
```

Enter the project:

```bash
cd ForgeX-CLI
```

Install dependencies:

```bash
npm install
```

Link the CLI locally:

```bash
npm link
```

Now the `forgex` command is available globally.

---

# ⚙️ Usage

### Initialize a Project

```bash
forgex init
```

You will be prompted to select the architecture:

```
? Select project architecture
  Standard (Layered)
  Advanced (Modular)
```

ForgeX will generate:

* project structure
* Express server
* configuration files
* dependencies

---

### Create a Controller

```bash
forgex make:controller user
```

Generated file:

```
src/controllers/user.controller.js
```

Includes basic CRUD functions.

---

### Create a Route

```bash
forgex make:route user
```

ForgeX will:

* create `user.routes.js`
* auto-import it
* register it inside `app.js`

---

### Create a Model

```bash
forgex make:model user
```

ForgeX will update:

```
prisma/schema.prisma
```

---

### Create a Service

```bash
forgex make:service user
```

Includes boilerplate Prisma CRUD operations.

---

### Create a Full Resource

```bash
forgex make:resource user
```

This generates:

```
controller
service
model
route
```

All connected automatically.

---

### Run Database Migration

```bash
forgex migrate
```

Wrapper for:

```
npx prisma migrate dev
```

---

# 🧠 Example Generated Structure

Advanced architecture example:

```
my-api/
│
├── src/
│   ├── core/
│   │   ├── config
│   │   └── middlewares
│   │
│   ├── modules/
│   │   └── users/
│   │       ├── user.controller.js
│   │       ├── user.service.js
│   │       ├── user.routes.js
│   │       └── user.model.js
│   │
│   ├── app.js
│   └── server.js
│
├── prisma/
│   └── schema.prisma
│
├── postman_collection.json
├── package.json
└── .env
```

---

# 🧰 Tech Stack

ForgeX is built using:

* **Node.js**
* **Commander** (CLI command parsing)
* **Inquirer** (interactive prompts)
* **Chalk** (terminal styling)
* **Ora** (CLI loading spinners)
* **EJS** (file templates)
* **Prisma** (database ORM)

---

# 🗺️ Roadmap

### v1.0.0

* CLI foundation
* Project scaffolding
* Controller and route generators
* Auto route wiring

### v1.5.0

* Prisma ORM integration
* Model and service generators
* Database migration command

### v2.0.0

* `make:resource`
* Postman collection auto generation

### v3.0.0

* Plugin system
* GraphQL templates
* WebSocket templates
* Jest testing generator

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve ForgeX:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Created by **Soultane Raqi**

GitHub:
[https://github.com/SoultaneRaqi](https://github.com/SoultaneRaqi)

---

# ⚡ Vision

ForgeX aims to become the **standard scaffolding tool for Express developers**, bringing the same developer productivity that **Laravel Artisan provides to PHP**.

---

**Forged with 🪓 using ForgeX**

```
```
