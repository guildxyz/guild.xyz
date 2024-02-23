import {
  forwardRef,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagProps,
  TagRightIcon,
} from "@chakra-ui/react"
import { DotsThreeVertical, IconProps } from "phosphor-react"
import platforms from "platforms/platforms"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import { PlatformName, PlatformType } from "types"
import { useActivityLog } from "../../ActivityLogContext"
import ClickableTagPopover from "./ClickableTagPopover"
import FilterBy from "./ClickableTagPopover/components/FilterBy"

type Props = ClickableRewardTagProps & {
  label?: string
  platformType?: PlatformName
  rightIcon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
} & Omit<TagProps, "colorScheme">

const RewardTag = forwardRef<Props, "span">(
  (
    { roleId, rolePlatformId, label, platformType, rightIcon, ...rest },
    ref
  ): JSX.Element => {
    const { data } = useActivityLog()

    const reward = data?.values.rolePlatforms.find((rp) => rp.id === rolePlatformId)
    const role = data?.values.roles.find((r) => r.id === roleId)

    const rewardName = reward?.platformGuildName ?? reward?.data?.name
    const name =
      (reward?.platformId === PlatformType.DISCORD
        ? `${role?.name ?? "Unknown role"} - ${rewardName}`
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

        {rightIcon && <TagRightIcon as={rightIcon} />}
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
}: ClickableRewardTagProps): JSX.Element => (
  <ClickableTagPopover
    options={
      <FilterBy
        filter={{ filter: "rolePlatformId", value: rolePlatformId.toString() }}
      />
    }
  >
    <RewardTag
      as="button"
      roleId={roleId}
      rolePlatformId={rolePlatformId}
      cursor={"pointer"}
      rightIcon={DotsThreeVertical}
    />
  </ClickableTagPopover>
)

export default RewardTag
export { ClickableRewardTag }
