#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Running post-install script...');

// Create patches directory if it doesn't exist
const patchesDir = path.join(__dirname, '..', 'src', 'patches');
if (!fs.existsSync(patchesDir)) {
  fs.mkdirSync(patchesDir, { recursive: true });
}

console.log('Post-install script completed.');