import chromium from "chrome-aws-lambda"

const handler = async (req, res) => {
  const urlName = req.query.urlName

  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.NODE_ENV === "production"
        ? await chromium.executablePath
        : undefined,
    headless: true,
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  page.setViewport({ width: 1600, height: 900 })
  await page.goto(
    `${process.env.NODE_ENV === "development" ? `http://` : `https://`}${
      req.headers.host
    }${urlName === "index" ? "" : `/${urlName}`}/linkpreview`,
    {
      waitUntil: "networkidle0",
    }
  )

  const screenShotBuffer = await page.screenshot()
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": Buffer.byteLength(screenShotBuffer as ArrayBuffer),
  })
  res.end(screenShotBuffer)
}

export default handler
