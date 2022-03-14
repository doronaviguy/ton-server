const { exec } = require("child_process");
const express = require("express");
const { cookieName } = require("../consts");
const { getDirectory } = require("../utils")
var router = express.Router();

router.post("/command", function (req, res) {
  const { command } = req.body;
  if (!command) {
    res.send("Command missing");
  }
  const directory = getDirectory(req.cookies[cookieName]);

  try {
    exec(`cd ${directory} && ${command}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.send("error");
      }

      res.send(stdout);
    });
  } catch (error) {
    res.send({ error });
  }
});

router.get("/commands", (req, res) => {
  const commands = ["ls", "rm"];
  res.status(200).send(commands);
});

router.post("/upload", function (req, res) {
  const directory = getDirectory(req.cookies[cookieName]);
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
    console.log(req.files);
  try {
    if (req.files.file) {
      const file = req.files.file;
      const path = `./${directory}/` + file.name;
      file.mv(path);
    } else {
      req.files.files.forEach((file) => {
        const path = `./${directory}/` + file.name;
        file.mv(path);
      });
    }

    return res.send({ status: "success" });
  } catch (error) {
    return res.status(500).send("Failed to upload files");
  }
});

module.exports = router;