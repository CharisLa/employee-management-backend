// src/server.js
import app from './app.js';
import db from '../models/index.js';

const PORT = process.env.PORT || 4000;

// Self-invoking bootstrap verifies the DB connection before accepting HTTP traffic.
(async () => {
  try {
    await db.sequelize.authenticate(); // Fail fast if credentials or connectivity are wrong.
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Unable to start server:', err.message);
    process.exit(1);
  }
})();
