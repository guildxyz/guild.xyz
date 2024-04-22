/**
 * This script is temporarily needed for making a small transformation on the WaaS
 * SDK-s, which allows us to non-dynamically import these packages. This script is
 * executed at postinstall. If you encounter ERR_IMPORT_ASSERTION_TYPE_MISSING
 * TypeError at build, you should probably run an 'npm install'
 */
const { readFileSync, writeFileSync } = require("fs")

const basePath = "./node_modules/@coinbase/waas-sdk-web/dist"

const paths = [
  `${basePath}/mpc.js`,
  `${basePath}/waas.js`,
  `${basePath}/perf.js`,
  `${basePath}/bugsnag.js`,
  `${basePath}/core/http.js`,
]
console.log(`[fixWaas] - ${paths.length} files will be processed`)

for (const path of paths) {
  console.log("\n[fixWaas] - Processing:", path)

  try {
    const content = readFileSync(path).toString()
    const newContent = content
      .replace(`versions.json";`, `versions.json" assert { type: "json" };`)
      .replace(`versions.json';`, `versions.json' assert { type: "json" };`)

    writeFileSync(path, newContent)
    console.log("[fixWaas] - Processed")
  } catch (error) {
    console.log("[fixWaas] - Failed")
  }
}
