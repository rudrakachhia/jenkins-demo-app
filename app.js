const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the Node.js Jenkins CI/CD demo app! 🚀');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Only start the server when run directly (not when imported by tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
