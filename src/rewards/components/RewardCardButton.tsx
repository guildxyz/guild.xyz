import { ButtonProps, ComponentWithAs, Tooltip } from "@chakra-ui/react"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import Button from "components/common/Button"
import useMembership from "components/explorer/hooks/useMembership"
import { ComponentProps } from "react"

const RewardCardButton = ({
  onClick,
  ...props
}: ComponentProps<ComponentWithAs<typeof Button>>) => {
  const { isMember, membership } = useMembership()
  const openJoinModal = useOpenJoinModal()

  const { roleId } = useRolePlatform()
  const hasRole = !!membership?.roles.find(
    (role) => role.roleId === roleId && role.access
  )

  const buttonProps = {
    size: { base: "sm", xl: "md" },
    ...props,
  } satisfies ButtonProps

  if (isMember && !hasRole)
    return (
      <Tooltip
        label="You must satisfy the requirements first in order to claim this reward"
        hasArrow
      >
        <Button {...buttonProps} as={undefined} onClick={undefined} isDisabled />
      </Tooltip>
    )

  return (
    <Button
      onClick={isMember ? onClick : "href" in props ? undefined : openJoinModal}
      {...buttonProps}
    />
  )
}

export { RewardCardButton }
