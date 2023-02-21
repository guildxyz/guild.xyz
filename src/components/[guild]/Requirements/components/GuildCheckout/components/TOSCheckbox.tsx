import { Checkbox, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { useGuildCheckoutContext } from "./GuildCheckoutContex"

const TOSCheckbox = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const borderColor = useColorModeValue("gray.300", "inherit")
  const { agreeWithTOS, setAgreeWithTOS } = useGuildCheckoutContext()

  return (
    <Checkbox
      alignItems="start"
      sx={{
        "> .chakra-checkbox__control": {
          marginTop: 1,
          borderWidth: 1,
          borderColor,
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
