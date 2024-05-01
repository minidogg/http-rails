var loco = { foo: 42 };
const fs = require("fs");
const path = require("path");

class locoClass {
  constructor(options = {}) {
    this.staticKeys = [];
    this.extWhitelist = [".html",".css"]
  }
  render({ req, res }, file, data) {
    let fileData = fs.readFileSync(file, "utf-8");
    if(this.extWhitelist.includes(path.extname(file))){
        for (let key of Object.keys(data)) {
            fileData = fileData.replaceAll(key, data[key]);
        }
    }
    

    res.setFileType(path.extname(file).replaceAll(".", ""));
    res.send(fileData);
  }

  static(dir) {
    var folder = fs.readdirSync(dir).map((e) => "/" + e);
    var readTime = Date.now()
    return async (req, res, next) => {
    if(readTime+(10*1000)<Date.now())folder = fs.readdirSync(dir).map((e) => "/" + e);
      if (req.pathname == "/") req.pathname = "/index.html";

      if (folder.includes(req.pathname)) {
        this.render(
          { req, res },
          path.join(dir, req.pathname),
          this.staticKeys,
        );

        return;
      }
      next();
    };
  }
}

var callableLoco = Object.assign(locoClass, loco);

module.exports = callableLoco;
