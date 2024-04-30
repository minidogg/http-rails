const http = require("http");
var url = require("url");
const path = require("path");
const fs = require("fs");

var rails = { foo: 42 };

//decide content type
rails.contentTypes = {
  //text
  css: "text/css",
  csv: "text/csv",
  html: "text/html",
  js: "text/javascript",
  txt: "text/plain",
  xml: "text/xml",
};

//rail res
class railRes {
  constructor(proxy) {
    this.res = proxy;
    this.headers = {};
    this.sent = false;
    this.status = 200;
  }
  send(data) {
    this.res.writeHead(this.status, this.headers);
    this.res.end(data);
    this.sent = true;
  }
  sendFile(file) {
    this.setFileType(path.extname(file).replaceAll(".", ""));
    this.send(fs.readFileSync(file));
  }
  assignHeaders(headers) {
    Object.assign(this.headers, headers);
  }
  setFileType(extension) {
    if (rails.contentTypes[extension])
      this.headers["Content-Type"] = rails.contentTypes[extension];
  }
}

//rail req
class railReq {
  constructor(proxy, urlParts) {
    this.req = proxy;
    this.urlParts = urlParts;
    this.url = this.req.url;
    this.path = this.urlParts.path;
    this.pathname = this.urlParts.pathname;
    this.method = this.req.method;
    this.headers = this.req.headers;

    //query parser
    this.query = {};
    try {
      if (this.req.url.includes("?")) {
        let query = this.req.url.split("?")[1];
        query = query.split("&");
        query.forEach((e) => {
          let ee = e.split("=");
          this.query[decodeURIComponent(ee[0])] = decodeURIComponent(ee[1]);
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }
}
//rail class
class rail {
  constructor(options = {}) {
    this.version = "0.1.0";
    this.warning = true;
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });

    this.setup();
  }

  //routing method
  async routing(req, res) {
    let urlParts = url.parse(req.url);
    let args = [new railReq(req, urlParts), new railRes(res)];
    for (let i = 0; i < this.routes.length; i++) {
      //Use Middleware
      if (this.routes[i].type == "use") {
        let done = false;
        await this.routes[i].code(...args, () => {
          done = true;
        });
        if (done !== true) {
          return;
        }
        continue;
      }
      //GET method
      if (
        this.routes[i].route == urlParts.pathname &&
        this.routes[i].type == req.method
      ) {
        await this.routes[i].code(...args);
        return;
      }
      //proxy method
      if (
        this.routes[i].route == urlParts.pathname &&
        this.routes[i].type == "proxy"
      ) {
        let parts = req.url.split("?");
        parts[0] = this.routes[i].newRoute;
        req.url = parts.join("?");
        this.routing(req, res);
        return;
      }
    }
    //404
    if (this.statusFunc["404"]) {
      this.statusFunc["404"](...args);
    }
  }
  async setup() {
    this.routes = [];
    this.statusFunc = {};
    this.server = http.createServer(async (req, res) => {
      // Routing
      await this.routing(req, res);
    });
  }
  listen(port, callback) {
    this.server.listen(port, callback);
  }
  get(route, code) {
    this.routes.push({ route: route, code: code, type: "GET" });
  }
  status(status, code) {
    this.statusFunc[status] = code;
  }
  use(code) {
    this.routes.push({ route: "", code: code, type: "use" });
  }
  proxy(route, file) {
    this.routes.push({ route: route, type: "proxy", newRoute: file });
  }
}

rails.static = (dir) => {
  var folder = fs.readdirSync(dir).map((e) => "/" + e);
  return async (req, res, next) => {
    if (req.pathname == "/") req.pathname = "/index.html";

    if (folder.includes(req.pathname)) {
      res.sendFile(path.join(dir, req.pathname));
      return;
    }
    next();
  };
};

var callableRails = Object.assign(rail, rails);

module.exports = callableRails;
