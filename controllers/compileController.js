const fs = require('fs');
const sass = require('sass');
const path = require('path');

exports.compileScss = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const mainFileName = req.body.main || 'main.scss';

    try {
        const tempDir = fs.mkdtempSync(
            path.join(require('os').tmpdir(), 'scss-')
        );

        req.files.forEach((file) => {
            const tempFilePath = path.join(tempDir, file.originalname);
            fs.renameSync(file.path, tempFilePath);
        });

        const mainScssFile = path.join(tempDir, mainFileName);
        if (!fs.existsSync(mainScssFile)) {
            throw new Error(`Main SCSS file '${mainFileName}' not found.`);
        }
        const mainScssContent = fs.readFileSync(mainScssFile, 'utf8');

        const result = sass.compile({
            data: mainScssContent,
            includePaths: [tempDir],
        });

        fs.rmdirSync(tempDir, { recursive: true });

        res.type('text/css').send(result.css);
    } catch (error) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
        res.status(500).send(error.message);
    }
};
