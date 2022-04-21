import { Box, FormControl, Switch, Text } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const HideFromExplorerToggle = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <Switch
        {...register("hideFromExplorer")}
        colorScheme="primary"
        display="inline-flex"
        whiteSpace={"normal"}
      >
        <Box>
          <Text mb="1">Hide from explorer</Text>
          <Text fontWeight={"normal"} colorScheme="gray">
            Make guild private so only those will know about it who you share the
            link with
          </Text>
        </Box>
      </Switch>
    </FormControl>
  )
}

export default HideFromExplorerToggle
