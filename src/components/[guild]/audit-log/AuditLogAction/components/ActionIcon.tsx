import { Icon } from "@chakra-ui/react"
import { SystemStyleObject } from "@chakra-ui/theme-tools"
import { IconProps, Question } from "phosphor-react"
import { auditLogActionIcons } from "../../constants"
import { useAuditLogActionContext } from "../AuditLogActionContext"

type Props = {
  size?: number
}

type ActionIconProps = {
  as: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
  boxSize: number
  color?: string
  sx: SystemStyleObject
}

const getActionIconProps = (action: string, size = 8): ActionIconProps => {
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
    ...auditLogActionIcons[action],
  }
}

const ActionIcon = ({ size }: Props): JSX.Element => {
  const { action } = useAuditLogActionContext()

  return <Icon {...getActionIconProps(action, size)} />
}

export default ActionIcon
