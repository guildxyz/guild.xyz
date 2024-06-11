import { mkdir, writeFileSync } from "fs"
import { join } from "path"

const WEB_ROOT = join(__dirname, "node_modules", "@coinbase", "waas-sdk-web")
const VIEM_ROOT = join(__dirname, "node_modules", "@coinbase", "waas-sdk-viem")

mkdir(WEB_ROOT, () => {})
mkdir(VIEM_ROOT, () => {})

const webMockTypes = `
export type Address<T> = any;
export type InitializeWaasOptions = any;
export type NewWallet = any;
export type Waas = any;
export type Wallet = any
export enum ProtocolFamily { EVM }
export function InitializeWaas(_) {}
export async function Logout() {}
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

writeFileSync(join(WEB_ROOT, "index.d.ts"), webMockTypes, { flag: "w+" })
writeFileSync(join(WEB_ROOT, "package.json"), webPackage, { flag: "w+" })
writeFileSync(join(WEB_ROOT, "index.js"), "", { flag: "w+" })
writeFileSync(join(VIEM_ROOT, "index.js"), viemMock, { flag: "w+" })
writeFileSync(join(VIEM_ROOT, "package.json"), viemPackage, { flag: "w+" })
