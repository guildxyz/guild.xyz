import { Tag, TagLabel, TagLeftIcon, Tooltip } from "@chakra-ui/react"
import { useRouter } from "next/router"
import platforms from "platforms/platforms"
import { PlatformName } from "types"

type Props = {
  type: PlatformName
  rolePlatformId: string
  name: string
}
const RewardTag = ({ type, rolePlatformId, name }: Props): JSX.Element => {
  const router = useRouter()

  return (
    <Tooltip label="Filter by reward">
      <Tag
        as="button"
        bgColor={`${platforms[type]?.colorScheme}.500` ?? "gray.500"}
        color="white"
        onClick={() => {
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, rolePlatformId },
          })
        }}
      >
        {platforms[type]?.icon && <TagLeftIcon as={platforms[type].icon} />}

        <TagLabel>{name}</TagLabel>
      </Tag>
    </Tooltip>
  )
}

export default RewardTag
