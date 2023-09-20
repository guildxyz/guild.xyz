import { ButtonProps, IconButton, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Flag } from "phosphor-react"

type Props = {
  layout?: "FULL" | "ICON"
} & ButtonProps

const label = "Report guild"
const className = "report-guild-btn"

// No need to define an onClick handler, Intercom will do it automatically
const ReportGuildButton = ({
  layout = "FULL",
  ...buttonProps
}: Props): JSX.Element =>
  layout === "FULL" ? (
    <Button
      className={className}
      size="sm"
      variant="ghost"
      leftIcon={<Flag />}
      {...buttonProps}
    >
      {label}
    </Button>
  ) : (
    <Tooltip label={label} placement="top" hasArrow>
      <IconButton
        className={className}
        size="sm"
        variant="ghost"
        icon={<Flag />}
        aria-label={label}
        boxSize={8}
        rounded="full"
        minW="none"
        {...buttonProps}
      />
    </Tooltip>
  )

export default ReportGuildButton
