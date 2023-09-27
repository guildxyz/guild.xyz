import { FormControl, FormLabel, Stack, Textarea } from "@chakra-ui/react"
import Button from "components/common/Button"
import useGuild from "components/[guild]/hooks/useGuild"
import { useState } from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
}

const AddTextPanel = ({ onSuccess }: Props) => {
  const { id: guildId } = useGuild()

  const [text, setText] = useState("")

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  return (
    <Stack>
      <FormControl>
        <FormLabel>Text:</FormLabel>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          minH={64}
          placeholder="Type or paste here the text which you'd like to send as reward to your users..."
        />
      </FormControl>

      <Button
        colorScheme="indigo"
        isDisabled={!text?.length}
        w="max-content"
        ml="auto"
        onClick={() => {
          append({
            guildPlatform: {
              platformName: "TEXT",
              platformGuildId: `text-${guildId}-${Date.now()}`,
              platformGuildData: {
                text,
              },
            },
            isNew: true,
            visibility: roleVisibility,
          })
          onSuccess()
        }}
      >
        Continue
      </Button>
    </Stack>
  )
}
export default AddTextPanel
