import { ImageResponse } from "@vercel/og"

export const config = {
  runtime: "experimental-edge",
}

const handler = () =>
  new ImageResponse(<div>Hello world!</div>, { width: 1600, height: 900 })

export default handler
