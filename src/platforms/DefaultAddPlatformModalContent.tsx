import {
  FormLabel,
  HStack,
  IconButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import useAddReward from "components/[guild]/AddRewardButton/hooks/useAddReward"
import useGuild from "components/[guild]/hooks/useGuild"
import RoleSelector from "components/[guild]/RoleSelector"
import { ArrowLeft } from "phosphor-react"
import { MutableRefObject, useState } from "react"
import { useFormContext } from "react-hook-form"
import { PlatformName } from "types"
import platforms, { PlatformUsageRestrictions } from "./platforms"

type Props = {
  modalRef: MutableRefObject<any>
  goBack: () => void
  selection: PlatformName
  setSelection: (platform: PlatformName) => void
  closeModal: () => void
  isForExistingRole?: boolean
}

const DefaultAddPlatformModalContent = ({
  modalRef,
  goBack: goBackOg,
  selection,
  setSelection,
  closeModal,
  isForExistingRole,
}: Props) => {
  const { setValue, reset, handleSubmit } = useFormContext()

  const [showRoleSelect, setShowRoleSelect] = useState(false)
  const { roles } = useGuild()

  const goBack = () => {
    if (showRoleSelect) setShowRoleSelect(false)
    else goBackOg()
  }

  const { AddPlatformPanel } = platforms[selection]

  const onSuccess = () => {
    closeModal()
    setShowRoleSelect(false)
    reset()
  }

  const { onSubmit, isLoading } = useAddReward(onSuccess)

  const scrollToTop = () => modalRef.current?.scrollTo({ top: 0 })

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
          <Text>{`Add ${platforms[selection].name}`}</Text>
        </HStack>
      </ModalHeader>

      <ModalBody ref={modalRef}>
        {selection === null ? (
          <PlatformsGrid onSelection={setSelection} showPoap />
        ) : showRoleSelect ? (
          <>
            <FormLabel mb="4">{`Select ${
              platforms[selection].usageRestriction ===
              PlatformUsageRestrictions.SINGLE_ROLE
                ? "a role"
                : "role(s)"
            } to add reward to`}</FormLabel>
            <RoleSelector
              allowMultiple={
                platforms[selection].usageRestriction !==
                PlatformUsageRestrictions.SINGLE_ROLE
              }
              roles={roles}
              onChange={(selectedRoleIds) => setValue("roleIds", selectedRoleIds)}
              size="lg"
            />
          </>
        ) : (
          <AddPlatformPanel
            onSuccess={
              isForExistingRole
                ? closeModal
                : selection === "POAP"
                ? onSuccess
                : () => setShowRoleSelect(true)
            }
            scrollToTop={scrollToTop}
            skipSettings
          />
        )}
      </ModalBody>

      {showRoleSelect && (
        <ModalFooter>
          <Button
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
