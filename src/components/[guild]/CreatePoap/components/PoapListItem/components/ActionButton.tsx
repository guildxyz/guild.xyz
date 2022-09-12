import { ButtonProps, Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import { IconProps } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  leftIcon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
} & Omit<ButtonProps, "leftIcon">

const ActionButton = ({
  leftIcon,
  children,
  ...props
}: PropsWithChildren<Props>): JSX.Element => (
  <Button size="xs" rounded="lg" leftIcon={<Icon as={leftIcon} />} {...props}>
    {children}
  </Button>
)

export default ActionButton
