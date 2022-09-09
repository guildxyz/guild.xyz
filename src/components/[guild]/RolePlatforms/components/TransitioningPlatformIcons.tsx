import { Img, ImgProps } from "@chakra-ui/react"
import { useEffect, useState } from "react"

const platformIcons = ["discord", "telegram", "google", "github"]

const TransitioningPlatformIcons = (props: ImgProps) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((oldIndex) =>
        oldIndex === platformIcons.length - 1 ? 0 : oldIndex + 1
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Img
      src={`/platforms/${platformIcons[index]}.png`}
      borderRadius="full"
      {...props}
    />
  )
}

export default TransitioningPlatformIcons
