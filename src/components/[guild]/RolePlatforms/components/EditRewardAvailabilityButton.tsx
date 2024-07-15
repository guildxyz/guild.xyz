import { IconButton } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PiClock } from "react-icons/pi"
import { PiGearSix } from "react-icons/pi"

type Props = {
  onClick: () => void
  isCompact?: boolean
}

const EditRewardAvailabilityButton = ({ onClick, isCompact }: Props) => {
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
      aria-label="Limit availability"
      px={1.5}
      icon={<PiGearSix />}
    />
  ) : (
    <Button {...buttonProps} leftIcon={<PiClock />}>
      Limit availability
    </Button>
  )
}
export default EditRewardAvailabilityButton
