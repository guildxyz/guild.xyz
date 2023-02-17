import { Checkbox } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"

const TOSCheckbox = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
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
      {children}
    </Checkbox>
  )
}

export default TOSCheckbox
