import { HStack, Image, Text } from "@chakra-ui/react"

export type FarcasterCastData = {
  hash: string
  author: string
  profile_pic: string
  text: string
  timestamp: string
  likes: number
  recasts: number
  replies: number
}

const FarcasterCast = ({ cast }: { cast: FarcasterCastData }) => {
  return (
    <HStack>
      <Image
        width={5}
        height={5}
        objectFit={"cover"}
        rounded={"full"}
        src={cast.profile_pic}
        alt={"Profile picture"}
      />

      <Text>{cast.author}</Text>
    </HStack>
  )
}

export default FarcasterCast
