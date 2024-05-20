const express = require('express');
const uploadMiddleware = require('./middlewares/uploadMiddleware');
const compileController = require('./controllers/compileController');

const app = express();

app.post('/api/compile-scss', uploadMiddleware, compileController.compileScss);

module.exports = app;
