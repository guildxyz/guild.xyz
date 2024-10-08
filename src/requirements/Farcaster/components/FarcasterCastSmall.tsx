import { Flex, HStack, Image, Link, Skeleton, Text } from "@chakra-ui/react"
import { Chat, Heart, ShareNetwork, WarningCircle } from "@phosphor-icons/react"
import { DataBlock } from "components/common/DataBlock"
import { useFarcasterCast } from "../hooks/useFarcasterCast"

const FarcasterCastSmall = ({
  cast,
  loading,
  error,
}: {
  cast: ReturnType<typeof useFarcasterCast>["data"]
  loading: boolean
  error: boolean
}) => {
  const url = `https://warpcast.com/${cast?.author.username}/${cast?.hash}`

  if (loading) return <Skeleton w={32} h={5} />
  if (error)
    return (
      <DataBlock>
        <Flex alignItems={"center"} gap={1}>
          <WarningCircle /> <Text>Failed to load cast!</Text>
        </Flex>
      </DataBlock>
    )

  if (!!cast && !loading && !error)
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
                  src={cast.author.pfp_url}
                  alt={"Profile picture"}
                />
                <Text fontWeight={"bold"} fontSize={"xs"} m={0}>
                  {cast.author.display_name ?? cast.author.username}
                </Text>
              </HStack>

              <HStack gap={2} ml={"auto"}>
                <HStack gap={0.5}>
                  {" "}
                  <Heart weight="fill" size={10} />
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    {cast.reactions.likes_count}
                  </Text>{" "}
                </HStack>
                <HStack gap={0.5}>
                  {" "}
                  <ShareNetwork weight="fill" size={10} />
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    {cast.reactions.recasts_count}
                  </Text>{" "}
                </HStack>
                <HStack gap={0.5}>
                  {" "}
                  <Chat weight="fill" size={10} />
                  <Text fontSize={"xs"} fontWeight={"bold"}>
                    {cast.replies.count}
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
