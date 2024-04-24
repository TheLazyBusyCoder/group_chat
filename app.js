const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "messages/");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}.wav`);
    },
});

const upload = multer({ storage: storage });

app.use(express.static("public"));

app.get(["/", "/send"], (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/view", (req, res) => {
    res.sendFile(__dirname + "/view.html");
});

app.use("/messages", express.static(path.join(__dirname, "messages")));
app.get("/get-messages", (req, res) => {
    const messagesDir = path.join(__dirname, "messages");
    fs.readdir(messagesDir, (err, files) => {
        if (err) {
            console.error("Error reading messages directory:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        const messages = files.filter((file) => file.endsWith(".wav"));
        res.json(messages);
    });
});

app.post("/upload-message", upload.single("audio"), (req, res) => {
    res.status(200).send("Message uploaded successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
