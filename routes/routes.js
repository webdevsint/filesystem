const express = require("express");
const router = express.Router();

const zip = require("zip-folder");

const path = require("path");
const fs = require("fs");

router.get("/", (req, res) => {
  res.redirect("/root");
});

router.get("/create", (req, res) => {
  res
    .status(200)
    .send("post to /create/:type [folder/file] to trigger create process");
});

router.get("/create/:type", (req, res) => {
  res.sendStatus(200);
});

router.post("/create/:type", (req, res) => {
  const type = req.params.type;

  const name = req.body.name;
  const filePath = path.resolve(req.body.path, name);

  try {
    if (type === "folder") {
      if (!fs.existsSync(name)) {
        fs.mkdirSync(filePath, { recursive: true });

        res.send(`folder '${name}' created!`);
      }
    } else if (type === "file") {
      if (!fs.existsSync(name)) {
        fs.writeFileSync(filePath, "", { recursive: true });

        res.send(`file '${name}' created!`);
      }
    } else res.sendStatus(400);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/delete", (req, res) => {
  res.sendStatus(200);
});

router.post("/delete", (req, res) => {
  const name = req.body.name;
  const filePath = path.resolve(req.body.path, name);

  try {
    if (fs.existsSync(name)) {
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });

        res.send(`'${name}' was deleted`);
      } else fs.unlinkSync(path.resolve(filePath, name));

      res.send(`'${name}' was deleted`);
    } else res.status(400).json({ error: "file or directory not found!" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/zip", (req, res) => {
  res.sendStatus(200);
});

router.post("/zip", (req, res) => {
  const name = req.body.name;
  const filePath = path.resolve(req.body.path, name);

  zip(filePath, path.resolve(__dirname, `../temp/${name}.zip`), (err) => {
    if (err) res.status(500).json({ error: err });
    else {
      res.sendFile(path.resolve(__dirname, `../temp/${name}.zip`));

      setTimeout(() => {
        fs.unlinkSync(path.resolve(__dirname, `../temp/${name}.zip`));
      }, 5000);
    }
  });
});

module.exports = router;
