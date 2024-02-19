/**
 * This util function is needed so we can use the Inter font from Google instead
 * hosting it locally. (OG image generation)
 */
const loadGoogleFont = async (font: string, weight: string) => {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}`

  const css = await (await fetch(url)).text()

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const res = await fetch(resource[1])
    if (res.status == 200) {
      const arrayBuffer = await res.arrayBuffer()
      return arrayBuffer
    }
  }

  throw new Error("failed to load font data")
}

export default loadGoogleFont
