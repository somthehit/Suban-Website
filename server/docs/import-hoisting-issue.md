# Import Hoisting Issue: Root Cause Analysis

## Problem Statement

When running the Node.js/Express server with `ts-node-dev`, the application throws an error:
```
Missing Supabase environment variables
```

This occurs even though `dotenv.config()` is called in `src/index.ts` before any route usage.

## Root Cause: Import Hoisting in CommonJS/TypeScript

### The Import Chain

The issue stems from the following import chain:

1. `src/index.ts` imports `./routes/blog.routes` (line 7)
2. `src/routes/blog.routes.ts` imports `../controllers/blogController` (line 2)  
3. `src/controllers/blogController.ts` imports `../config/supabase` (line 2)
4. `src/config/supabase.ts` attempts to read `process.env.VITE_SUPABASE_URL` (line 4)

### Import Execution Order

**In CommonJS/TypeScript environments, ALL `import` statements are executed BEFORE any other top-level code.**

This means the actual execution order is:

1. **FIRST**: All imports are resolved and executed
   - `blog.routes` is imported
   - `blogController` is imported  
   - `supabase.ts` is imported and executed
   - `supabase.ts` tries to read `process.env.VITE_SUPABASE_URL` → **UNDEFINED** (because dotenv hasn't run yet)
   - Error thrown: "Missing Supabase environment variables"

2. **SECOND**: Top-level code in `index.ts` would execute
   - `dotenv.config()` would load environment variables → **TOO LATE**

### Why This Happens

- **Import hoisting**: ES6 imports (and their CommonJS equivalents) are "hoisted" to the top of the execution context
- **Static analysis**: The JavaScript engine analyzes all imports before executing any code
- **Module dependency resolution**: All imported modules must be fully loaded and executed before the importing module can run

### Code Evidence

In `src/index.ts`:
```typescript
import blogRoutes from './routes/blog.routes'; // This executes FIRST (including all nested imports)

// This executes SECOND (too late!)
dotenv.config();
console.log('dotenv loaded?', process.env.VITE_SUPABASE_URL);
```

In `src/config/supabase.ts`:
```typescript
// This code runs during import hoisting, BEFORE dotenv.config()
const supabaseUrl = process.env.VITE_SUPABASE_URL; // undefined!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // undefined!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables'); // This throws!
}
```

## Technical Details

### Module Loading in Node.js

1. **Parse Phase**: Node.js parses the file and identifies all `import`/`require` statements
2. **Dependency Resolution**: Recursively loads and executes all dependencies
3. **Module Execution**: Only after all dependencies are loaded does the main module code execute

### TypeScript Compilation

When TypeScript compiles to CommonJS, imports become `require()` calls that are executed synchronously at the top of the module, maintaining the same hoisting behavior.

## Impact on Development Tools

This issue is particularly problematic with development tools like:
- `ts-node-dev`
- `nodemon` with `ts-node`
- Direct `node` execution of compiled JavaScript

These tools respect the CommonJS module loading semantics, causing the environment variables to be unavailable during the import phase.

## Summary

The root cause is **import hoisting**: the JavaScript/TypeScript module system executes ALL imports and their dependencies BEFORE executing any other top-level code. Since `supabase.ts` is imported through the chain `index.ts` → `blog.routes.ts` → `blogController.ts` → `supabase.ts`, it tries to access environment variables before `dotenv.config()` has been called.

This is not a bug in the code logic, but rather the expected behavior of how modules are loaded in CommonJS/Node.js environments.

## Solution Implemented

The issue has been resolved by configuring the development server to preload environment variables using the `-r dotenv/config` flag:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only -r dotenv/config src/index.ts"
  }
}
```

This ensures that `dotenv.config()` runs **before** any module imports, preventing the hoisting issue entirely.

## See Also

- [Project README](../../README.md) - Complete development setup and troubleshooting guide
- [Supabase Configuration](../src/config/supabase.ts) - The configuration file that depends on environment variables
