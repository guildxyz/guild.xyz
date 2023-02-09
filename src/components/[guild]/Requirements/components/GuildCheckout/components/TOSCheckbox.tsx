import { Checkbox } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"

const TOSCheckbox = (): JSX.Element => {
  const { name } = useGuild()
  const { agreeWithTOS, setAgreeWithTOS } = useGuildCheckoutContext()

  return (
    <Checkbox
      alignItems="start"
      sx={{
        "> .chakra-checkbox__control": {
          marginTop: 1,
          borderWidth: 1,
        },
      }}
      _checked={{
        "> .chakra-checkbox__control[data-checked]": {
          bgColor: "blue.500",
          borderColor: "blue.500",
          color: "white",
        },
      }}
      pb={4}
      isChecked={agreeWithTOS}
      onChange={(e) => setAgreeWithTOS(e.target.checked)}
      size="sm"
    >
      {`I understand that I purchase from decentralized exchanges, not from 
      ${name} or Guild.xyz itself`}
    </Checkbox>
  )
}

export default TOSCheckbox
