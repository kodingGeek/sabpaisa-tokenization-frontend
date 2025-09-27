# Windows Setup Fix

## The Issue
`react-scripts` is not recognized on Windows PowerShell even though it's installed.

## Solution Options

### Option 1: Use npx (Recommended)
```powershell
# Instead of npm start, use:
npx react-scripts start
```

### Option 2: Reinstall node_modules on Windows
```powershell
# 1. Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Install dependencies
npm install

# 4. Try running again
npm start
```

### Option 3: Use npm run start
```powershell
# Sometimes this works better on Windows
npm run start
```

### Option 4: Install react-scripts globally (Not recommended for production)
```powershell
npm install -g react-scripts
npm start
```

### Option 5: Use Windows CMD instead of PowerShell
```cmd
# Open Command Prompt (not PowerShell)
cd D:\Manish\AI-hackathon-Tokenization\sabpaisa-tokenization\frontend
npm start
```

## Quick Fix Script for Windows

Create a file called `start.cmd` in the frontend directory:
```batch
@echo off
echo Starting SabPaisa Tokenization Frontend...
npx react-scripts start
```

Then run:
```powershell
.\start.cmd
```

## If Nothing Works

1. Check Node.js version:
```powershell
node --version  # Should be 18.x or higher
npm --version   # Should be 8.x or higher
```

2. Try with Yarn:
```powershell
# Install yarn globally
npm install -g yarn

# Install dependencies with yarn
yarn install

# Start with yarn
yarn start
```

## Verified Working Solution

The most reliable solution for Windows is:

```powershell
# 1. Open PowerShell as Administrator
# 2. Navigate to frontend directory
cd D:\Manish\AI-hackathon-Tokenization\sabpaisa-tokenization\frontend

# 3. Use npx to run react-scripts
npx react-scripts start
```

This should open the application at http://localhost:3000