import { Box, Button, Icon, Tooltip, useRadio } from "@chakra-ui/react"
import And from "static/logicIcons/and.svg"
import Nand from "static/logicIcons/nand.svg"
import Nor from "static/logicIcons/nor.svg"
import Or from "static/logicIcons/or.svg"

const IconLogicPairs = {
  AND: And,
  OR: Or,
  NOR: Nor,
  NAND: Nand,
}

const LogicOption = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  const { value, disabled = false, isChecked } = props

  if (disabled)
    return (
      <Tooltip label="Coming soon">
        <Box>
          <Button
            leftIcon={<Icon as={IconLogicPairs[value]} boxSize={5} />}
            disabled
            w="full"
          >
            {value}
          </Button>
        </Box>
      </Tooltip>
    )

  return (
    <Button
      leftIcon={<Icon as={IconLogicPairs[value]} boxSize={5} />}
      as="label"
      {...checkbox}
      colorScheme={isChecked ? "DISCORD" : "gray"}
      boxShadow="none !important"
      _active={isChecked ? { bg: null } : undefined}
      _hover={isChecked ? { bg: null } : undefined}
      cursor="pointer"
    >
      <input {...input} />
      {value}
    </Button>
  )
}

export default LogicOption
