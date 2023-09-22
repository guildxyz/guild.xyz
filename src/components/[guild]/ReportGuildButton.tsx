import { ButtonProps, IconButton, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useIntercom } from "components/_app/IntercomProvider"
import { Flag } from "phosphor-react"
import useGuild from "./hooks/useGuild"

type Props = {
  layout?: "FULL" | "ICON"
} & ButtonProps

const label = "Report guild"
const className = "report-guild-btn"

const ReportGuildButton = ({
  layout = "FULL",
  ...buttonProps
}: Props): JSX.Element => {
  const { id, name } = useGuild()
  const { addIntercomSettings } = useIntercom()

  return layout === "FULL" ? (
    <Button
      className={className}
      size="sm"
      variant="ghost"
      leftIcon={<Flag />}
      onClick={() => {
        if (!id) return
        addIntercomSettings({ reportedGuild: `${name} (#${id})` })
      }}
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
}

export default ReportGuildButton
