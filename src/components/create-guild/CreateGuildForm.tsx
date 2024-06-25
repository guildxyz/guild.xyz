import {
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import Card from "components/common/Card"
import FormErrorMessage from "components/common/FormErrorMessage"
import usePinata from "hooks/usePinata"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import getColorByImage from "utils/getColorByImage"
import CreateGuildButton from "./CreateGuildButton"
import IconSelector from "./IconSelector"
import Name from "./Name"

export type CreateGuildFormType = Pick<
  Schemas["GuildCreationPayload"],
  "name" | "imageUrl" | "contacts" | "theme"
>

const CreateGuildForm = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext<CreateGuildFormType>()

  const iconUploader = usePinata({
    fieldToSetOnSuccess: "imageUrl",
    fieldToSetOnError: "imageUrl",
    control,
  })

  const { emails, platformUsers } = useUser()

  const providedEmail = useWatch({ control, name: "contacts.0.contact" })
  useEffect(() => {
    if (!!providedEmail || touchedFields.contacts?.[0]?.contact) return

    const emailAddress = emails?.emailAddress
    const googleEmailAddress = platformUsers?.find(
      (pu) => pu.platformName === "GOOGLE"
    )?.platformUserId

    if (!emailAddress && !googleEmailAddress) return

    setValue("contacts.0.contact", emailAddress ?? googleEmailAddress)
  }, [touchedFields.contacts, emails, platformUsers, providedEmail, setValue])

  return (
    <Stack
      w="min(100%, var(--chakra-sizes-md))"
      mx="auto"
      pt={{ base: 8, md: 16 }}
      pb={8}
    >
      <Card py={6} p={{ base: 5, md: 6 }} mx={{ base: -3, sm: 0 }}>
        <Heading
          as="h2"
          fontFamily="display"
          textAlign="center"
          fontSize="2xl"
          mb="7"
        >
          Begin your guild
        </Heading>

        <Center mb="6">
          <IconSelector
            uploader={iconUploader}
            minW={512}
            minH={512}
            onGeneratedBlobChange={async (objectURL) => {
              const generatedThemeColor = await getColorByImage(objectURL)
              setValue("theme.color", generatedThemeColor)
            }}
            boxSize={28}
          />
        </Center>

        <FormControl isRequired mb="4">
          <FormLabel>Guild name</FormLabel>
          <Name width="full" />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.contacts?.[0]?.contact} mb="10">
          <FormLabel>Your email</FormLabel>
          <Input
            {...register("contacts.0.contact", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid e-mail format",
              },
            })}
            size="lg"
          />
          <FormErrorMessage>
            {errors.contacts?.[0]?.contact?.message}
          </FormErrorMessage>
        </FormControl>

        <CreateGuildButton />
      </Card>
    </Stack>
  )
}

export default CreateGuildForm
