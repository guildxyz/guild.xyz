import { ButtonProps, Icon, useColorModeValue } from "@chakra-ui/react"
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
}: PropsWithChildren<Props>): JSX.Element => {
  const borderWidth = useColorModeValue(2, 0)
  return (
    <Button
      size="xs"
      rounded="lg"
      leftIcon={<Icon as={leftIcon} />}
      borderWidth={borderWidth}
      borderColor="gray.200"
      {...props}
    >
      {children}
    </Button>
  )
}

export default ActionButton
