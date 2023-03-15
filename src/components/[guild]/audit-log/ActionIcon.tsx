import { Icon } from "@chakra-ui/react"
import { SystemStyleObject } from "@chakra-ui/theme-tools"
import { IconProps, Question } from "phosphor-react"
import { auditLogActionIcons } from "./constants"

type Props = {
  actionName: string
  size?: number
}

type ActionIconProps = {
  as: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
  boxSize: number
  color?: string
  sx: SystemStyleObject
}

const getActionIconProps = (actionName: string, size = 8): ActionIconProps => {
  const propsBase: ActionIconProps = {
    as: Question,
    boxSize: size,
    sx: {
      "> *": {
        strokeWidth: "1rem",
      },
    },
  }

  return {
    ...propsBase,
    ...auditLogActionIcons[actionName],
  }
}

const ActionIcon = ({ actionName, size }: Props): JSX.Element => (
  <Icon {...getActionIconProps(actionName, size)} />
)

export default ActionIcon
