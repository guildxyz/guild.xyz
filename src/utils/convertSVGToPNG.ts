const converSVGToPNG = async (svgUrl: string): Promise<string> =>
  new Promise<string>(async (resolve) => {
    const IMG_SIZE = 1024
    const rawSvg = await fetch(svgUrl).then((res) => res.text())

    const canvas = document.createElement("canvas")
    canvas.width = IMG_SIZE
    canvas.height = IMG_SIZE
    const ctx = canvas.getContext("2d")

    const img = document.createElement("img")
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(rawSvg))

    img.onload = () => {
      ctx.drawImage(img, 0, 0, IMG_SIZE, IMG_SIZE)
      const pngDataURL = canvas.toDataURL("image/png")
      resolve(pngDataURL)
    }
  }).catch(() => "")

export default converSVGToPNG
