const express = require('express');
const uploadMiddleware = require('./middlewares/uploadMiddleware');
const compileController = require('./controllers/compileController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/compile-scss', uploadMiddleware, compileController.compileScss);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
