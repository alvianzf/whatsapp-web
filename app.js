const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Utilities imports
require('./utilities/db');
const { redisClient } = require('./utilities/redis-config');
require('./utilities/whatsapp-config');
require('./utilities/webhooks');

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/', require('./routes'));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    path: req.originalUrl,
    message: 'Endpoint not available!'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
