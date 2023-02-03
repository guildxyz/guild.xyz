import { Box } from "@chakra-ui/react"
import Image from "next/image"

const CustomImage = (props) => (
  <Box position="relative" width="100%" height="65vh">
    <Image
      className={props.className}
      src={props.src}
      alt="page image"
      height={props.className === "notion-page-icon" ? "100px" : null}
      width={props.className === "notion-page-icon" ? "100px" : null}
      layout={props.className === "notion-page-icon" ? "responsive" : "fill"}
      objectFit="contain"
      quality={20}
      priority={true}
      style={{
        zIndex: "1",
      }}
    />
  </Box>
)
export default CustomImage
