const fs = require("fs")
const path = require("path")

const WEB_ROOT = path.join(__dirname, "node_modules", "@coinbase", "waas-sdk-web")
const VIEM_ROOT = path.join(__dirname, "node_modules", "@coinbase", "waas-sdk-viem")

fs.mkdir(WEB_ROOT, () => {})
fs.mkdir(VIEM_ROOT, () => {})

const webMockTypes = `
export type Address<T> = any;
export type InitializeWaasOptions = any;
export type NewWallet = any;
export type Waas = any;
export type Wallet = any
export enum ProtocolFamily { EVM }
export function InitializeWaas(_) {}
export function Logout() {}
`

const viemMock = `
module.exports = {
  toViem: (_) => {}
}
`

const webPackage = `
{
  "name": "@coinbase/waas-sdk-web",
  "type": "./index.d.ts",
  "main": "./index.js"
}
`

const viemPackage = `
{
  "name": "@coinbase/waas-sdk-viem",
  "main": "./index.js"
}
`

fs.writeFileSync(path.join(WEB_ROOT, "index.d.ts"), webMockTypes, { flag: "w+" })
fs.writeFileSync(path.join(WEB_ROOT, "package.json"), webPackage, { flag: "w+" })
fs.writeFileSync(path.join(WEB_ROOT, "index.js"), "", { flag: "w+" })
fs.writeFileSync(path.join(VIEM_ROOT, "index.js"), viemMock, { flag: "w+" })
fs.writeFileSync(path.join(VIEM_ROOT, "package.json"), viemPackage, { flag: "w+" })
