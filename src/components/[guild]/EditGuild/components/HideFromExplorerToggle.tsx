import { FormControl, HStack, Icon, Text, Tooltip } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { Info } from "phosphor-react"
import { useFormContext } from "react-hook-form"

const HideFromExplorerToggle = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <Switch
        {...register("hideFromExplorer")}
        title={
          <HStack>
            <Text>Hide from explorer</Text>

            <Tooltip label="By default only verified guilds are shown in explorer, but users can still find your guild if they search for it. You can disable that here (or the default listing too, if your guild is verified)">
              <Icon as={Info} opacity={0.6} aria-label="Info icon" />
            </Tooltip>
          </HStack>
        }
      />
    </FormControl>
  )
}

export default HideFromExplorerToggle
