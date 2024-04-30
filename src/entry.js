const contentTypes = require("./scripts/contentTypes");
const _static = require("./scripts/middleware/static");
const rail = require("./scripts/rail");
const railReq = require("./scripts/req");
const railRes = require("./scripts/res");

var rails = { foo: 42 };

rails.railReq = railReq
rails.railRes = railRes
rails.contentTypes = contentTypes
rails.rail = rail
rails.static = _static

var callableRails = Object.assign(rail, rails);
module.exports = callableRails