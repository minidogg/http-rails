var loco = { foo: 42 };
const fs = require("fs");
const path = require("path");
const railClass = require("../src/scripts/rail");

const evalRegex = /{{((.|\n|\r)+)}}/

const noCache = `<meta http-equiv="Cache-control" content="no-cache"><meta http-equiv="Expires" content="-1">`
const autoRefresh = `<script>
(async()=>{

    const startTime = Date.now()
    setInterval(async()=>{
        let d = await fetch("./locomotive/api/start")
        d = await d.text()
        d = parseFloat(d)
        if(d>startTime)window.location.reload()
    },2000)

})()
</script>`

class locoClass {
  constructor(rail,options = {}) {
    this.staticKeys = [];
    this.extWhitelist = [".html",".css"]
    this.eval = true
    this.startTime = Date.now()

    Object.keys(options).forEach((key) => {
        this[key] = options[key];
    });
    /**
     * @type {railClass}
     */
    this.rail = rail
    this.rail.get("/locomotive/api/start",(req,res)=>{
        res.send(this.startTime.toString())
    })
  }
  render({ req, res }, file, data) {
    let fileData = fs.readFileSync(file, "utf-8");
    if(this.extWhitelist.includes(path.extname(file))){
        for (let key of Object.keys(data)) {
            fileData = fileData.replaceAll(`{(${key})}`, data[key]);
        }
        if(this.eval==true)while(evalRegex.test(fileData)){
            let c = evalRegex.exec(fileData)[1]
            fileData = fileData.replace(evalRegex,eval(c))
        }
        fileData = fileData.replace("[noCache]",noCache)
        fileData = fileData.replace("[autoRefresh]",autoRefresh)
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
