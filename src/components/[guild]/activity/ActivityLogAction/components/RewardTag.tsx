import {
  forwardRef,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  Tooltip,
} from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { PlatformName, PlatformType } from "types"
import { useActivityLog } from "../../ActivityLogContext"
import { useActivityLogFilters } from "../../ActivityLogFiltersBar/components/ActivityLogFiltersContext"

type Props = ClickableRewardTagProps & {
  label?: string
  platformType?: PlatformName
} & Omit<TagProps, "colorScheme">

const RewardTag = forwardRef<Props, "span">(
  ({ roleId, rolePlatformId, label, platformType, ...rest }, ref): JSX.Element => {
    const { data } = useActivityLog()

    const reward = data?.values.rolePlatforms.find((rp) => rp.id === rolePlatformId)
    const role = data?.values.roles.find((r) => r.id === roleId)

    const rewardName = reward?.platformGuildName ?? reward?.data?.name
    const name =
      (reward?.platformId === PlatformType.DISCORD
        ? `${role.name} - ${rewardName}`
        : rewardName) ?? label

    const icon = platforms[reward?.platformName || platformType]?.icon
    const colorScheme = platforms[reward?.platformName || platformType]?.colorScheme

    return (
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
  }
)

type ClickableRewardTagProps = {
  roleId: number
  rolePlatformId: number
}
const ClickableRewardTag = ({
  roleId,
  rolePlatformId,
}: ClickableRewardTagProps): JSX.Element => {
  const filtersContext = useActivityLogFilters()
  const { activeFilters, addFilter } = filtersContext ?? {}
  const isDisabled =
    !filtersContext ||
    !!activeFilters.find(
      (f) => f.filter === "rolePlatformId" && f.value === rolePlatformId.toString()
    )

  return (
    <Tooltip
      label="Filter by reward"
      placement="top"
      hasArrow
      isDisabled={isDisabled}
    >
      <RewardTag
        as="button"
        onClick={
          isDisabled
            ? undefined
            : () =>
                addFilter({
                  filter: "rolePlatformId",
                  value: rolePlatformId.toString(),
                })
        }
        roleId={roleId}
        rolePlatformId={rolePlatformId}
        cursor={isDisabled ? "default" : "pointer"}
      />
    </Tooltip>
  )
}

export default RewardTag
export { ClickableRewardTag }
