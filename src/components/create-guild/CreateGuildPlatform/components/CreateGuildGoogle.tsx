import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { useCreateGuildContext } from "components/create-guild/CreateGuildContext"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { GuildFormType, PlatformType } from "types"
import getRandomInt from "utils/getRandomInt"

const CreateGuildGoogle = (): JSX.Element => {
  const methods = useFormContext<GuildFormType>()
  const googleMethods = useForm()
  const { setPlatform } = useCreateGuildContext()
  const { append } = useFieldArray({
    control: methods.control,
    name: "guildPlatforms",
  })

  const permission = useWatch({
    control: googleMethods.control,
    name: "permission",
  })

  const googleData = useWatch({
    control: googleMethods.control,
    name: "googleData",
  })

  return (
    <>
      <ModalHeader>Add Google files</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormProvider {...googleMethods}>
          <GoogleGuildSetup
            defaultValues={{
              name: "",
              description: "",
              imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
              contacts: [{ type: "EMAIL", contact: "" }],
              guildPlatforms: [
                {
                  platformName: "GOOGLE",
                  platformGuildId: "",
                },
              ],
            }}
            fieldNameBase="googleData."
            shouldSetName
            permissionField="permission"
          />
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="green"
          isDisabled={!permission}
          onClick={() => {
            append({
              platformName: "GOOGLE",
              platformGuildId: googleMethods.getValues("googleData.platformGuildId"),
              platformId: PlatformType.GOOGLE,
              platformGuildData: {
                text: undefined,
                name: googleMethods.getValues("name"),
                imageUrl: googleMethods.getValues(
                  "googleData.platformGuildData.iconLink"
                ),
                ...googleData.platformGuildData,
                role: googleMethods.getValues("permission"),
              },
            })
            setPlatform(null)
          }}
        >
          Add
        </Button>
      </ModalFooter>
    </>
  )
}

export default CreateGuildGoogle
