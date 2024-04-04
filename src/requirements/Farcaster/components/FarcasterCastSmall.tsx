import { Flex, HStack, Image, Link, Skeleton, Text } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { Chat, Heart, ShareNetwork, WarningCircle } from "phosphor-react"
import { FarcasterCastData } from "./FarcasterCast"

const FarcasterCastSmall = ({
  cast,
  loading,
  error,
}: {
  cast: FarcasterCastData
  loading: boolean
  error: boolean
}) => {
  const url = `https://warpcast.com/${cast?.username}/${cast?.hash}`

  if (loading) return <Skeleton w={32} h={5} />
  if (error)
    return (
      <DataBlock>
        <Flex alignItems={"center"} gap={1}>
          <WarningCircle /> <Text>Failed to load cast!</Text>
        </Flex>
      </DataBlock>
    )

  if (cast && !loading && !error)
    return (
      <>
        <Link
          as={"a"}
          isExternal
          href={url}
          textDecoration={"none"}
          _hover={{ borderBottom: "1px solid" }}
        >
          <DataBlock>
            <HStack>
              <HStack>
                <Image
                  width={3}
                  height={3}
                  objectFit={"cover"}
                  rounded={"full"}
                  src={cast.profile_pic}
                  alt={"Profile picture"}
                />
                <Text fontWeight={"bold"} fontSize={"xs"} m={0}>
                  {cast.display_name}
                </Text>
              </HStack>

              <HStack gap={2} ml={"auto"}>
                <HStack gap={0.5}>
                  {" "}
                  <Heart weight="fill" size={10} />
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    {cast.likes}
                  </Text>{" "}
                </HStack>
                <HStack gap={0.5}>
                  {" "}
                  <ShareNetwork weight="fill" size={10} />
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    {cast.recasts}
                  </Text>{" "}
                </HStack>
                <HStack gap={0.5}>
                  {" "}
                  <Chat weight="fill" size={10} />
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    {cast.replies}
                  </Text>{" "}
                </HStack>
              </HStack>
            </HStack>
          </DataBlock>
        </Link>
      </>
    )

  return <Skeleton w={32} h={5} />
}

export default FarcasterCastSmall
