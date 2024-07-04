/**
 * Source: https://github.com/vercel/next.js/issues/32314#issuecomment-1750673712
 *
 * Instructions: run `npm run dcd` to list the circular dependencies in the app
 */

import { parseCircular, parseDependencyTree, prettyCircular } from "dpdm"

/**
 * Circular dependencies increase build times. Especially the dev server suffers from
 * this, the ram usage spikes heavily.
 *
 * Heuristic: The longer these circular dependencies are, the more they impact the
 * performance.
 */

if (require.main === module) {
  void main()
}

async function main() {
  const circulars = await determineCirculars()

  circulars.sort((a, b) => b.length - a.length)

  console.log(prettyCircular(circulars)) // pretty-print to console

  console.log(
    `Circulars are sorted by length. Longest circular dependency spans ${
      circulars[0]?.length ?? "X"
    } modules`
  )
}

export async function determineCirculars(): Promise<string[][]> {
  return new Promise((resolve) => {
    void parseDependencyTree("./**/*.ts*", {
      // by transforming all files to javascript we avoid detecting circular type dependencies, whhich dont hurt at runtime
      transform: true,
      exclude: /node_modules\/*/,
    }).then((tree) => {
      resolve(parseCircular(tree))
    })
  })
}
