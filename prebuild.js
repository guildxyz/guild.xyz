const { rename, mkdirSync } = require("fs")

/**
 * Moving this serverless function to the root directory (only in production mode),
 * so it'll become a Vercel Serverless Function. This way we won't exceed the 50MB
 * limit with it on Vercel.
 */

if (process.env.NODE_ENV === "production") {
  mkdirSync("./api/linkpreview/[hash]", { recursive: true })

  rename(
    "./src/pages/api/linkpreview/[hash]/[[...urlName]].ts",
    "./api/linkpreview/[hash]/[[...urlName]].ts",
    (err) => {
      if (err) throw err
      console.log(
        "Moved `./src/pages/api/linkpreview/[hash]/[[...urlName]].ts` to `./api/linkpreview/[hash]/[[...urlName]].ts`!"
      )
    }
  )
}
