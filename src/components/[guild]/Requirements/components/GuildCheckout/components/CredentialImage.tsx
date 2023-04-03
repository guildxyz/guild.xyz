import {
  AspectRatio,
  Box,
  Img,
  Portal,
  Spinner,
  Square,
  Text,
  VStack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect, useRef } from "react"
import GuildCredentialBaseSVG from "static/guildCredentialBase.svg"
import useSWRImmutable from "swr/immutable"
import { GuildAction, useMintCredentialContext } from "../MintCredentialContext"

const DEBUG = false
const SIZE = 512
const PADDING = 40

const svgIdPrefix = "guildCredentialBase_svg__"
const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.toString())
    reader.readAsDataURL(blob)
  })

const generateCredential = async (
  _: string,
  svgWrapper: HTMLDivElement,
  guildName: string,
  imageUrl: string,
  color: string,
  credentialType: GuildAction,
  hiddenCanvas: HTMLCanvasElement
): Promise<{ file: File; base64: string }> => {
  const topText = guildName.length > 22 ? `${guildName.slice(0, 20)}...` : guildName
  const bottomText =
    credentialType === GuildAction.IS_OWNER ? "Guild Owner" : "Joined Guild"

  // Fething and converting the Guild's image, since we won't be able to export external images
  const imageUrlRes = await fetch(imageUrl)
  const imageBlob = await imageUrlRes.blob()

  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = 512
  tempCanvas.height = 512

  const img = new Image()
  img.decoding = "sync"
  img.crossOrigin = "anonymous"
  img.src = URL.createObjectURL(imageBlob)
  await img.decode()

  tempCanvas.getContext("2d").drawImage(img, 0, 0, 512, 512)
  svgWrapper.querySelector("image").setAttribute("href", tempCanvas.toDataURL())

  const topStop = Math.min(
    topText.length + Math.min(Math.sqrt(topText.length), 2),
    20
  )
  const bottomStop = bottomText.length + Math.min(Math.sqrt(bottomText.length), 2)

  const generatedGradient = `conic-gradient(
        #27272a 0%,
        #27272a ${topStop}%,
        ${color} ${topStop}%,
        ${color} ${50 - bottomStop}%,
        #27272a ${50 - bottomStop}%,
        #27272a ${50 + bottomStop}%,
        ${color} ${50 + bottomStop}%,
        ${color} ${100 - topStop}%,
        #27272a ${100 - topStop}%,
        #27272a 100%
      )`

  const conicGradientCircle: HTMLDivElement = svgWrapper.querySelector(
    `#${svgIdPrefix}conicGradient`
  )
  conicGradientCircle.style.background = generatedGradient
  conicGradientCircle.style.width = "1080px"
  conicGradientCircle.style.height = "1080px"

  const topTextPath = svgWrapper.querySelector(`#${svgIdPrefix}topTextPath`)
  topTextPath.innerHTML =
    topText?.length > 20 ? `${topText.slice(0, 20)}...` : topText

  const bottomTextPath = svgWrapper.querySelector(`#${svgIdPrefix}bottomTextPath`)
  bottomTextPath.innerHTML = bottomText

  const svg = svgWrapper.querySelector("svg")
  const blob = new Blob([svg.outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  })
  const blobUrl = await blobToBase64(blob)

  const image = new Image()
  image.decoding = "sync"
  image.crossOrigin = "anonymous"
  image.src = blobUrl
  await image.decode()

  // Safari renders canvas content with a small timeout, that's why I implemented this hacky solution...
  return new Promise((resolve) => {
    setTimeout(async () => {
      const context = hiddenCanvas.getContext("2d")

      context.fillStyle = "#18181b"
      context.fillRect(0, 0, SIZE, SIZE)
      context.drawImage(
        image,
        PADDING,
        PADDING,
        SIZE - 2 * PADDING,
        SIZE - 2 * PADDING
      )

      const canvasDataAsbase64 = hiddenCanvas.toDataURL()
      const canvasDataAsBlob = await fetch(canvasDataAsbase64).then((res) =>
        res.blob()
      )
      const canvasDataAsFile = new File(
        [canvasDataAsBlob],
        "guild-credential-image.png"
      )

      resolve({
        file: canvasDataAsFile,
        base64: canvasDataAsbase64,
      })
    }, 1000)
  })
}

const CredentialImage = (): JSX.Element => {
  const { name, imageUrl, theme } = useGuild()
  const { credentialType, setImage } = useMintCredentialContext()
  const svgWrapperRef = useRef<HTMLDivElement>(null)
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null)

  const shouldGenerate = Boolean(
    hiddenCanvasRef.current &&
      svgWrapperRef.current &&
      name &&
      imageUrl &&
      theme &&
      typeof credentialType !== "undefined"
  )

  const { data } = useSWRImmutable(
    shouldGenerate
      ? [
          "credentialImage",
          svgWrapperRef.current,
          name,
          imageUrl,
          theme.color,
          credentialType,
          hiddenCanvasRef.current,
        ]
      : null,
    generateCredential
  )

  useEffect(() => {
    if (!data) return
    setImage(data.file)
  }, [data])

  return (
    <>
      <AspectRatio ratio={1}>
        {data ? (
          <Img
            w="full"
            src={data.base64}
            alt="Guild Credential image"
            borderRadius="xl"
          />
        ) : (
          <Square borderWidth={2} borderStyle="dashed" borderRadius="xl">
            <VStack>
              <Spinner size="xl" />
              <Text fontFamily="display" fontWeight="bold">
                Generating credential
              </Text>
            </VStack>
          </Square>
        )}
      </AspectRatio>

      <Portal>
        <canvas
          ref={hiddenCanvasRef}
          width={SIZE}
          height={SIZE}
          style={{ display: "none" }}
        />
        <Box
          boxSize={40}
          ref={svgWrapperRef}
          display={DEBUG ? "block" : "none"}
          sx={
            DEBUG
              ? {
                  position: "fixed",
                  top: "10px",
                  left: "10px",
                  width: "256px",
                  height: "256px",
                  zIndex: 10001,
                  svg: {
                    width: "256px",
                    height: "256px",
                  },
                }
              : undefined
          }
        >
          <GuildCredentialBaseSVG />
        </Box>
      </Portal>
    </>
  )
}

export default CredentialImage
