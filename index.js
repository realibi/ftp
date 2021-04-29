const http = require("http");
const path = require("path");
const fs = require("fs");

const express = require("express");

const app = express();
const httpServer = http.createServer(app);

const multer = require("multer");

const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "./tempFiles"
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

app.get("/", express.static(path.join(__dirname, "./public")));

app.get("/:filename", (req, res) => {
    let filename = req.params.filename;
    res.sendFile(path.join(__dirname, "./uploads/" + filename));
});

app.post(
    "/upload",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {
        const tempPath = req.file.path;

        let randomPostfix = (Math.floor(Math.random() * 1000000) + 1).toString();

        let targetPathWithoutExt = path.join(__dirname, `./uploads/${randomPostfix}`);
        let targetPath =  targetPathWithoutExt + path.extname(req.file.originalname);
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);

            res
                .status(200)
                .contentType("text/plain")
                .end(targetPath);
        });
    }
);
