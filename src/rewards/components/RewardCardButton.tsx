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

  const buttonProps = {
    size: { base: "sm", xl: "md" },
    ...props,
  } satisfies ButtonProps

  if ("href" in props) return <Button {...buttonProps} />

  if (!isMember)
    return (
      <Tooltip label="Join guild to check access" hasArrow>
        <Button onClick={openJoinModal} variant="outline" {...buttonProps} />
      </Tooltip>
    )

  const hasRole = membership?.roles?.find(
    (role) => role.roleId === roleId && role.access
  )

  if (!hasRole)
    return (
      <Tooltip
        label="You must satisfy the requirements to claim this reward"
        hasArrow
      >
        <Button {...buttonProps} as={undefined} onClick={undefined} isDisabled />
      </Tooltip>
    )

  return <Button onClick={onClick} {...buttonProps} />
}

export { RewardCardButton }
