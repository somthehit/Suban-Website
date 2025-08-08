# Suban Chaudhary Wildlife Photography Website

A modern, fully dynamic full-stack wildlife photography website built with React, Vite, TailwindCSS, Express.js, and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd suban-website
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your actual Supabase credentials and other configuration values.

## 🔧 Development

### Important: Environment Variable Loading

This project uses a **critical configuration fix** for environment variable loading. The server is configured to load environment variables **before** any module imports to prevent import hoisting issues.

#### Why This Matters

JavaScript/TypeScript import statements are "hoisted" and executed before any other code. If environment variables aren't loaded before imports, modules that depend on `process.env` values will fail with "Missing environment variables" errors.

#### Our Solution

The server dev script uses the `-r dotenv/config` flag to preload environment variables:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only -r dotenv/config src/index.ts"
  }
}
```

**Key Points:**
- The `-r dotenv/config` flag ensures dotenv runs **before** any imports
- This prevents the import hoisting issue documented in `/server/docs/import-hoisting-issue.md`
- Always use the provided dev scripts instead of running files directly

### Development Commands

#### Start the full development environment:
```bash
npm run dev
```
This starts both client and server concurrently.

#### Start individual services:
```bash
# Client only (React + Vite)
npm run dev:client

# Server only (Express.js)
npm run dev:server
```

#### Other useful commands:
```bash
# Build for production
npm run build

# Start production server
npm run start

# Test Supabase connection
npm run test:supabase --workspace=server

# Type checking
npm run type-check --workspace=server
```

## 📁 Project Structure

```
suban-website/
├── client/                 # React frontend (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── layouts/        # Layout components
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   ├── docs/               # Technical documentation
│   └── package.json
├── shared/                 # Shared types and utilities
│   ├── types/              # Shared TypeScript types
│   ├── schemas/            # Validation schemas
│   └── package.json
├── .env.example           # Environment variables template
└── package.json           # Root workspace configuration
```

## 🔐 Environment Variables

The project requires several environment variables. Copy `.env.example` to `.env` and fill in your values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server Configuration
PORT=3001
NODE_ENV=development

# Email Configuration (optional for development)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

## 🗄️ Database

This project uses Supabase as the backend database and authentication provider. The database schema includes:

- **Users**: Admin authentication
- **Blog Posts**: Wildlife blog content
- **Gallery**: Photo management
- **Messages**: Contact form submissions
- **Join Requests**: Membership applications

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Router** for client-side routing

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Supabase** for database and authentication
- **Zod** for runtime validation

### Development Tools
- **ts-node-dev** for TypeScript development server
- **ESLint** for code linting
- **Concurrently** for running multiple services
- **dotenv** for environment variable management

## 🔧 Troubleshooting

### "Missing Supabase environment variables" Error

If you see this error, it means environment variables aren't loading properly:

1. **Check your `.env` file exists** and has the correct values
2. **Always use the npm scripts** instead of running files directly:
   ```bash
   # ✅ Correct - uses -r dotenv/config
   npm run dev:server
   
   # ❌ Wrong - will cause import hoisting issues
   ts-node-dev src/index.ts
   ```
3. **Verify the dev script** in `server/package.json` includes `-r dotenv/config`

### Import Hoisting Issues

For detailed technical information about import hoisting and why our configuration works, see:
- `/server/docs/import-hoisting-issue.md`

## 📚 Additional Documentation

- [Import Hoisting Technical Analysis](./server/docs/import-hoisting-issue.md)
- [Supabase Configuration Guide](./server/src/config/supabase.ts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is private and proprietary to Suban Chaudhary.

---

**⚠️ Remember**: Always use the provided npm scripts for development to ensure proper environment variable loading!
