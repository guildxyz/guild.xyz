import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import prettier from "prettier";

const prettierOptions = prettier.resolveConfigFile(resolve('./.prettierrc'));
const strictNullCheckValue = process.argv.at(2).toLowerCase() === 'true' ? true : false

function setStrictNullChecksTo(value) {
  const config = JSON.parse(readFileSync('./tsconfig.json').toString())
  if (config?.compilerOptions?.strictNullChecks === undefined) {
    throw new Error("strictNullChecks doesn't exist on tsconfig.json")
  } else {
    config.compilerOptions.strictNullChecks = value
  }
  const newConfig = prettier.format(JSON.stringify(config), { ...prettierOptions, parser: 'json' })
  writeFileSync('./tsconfig.json', newConfig)
}

setStrictNullChecksTo(strictNullCheckValue)
