const fs = require('fs').promises;
const os = require('os');
const exec = require('child_process').exec;

fs.readFile(`${os.homedir}/.docker/config.json`).then(data => {
  const config = JSON.parse(data)
  const registries = config.auths || {}
  Object.keys(registries).forEach(registry => {
    console.log(`logging out from ${registry} ..`)
    exec(`docker logout ${registry}`)
    console.log(`logout from ${registry} successful`)
  })
})
