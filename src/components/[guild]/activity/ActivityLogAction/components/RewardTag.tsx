import {
  ChakraProps,
  forwardRef,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  Tooltip,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { IconProps } from "phosphor-react"
import platforms from "platforms/platforms"
import { PlatformType } from "types"
import { useActivityLog } from "../../ActivityLogContext"

type Props = {
  name?: string
  icon?: (props: IconProps) => JSX.Element
  colorScheme?: ChakraProps["color"]
} & Omit<TagProps, "colorScheme">

const RewardTag = forwardRef<Props, "span">(
  ({ name, icon, colorScheme, ...rest }, ref): JSX.Element => (
    <Tag
      ref={ref}
      bgColor={colorScheme ? `${colorScheme}.500` : "gray.500"}
      color="white"
      minW="max-content"
      h="max-content"
      {...rest}
    >
      {icon && <TagLeftIcon as={icon} />}

      <TagLabel>{name ?? "Unknown reward"}</TagLabel>
    </Tag>
  )
)

type ClickableRewardTagProps = {
  roleId: number
  rolePlatformId: number
}
const ClickableRewardTag = ({
  roleId,
  rolePlatformId,
}: ClickableRewardTagProps): JSX.Element => {
  const { data, baseUrl } = useActivityLog()

  const reward = data.values.rolePlatforms.find((rp) => rp.id === rolePlatformId)
  const role = data.values.roles.find((r) => r.id === roleId)

  const rewardName = reward?.platformGuildName ?? reward?.data?.name
  const name =
    reward?.platformId === PlatformType.DISCORD
      ? `${role.name} - ${rewardName}`
      : rewardName

  const router = useRouter()

  return (
    <Tooltip label="Filter by reward" placement="top" hasArrow>
      <RewardTag
        as="button"
        onClick={() => {
          router.push({
            pathname: baseUrl,
            query: { ...router.query, rolePlatformId },
          })
        }}
        name={name}
        icon={platforms[reward?.platformName]?.icon}
        colorScheme={platforms[reward?.platformName]?.colorScheme}
      />
    </Tooltip>
  )
}

export default RewardTag
export { ClickableRewardTag }
