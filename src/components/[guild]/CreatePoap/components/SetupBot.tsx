import { FormControl, Text, VStack } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { FormProvider, useForm } from "react-hook-form"

type PoapDiscordEmbedForm = {
  title: string
  description: string
  button: string
}

const SetupBot = (): JSX.Element => {
  const methods = useForm<PoapDiscordEmbedForm>({
    mode: "all",
    defaultValues: {
      title: "Claim POAP",
      description: "Lorem ipsum dolor sit amet, asd, qwery.",
      button: "Claim now",
    },
  })

  return (
    <VStack>
      <Text>
        Feel free to customize the embed below - the bot will send this to your
        Discord server and your Guild's members will be able to claim their POAP
        using the button in it.
      </Text>

      <FormProvider {...methods}>
        <FormControl isInvalid={!!Object.keys(methods.formState.errors).length}>
          TODO
          <FormErrorMessage>Some fields are empty</FormErrorMessage>
        </FormControl>
      </FormProvider>
    </VStack>
  )
}

export default SetupBot
