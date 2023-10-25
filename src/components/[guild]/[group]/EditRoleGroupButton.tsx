import { IconButton, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GearSix } from "phosphor-react"
import { FormProvider, useForm } from "react-hook-form"
import EditRoleGroupModal from "../AccessHub/components/RoleGroupCards/components/EditRoleGroupModal"
import { RoleGroupFormType } from "../CreateRoleGroupModal/components/RoleGroupForm"
import useGroup from "../hooks/useGroup"
import useGuild from "../hooks/useGuild"
import { useThemeContext } from "../ThemeContext"

const EditRoleGroupButton = () => {
  const router = useRouter()

  const { urlName } = useGuild()
  const group = useGroup()
  const { name, imageUrl, description } = group ?? {}

  const { textColor, buttonColorScheme } = useThemeContext()

  const methods = useForm<RoleGroupFormType>({
    mode: "all",
    defaultValues: {
      name,
      imageUrl: imageUrl ?? "",
      description: description ?? "",
    },
  })

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton
        icon={<GearSix />}
        aria-label="Edit campaign"
        minW="44px"
        rounded="full"
        colorScheme={buttonColorScheme}
        color={textColor}
        onClick={onOpen}
      />

      <FormProvider {...methods}>
        <EditRoleGroupModal
          isOpen={isOpen}
          onClose={onClose}
          groupId={group.id}
          onSuccess={(response) => {
            router?.push(`/${urlName}/${response.urlName}`)
          }}
        />
      </FormProvider>
    </>
  )
}
export default EditRoleGroupButton
