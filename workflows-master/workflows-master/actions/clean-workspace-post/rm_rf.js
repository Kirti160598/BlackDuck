const fs = require("fs");

fs.readdirSync(".")
  .forEach(element => fs.rmSync(element, { recursive: true, force: true }))
