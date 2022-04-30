const express = require("express");
const router = express.Router();

const path = require("path");
const fs = require("fs");
const root = path.resolve(__dirname, "../root"); // path.resolve(__dirname, "../root")    'C:\\Users\\mdsay'

router.get("/*", (req, res) => {
  if (!fs.existsSync(path.resolve(root, req.params[0]))) {
    res.status(400).json({ error: "directory not found!" });
  } else {
    const folderContent =
      req.params[0] === "root"
        ? fs.readdirSync(root)
        : fs.readdirSync(path.resolve(root, req.params[0]));

    const folders = [];
    const files = [];

    folderContent.forEach((item) => {
      if (
        req.params[0] === "root"
          ? fs.lstatSync(path.resolve(root, item)).isDirectory()
          : fs.lstatSync(path.resolve(root, req.params[0], item)).isDirectory()
      ) {
        folders.push(item);
      } else {
        files.push(item);
      }
    });

    const response = {
      folders: folders,
      files: files,
      path: req.params[0] === "root" ? root : path.resolve(root, req.params[0]),
      separator: path.sep,
    };

    res.json(response);
  }
});

module.exports = router;
