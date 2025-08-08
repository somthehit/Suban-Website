# Authentication Setup Guide

This guide will help you set up secure admin authentication for the Suban Wildlife Photography website.

## Prerequisites

1. PostgreSQL database is running and connected
2. Environment variables are configured
3. All server dependencies are installed

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the server directory (copy from `.env.example`):

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/suban_website

# JWT Secret for authentication (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5001
NODE_ENV=development
```

**Important:** Generate a strong JWT secret key. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Database Migration

Add the password column to the users table:

```bash
cd server
npm run add-password-column
```

### 3. Create Superuser

Create the admin user with the provided credentials:

```bash
npm run create-superuser
```

This will create/update a user with:
- **Email:** somthehit@gmail.com
- **Password:** Dssmd@4admin
- **Role:** admin

### 4. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5001`

### 5. Test Authentication

1. Navigate to `http://localhost:3000/admin/login`
2. Use the superuser credentials to login
3. You should be redirected to the admin dashboard

## Security Features

✅ **Password Hashing:** Passwords are hashed using bcrypt with salt rounds  
✅ **JWT Tokens:** Secure token-based authentication with 24-hour expiry  
✅ **Protected Routes:** Admin routes require authentication  
✅ **CORS Protection:** Cross-origin request protection  
✅ **Helmet Security:** Additional security headers  
✅ **Input Validation:** Email and password validation  

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Protected Endpoints
All admin API endpoints require:
```
Authorization: Bearer <jwt-token>
```

## Important Security Notes

1. **Change Default Password:** After first login, create a mechanism to change the password
2. **JWT Secret:** Use a strong, unique JWT secret in production
3. **HTTPS:** Always use HTTPS in production
4. **Database Security:** Ensure your database credentials are secure
5. **Environment Variables:** Never commit `.env` files to version control

## Troubleshooting

### Login Issues
- Check database connection
- Verify JWT_SECRET is set
- Check server logs for errors
- Ensure the users table has the password column

### Token Issues
- Check if JWT_SECRET matches between login and verification
- Verify token expiry (24 hours)
- Check browser localStorage for stored tokens

### Database Issues
- Run `npm run test:db` to test database connection
- Check if the users table exists
- Verify the password column was added

## Next Steps

1. Implement password change functionality
2. Add password reset via email
3. Implement role-based permissions
4. Add session management
5. Set up proper logging for security events
