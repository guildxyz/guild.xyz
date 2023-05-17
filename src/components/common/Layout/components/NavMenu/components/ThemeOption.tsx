import { Icon, useColorMode, useRadio } from "@chakra-ui/react"
import Button from "components/common/Button"
import { useRouter } from "next/router"

const LogicOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const router = useRouter()

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { label, icon, isChecked } = props

  const { colorMode } = useColorMode()

  return (
    <Button
      leftIcon={icon ? <Icon as={icon} /> : null}
      as="label"
      {...checkbox}
      boxShadow="none !important"
      colorScheme={isChecked ? "indigo" : "gray"}
      bgColor={colorMode === "light" && !isChecked ? "white" : undefined}
      _active={isChecked ? { bg: null } : undefined}
      _hover={isChecked ? { bg: null } : undefined}
      cursor="pointer"
      size="xs"
      borderRadius="lg"
      isDisabled={["/", "/guildverse", "/brain/[pageSlug]"].includes(
        router.pathname
      )}
    >
      <input {...input} />
      {label}
    </Button>
  )
}

export default LogicOption
