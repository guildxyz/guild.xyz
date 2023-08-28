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
  rolePlatformId: number
}
const ClickableRewardTag = ({
  rolePlatformId,
}: ClickableRewardTagProps): JSX.Element => {
  const { data, baseUrl } = useActivityLog()

  const reward = data.values.rolePlatforms.find((rp) => rp.id === rolePlatformId)

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
        name={reward?.platformGuildName ?? reward?.data?.name}
        icon={platforms[reward?.platformName]?.icon}
        colorScheme={platforms[reward?.platformName]?.colorScheme}
      />
    </Tooltip>
  )
}

export default RewardTag
export { ClickableRewardTag }
