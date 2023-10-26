import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import GoogleGuildSetup from "components/common/GoogleGuildSetup"
import { defaultValues } from "components/create-guild/CreateGuildContext"
import Pagination from "components/create-guild/Pagination"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const CreateGuildGoogle = (): JSX.Element => {
  const { control } = useFormContext<GuildFormType>()

  const selectedDocument = useWatch({
    control,
    name: "guildPlatforms.0.platformGuildId",
  })

  return (
    <>
      <ModalHeader>Add Google files</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <GoogleGuildSetup
          defaultValues={defaultValues.GOOGLE}
          fieldNameBase="guildPlatforms.0."
          shouldSetName
          permissionField="roles.0.rolePlatforms.0.platformRoleId"
        />
      </ModalBody>
      <ModalFooter>
        <Pagination nextButtonDisabled={!selectedDocument} />
      </ModalFooter>
    </>
  )
}

export default CreateGuildGoogle
