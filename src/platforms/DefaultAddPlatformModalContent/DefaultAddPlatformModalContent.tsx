import {
  HStack,
  IconButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import useCreateRole from "components/create-guild/hooks/useCreateRole"
import useAddReward from "components/[guild]/AddRewardButton/hooks/useAddReward"
import {
  RolesOrRequirementsTabs,
  useAddRewardContext,
} from "components/[guild]/AddRewardContext"
import { ArrowLeft } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import getRandomInt from "utils/getRandomInt"
import platforms from "../platforms"
import SelectRoleOrSetRequirements from "./components/SelectRoleOrSetRequirements"

type Props = {
  isForExistingRole?: boolean
}

const DefaultAddPlatformModalContent = ({ isForExistingRole }: Props) => {
  const { modalRef, selection, setSelection, step, setStep, activeTab, onClose } =
    useAddRewardContext()

  const { reset, handleSubmit } = useFormContext()

  const goBack = () => {
    if (step === "ROLES_REQUIREMENTS") {
      setStep("HOME")
      reset()
    } else {
      setSelection(null)
    }
  }

  const { AddPlatformPanel } = platforms[selection] ?? {}

  const requirements = useWatch({ name: "requirements" })
  const isAddRewardButtonDisabled =
    activeTab === RolesOrRequirementsTabs.NEW_ROLE && !requirements?.length

  const { onSubmit: onAddRewardSubmit, isLoading: isAddRewardLoading } =
    useAddReward(onClose)
  const { onSubmit: onCreateRoleSubmit, isLoading: isCreateRoleLoading } =
    useCreateRole(onClose)

  const isLoading = isAddRewardLoading || isCreateRoleLoading

  const onSubmit = (data: any) => {
    if (data.requirements?.length > 0) {
      onCreateRoleSubmit({
        ...data,
        name: `New ${platforms[selection].name} role`,
        imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
        roleIds: undefined,
      })
    } else {
      onAddRewardSubmit({
        ...data.rolePlatforms[0].guildPlatform,
        roleIds: data.roleIds?.filter((roleId) => !!roleId),
      })
    }
  }

  return (
    <>
      <ModalHeader>
        <HStack>
          <IconButton
            rounded="full"
            aria-label="Back"
            size="sm"
            mb="-3px"
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            onClick={goBack}
          />
          <Text>
            {selection ? `Add ${platforms[selection].name} reward` : "Add reward"}
          </Text>
        </HStack>
      </ModalHeader>

      <ModalBody ref={modalRef}>
        {selection && step === "ROLES_REQUIREMENTS" ? (
          <SelectRoleOrSetRequirements selectedPlatform={selection} />
        ) : AddPlatformPanel ? (
          <AddPlatformPanel
            onSuccess={
              isForExistingRole ? onClose : () => setStep("ROLES_REQUIREMENTS")
            }
            skipSettings
          />
        ) : null}
      </ModalBody>

      {step === "ROLES_REQUIREMENTS" && (
        <ModalFooter pt={8}>
          <Button
            isDisabled={isAddRewardButtonDisabled}
            colorScheme="green"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            Add reward
          </Button>
        </ModalFooter>
      )}
    </>
  )
}

export default DefaultAddPlatformModalContent
