import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { GuildFormType, PlatformType } from "types"
import getRandomInt from "utils/getRandomInt"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const CreateGuildGoogle = ({ isOpen, onClose }: Props): JSX.Element => {
  const methods = useFormContext<GuildFormType>()
  const googleMethods = useForm()
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
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
                platformGuildId: googleMethods.getValues(
                  "googleData.platformGuildId"
                ),
                platformId: PlatformType.GOOGLE,
                platformGuildData: {
                  text: undefined,
                  name: googleMethods.getValues("name"),
                  imageUrl: googleMethods.getValues(
                    "googleData.platformGuildData.iconLink"
                  ),
                  ...googleData.platformGuildData,
                  gatherRole: googleMethods.getValues("permission"),
                },
              })
              onClose()
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateGuildGoogle
