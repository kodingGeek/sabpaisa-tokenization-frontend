const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Test if we can start a basic server
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Frontend Server Test</h1>
        <p>Server is running on port ${PORT}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});