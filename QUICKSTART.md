# Quick Start Guide for Probe Browser

## Step 1: MySQL Setup

### Install MySQL (if not already installed)

**macOS:**
```bash
brew install mysql
brew services start mysql
```

### Secure MySQL Installation (Optional but Recommended)
```bash
mysql_secure_installation
```

### Create Database Manually (Optional - App does this automatically)
```bash
mysql -u root -p
CREATE DATABASE probe_browser;
exit;
```

## Step 2: Configure Database Connection

Edit `src/main/database.ts` and update your MySQL credentials:

```typescript
this.connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YOUR_PASSWORD_HERE', // Update this
  database: 'probe_browser',
});
```

Update in both places where the connection is created (lines ~17 and ~45).

## Step 3: Build the Application

```bash
# Build the project
npm run build
```

## Step 4: Run the Application

```bash
# Start the browser
npm start
```

## Troubleshooting

### MySQL Connection Error
- Make sure MySQL is running: `brew services list`
- Check credentials in `src/main/database.ts`
- Verify MySQL is listening on port 3306

### Build Errors
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Run `npm run build`

### Port Already in Use (Development Mode)
- Kill the process on port 3000: `lsof -ti:3000 | xargs kill -9`
- Try running again

## Development Workflow

1. Make changes to source files in `src/`
2. Run `npm run build` to compile
3. Run `npm start` to test

OR use development mode (hot reload):

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm start
```

## Features to Try

1. **Browse the Web**: Type a URL in the address bar (e.g., `google.com`)
2. **Add Bookmarks**: Click the ★ button while on any page
3. **View Bookmarks**: Click the 📚 button to see all bookmarks
4. **Check History**: Click the 🕐 button to view browsing history
5. **Navigate**: Use ← → buttons to go back/forward

Enjoy your custom browser! 🚀
