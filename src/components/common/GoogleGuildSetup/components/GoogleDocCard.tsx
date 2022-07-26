import { HStack, Img, Stack, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import useCreateGuild from "components/create-guild/hooks/useCreateGuild"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GoogleFile } from "types"

type Props = {
  file: GoogleFile
}

const GoogleDocCard = ({ file }: Props): JSX.Element => {
  const { control, setValue, handleSubmit } = useFormContext()
  const platformGuildId = useWatch({
    control,
    name: "guildPlatforms.0.platformGuildId",
  })

  const { onSubmit, isLoading, isSigning, signLoadingText } = useCreateGuild()

  useEffect(() => {
    if (!platformGuildId) return
    handleSubmit(onSubmit, console.log)()
  }, [platformGuildId])

  return (
    <Card px={{ base: 5, sm: 6 }} py="7">
      <Stack w="full" spacing={4}>
        <HStack>
          <Img
            src={file.iconLink?.replace("/16", "/32")}
            alt={file.mimeType}
            boxSize={6}
          />
          <Text
            as="span"
            fontFamily="display"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
            maxW="full"
            isTruncated
          >
            {file.name}
          </Text>
        </HStack>

        <Button
          isDisabled={isLoading || isSigning}
          isLoading={isLoading || isLoading}
          loadingText={signLoadingText || "Creating guild"}
          onClick={() => {
            setValue("name", file.name)
            setValue("guildPlatforms.0.platformGuildId", file.platformGuildId)
          }}
        >
          Gate file
        </Button>
      </Stack>
    </Card>
  )
}

export default GoogleDocCard
