//requires that are needed
const path = require("path");
const fs = require("fs");

//require rails
const rails = require("../src/entry.js");
//create an instance of rails
const rail = new rails();
//allow cors early
rail.use(rails.cors())

//set the port for later
const port = 3000;


//   use the built in static middleware
rail.use(rails.static(path.resolve("./public/")));


//setup the 404 page
const missing = path.join(__dirname, "public", "404.html");
rail.status("404", (req, res) => {
  res.sendFile(missing)
});

//make a get route that sends back "joe"
rail.get("/joe", (req, res) => {
  console.log(req.query)
  res.setFileType("html"); // this is only really neccesary when you aren't sending a plain text file or html file.
  res.send("<h1>joe</h1>");
});

//spoof the "/really-long-file-name-for-a-cat-file.html" to be accessible from "/cat"
rail.spoof("/cat", "/really-long-file-name-for-a-cat-file.html");

rail.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
