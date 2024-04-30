const http = require("http");
var url = require("url");
const path = require("path");
const fs = require("fs");
const railRes = require("./res");
const railReq = require("./req");

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

      //Loop through all items in the routes array
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
        if (this.routes[i].route == urlParts.pathname && this.routes[i].type == req.method) {
          await this.routes[i].code(...args);
          return;
        }

        //proxy method
        if (this.routes[i].route == urlParts.pathname && this.routes[i].type == "proxy") {
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
    proxy(route, newRoute) {
      this.routes.push({ route: route, type: "proxy", newRoute: file });
    }
  }
  module.exports = rail