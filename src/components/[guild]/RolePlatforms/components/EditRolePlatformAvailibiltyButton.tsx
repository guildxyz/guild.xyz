import { IconButton } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Clock, GearSix } from "phosphor-react"

type Props = {
  onClick: () => void
  isCompact?: boolean
}

const EditRolePlatformAvailibiltyButton = ({ onClick, isCompact }: Props) => {
  const buttonProps = {
    variant: "outline",
    size: "xs",
    borderRadius: "md",
    borderWidth: 1,
    onClick,
  }

  return isCompact ? (
    <IconButton
      {...buttonProps}
      aria-label="Limit availibility"
      px={1.5}
      icon={<GearSix />}
    />
  ) : (
    <Button {...buttonProps} leftIcon={<Clock />}>
      Limit availibility
    </Button>
  )
}
export default EditRolePlatformAvailibiltyButton
