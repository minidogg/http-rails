const http = require("http");
var url = require("url");
const path = require("path");
const fs = require("fs");

module.exports = (dir) => {
  var folder = fs.readdirSync(dir).map((e) => "/" + e);
  var lastFolderRead = Date.now();
  return async (req, res, next) => {
    if (lastFolderRead + 3 * 1000 <= Date.now()) {
      folder = fs.readdirSync(dir).map((e) => "/" + e);
      lastFolderRead = Date.now();
    }
    if (req.pathname == "/") req.pathname = "/index.html";

    if (folder.includes(req.pathname)) {
      res.sendFile(path.join(dir, req.pathname));
      return;
    }
    next();
  };
};
