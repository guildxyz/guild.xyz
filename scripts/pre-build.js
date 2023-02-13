const { readFileSync, rmSync, writeFileSync } = require("fs")

const LODASH_FILES_TO_FIX = ["./node_modules/lodash.mergewith/index.js"]
const LODASH_BUILD_FIX_SEARCH_VALUE = /Function\('return\ this'\)\(\)/g

for (const path of LODASH_FILES_TO_FIX) {
  const content = readFileSync(path).toString()
  const newContent = content.replace(LODASH_BUILD_FIX_SEARCH_VALUE, "globalThis")
  rmSync(path)
  writeFileSync(path, newContent)
}
