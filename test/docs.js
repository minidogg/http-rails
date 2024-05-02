//requires that are needed
const path = require("path");
const fs = require("fs");

//require rails
const rails = require("../src/entry.js");

//create an instance of rails
const rail = new rails();

//set the port for later
const port = 3000;

//   use the built in static middleware
rail.use(rails.static(path.resolve("../docs/")));

//setup the 404 page
const missing = path.join(__dirname, "public", "404.html");
rail.status("404", (req, res) => {
  res.sendFile(missing);
});

rail.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
