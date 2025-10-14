const fs = require('fs');
const path = require('path');

// Patterns to find and replace
const patterns = [
  {
    // Remove DashboardLayout import
    find: /import DashboardLayout from ['"].*?DashboardLayout['"];?\s*\n/g,
    replace: ''
  },
  {
    // Add PageContainer import after other imports
    find: /(import.*from ['"]@mui\/material['"];?\s*\n)/,
    replace: '$1import PageContainer from \'../../components/common/PageContainer\';\n'
  },
  {
    // Replace <DashboardLayout> with <>
    find: /(\s*)return\s*\(\s*\n?\s*<DashboardLayout>\s*\n?/g,
    replace: '$1return (\n$1  <>\n'
  },
  {
    // Replace </DashboardLayout> with </>
    find: /\s*<\/DashboardLayout>\s*\n?\s*\);\s*$/gm,
    replace: '    </>\n  );'
  },
  {
    // Replace Container with PageContainer
    find: /<Container\s+maxWidth=["']?(lg|xl|md|sm|false)["']?\s*(?:sx={.*?})?\s*>/g,
    replace: '<PageContainer>'
  },
  {
    // Replace </Container> with </PageContainer>
    find: /<\/Container>/g,
    replace: '</PageContainer>'
  }
];

// List of files to process
const filesToProcess = [
  'TokenManagementV2.tsx',
  'merchant/MerchantProfile.tsx',
  'merchant/TokenGenerate.tsx',
  'merchant/ActiveTokens.tsx',
  'SimpleTokenize.tsx',
  'Settings.tsx',
  'Profile.tsx',
  'TokenManagement.tsx',
  'AdminConsole.tsx',
  'ComplianceDashboard.tsx',
  'SecurityDashboard.tsx',
  'MerchantPortal.tsx',
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern.find, pattern.replace);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Updated: ${filePath}`);
    } else {
      console.log(`- No changes: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

// Process all files
const pagesDir = path.join(__dirname, '../pages');
filesToProcess.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  } else {
    console.log(`✗ File not found: ${filePath}`);
  }
});

console.log('\nLayout fixes completed!');