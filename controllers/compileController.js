const fs = require('fs');
const sass = require('sass');
const { tmpdir } = require('os');

exports.compileScss = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const filesContent = {};

    req.files.forEach((file) => {
        filesContent[file.originalname] = fs.readFileSync(file.path, 'utf8');
    });

    const mainScssContent =
        Object.keys(filesContent)
            .map((filename) => {
                return `@import "${filename}";`;
            })
            .join('\n') +
        '\n' +
        filesContent['styles.scss'];

    try {
        const result = sass.renderSync({
            data: mainScssContent,
            includePaths: [tmpdir()],
        });

        req.files.forEach((file) => fs.unlinkSync(file.path));

        res.type('text/css').send(result.css);
    } catch (error) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
        res.status(500).send(error.message);
    }
};
