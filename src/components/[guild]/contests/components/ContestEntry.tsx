import { HStack, Img, Text } from "@chakra-ui/react"
import { types } from "@guildxyz/types"
import { Heart } from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import Card from "components/common/Card"
import useFarcasterAction from "requirements/Farcaster/hooks/useFarcasterAction"
import useUserHub from "../hooks/hub/useUserHub"
import useUserLike from "../hooks/hub/useUserLike"
import useContestEntries from "../hooks/useContestEntries"

export default function ContestEntry({ entry }: { entry: types.GuildContestEntry }) {
  const { farcasterProfiles } = useUser()
  const author = useUserHub(entry.authorFid)
  const { mutate: mutateEntries } = useContestEntries()
  const { hasLiked, mutate: mutateHasLiked } = useUserLike(
    farcasterProfiles?.[0]?.fid,
    entry.authorFid,
    entry.castHash
  )
  const like = useFarcasterAction(undefined, ({ isDelete }) => {
    mutateHasLiked(!isDelete, { revalidate: false })

    mutateEntries((pages) =>
      (pages ?? []).map((page) =>
        page.map((item) => {
          if (
            item.authorFid === entry.authorFid &&
            item.castHash === entry.castHash
          ) {
            return {
              ...item,
              likes: item.likes + (isDelete ? -1 : 1),
            }
          }
          return item
        })
      )
    )
  })

  const displayName =
    author.data?.messages?.find(
      (_) => _.data?.userDataBody?.type?.toString() === "USER_DATA_TYPE_DISPLAY"
    )?.data?.userDataBody?.value ?? entry.authorDisplayName

  const avatar =
    author.data?.messages?.find(
      (_) => _.data?.userDataBody?.type?.toString() === "USER_DATA_TYPE_PFP"
    )?.data?.userDataBody?.value ?? entry.authorPfpUrl

  return (
    <Card padding={2} display={"flex"} flexDirection={"column"} gap={2}>
      <HStack justifyContent={"space-between"}>
        <HStack>
          <Img maxW={50} src={avatar} borderRadius={"full"} />
          <Text>{displayName}</Text>
        </HStack>

        <HStack>
          <Text>{entry.likes}</Text>

          <Heart
            onClick={() => {
              if (hasLiked) {
                like.onSubmit({
                  type: "like",
                  castId: entry.castHash,
                  isDelete: true,
                })
              } else {
                like.onSubmit({ type: "like", castId: entry.castHash })
              }
            }}
            fill={hasLiked ? "#c75954" : undefined}
            weight={hasLiked ? "fill" : undefined}
            size={25}
          />
        </HStack>
      </HStack>

      {entry.castHash}

      <Img borderRadius={"md"} src={entry.castImageUrl} />
    </Card>
  )
}
