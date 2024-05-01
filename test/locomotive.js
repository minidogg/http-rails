//requires that are needed
const path = require("path");
const fs = require("fs");

//require rails
const rails = require("../src/entry.js");
//create an instance of rails
const rail = new rails();

//set the port for later
const port = 3000;

//require and create an instance of locomotive which is a basic templating engine
const locomotive = require("../locomotive")
const loco = new locomotive(rail);

//   use the built in static middleware
// rail.use(rails.static(path.resolve("./public/")));
//    or use the one from locomotive
rail.use(loco.static(path.resolve("./public/")));
loco.staticKeys["chip"] = "Cheeto";

//setup the 404 page
const missing = path.join(__dirname, "public", "404.html");
rail.status("404", (req, res) => {
  loco.render({ req, res }, missing, { "page": req.pathname });
});

//make a get route that sends back "joe"
rail.get("/joe", (req, res) => {
  res.setFileType("html"); // this is only really neccesary when you aren't sending a plain text file or html file.
  res.send("<h1>joe</h1>Joe is the true savior. Worship Joe.");
});

//proxy the "/cat" path to use the "/cat.html" file
rail.proxy("/cat", "/really-long-file-name-for-a-cat-file.html");

rail.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
