const fs = require('fs');
const sass = require('sass');
const { tmpdir } = require('os');

exports.compileScss = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const scssContent = req.files
        .map((file) => fs.readFileSync(file.path, 'utf8'))
        .join('\n');

    try {
        const result = sass.renderSync({ data: scssContent });
        req.files.forEach((file) => fs.unlinkSync(file.path));
        res.type('text/css').send(result.css);
    } catch (error) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
        res.status(500).send(error.message);
    }
};
