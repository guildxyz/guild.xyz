import { Collapse, Divider, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import LogicDivider from "components/[guild]/LogicDivider"
import { targetRoleAtom } from "components/[guild]/RoleCard/components/EditRole/EditRole"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useAtomValue } from "jotai"
import { useFormContext, useWatch } from "react-hook-form"
import { PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../../../DefaultAddRewardPanelWrapper"
import BaseValueModal from "../../DynamicSetup/BaseValueModal"
import DynamicSetupButton from "../../DynamicSetup/DynamicSetupButton"
import { DONT_SHOW_DYNAMIC_INFO_KEY } from "../../DynamicSetup/InformationModal"
import AddNewPointsType from "./AddNewPointsType"
import ExistingPointsTypeSelect from "./ExistingPointsTypeSelect"
import SetPointsAmount from "./SetPointsAmount"

const PointsRewardSetup = ({ onSubmit }: { onSubmit }) => {
  const { guildPlatforms } = useGuild()

  const existingPointsRewards = guildPlatforms.filter(
    (gp) => gp.platformId === PlatformType.POINTS
  )

  const { control } = useFormContext()
  const selectedExistingId = useWatch({
    control,
    name: "data.guildPlatformId",
  })
  const localName = useWatch({ control, name: "name" })
  const localImageUrl = useWatch({ control, name: "imageUrl" })

  const { name: selectedName, imageUrl: selectedImageUrl } =
    existingPointsRewards?.find((gp) => gp.id === selectedExistingId)
      ?.platformGuildData ?? {}

  const name = selectedName ?? localName
  const imageUrl = selectedExistingId ? selectedImageUrl : localImageUrl // not just ?? so it doesn't stay localImageUrl if we upload an image then switch to an existing type without image

  const targetRoleId = useAtomValue(targetRoleAtom)

  const {
    isOpen: baseValueModalIsOpen,
    onOpen: baseValueModalOnOpen,
    onClose: baseValueModalOnClose,
  } = useDisclosure()
  const { setStep } = useAddRewardContext()

  const handleBaseValueSelection = () => {
    baseValueModalOnClose()
    setStep("CONVERSION_SETUP")
  }

  const handleNext = () => {
    const dontShowInfo = localStorage.getItem(DONT_SHOW_DYNAMIC_INFO_KEY) === "true"
    if (dontShowInfo) {
      baseValueModalOnOpen()
    } else {
      setStep("INFO")
    }
  }

  return (
    <DefaultAddRewardPanelWrapper>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        Gamify your guild with a score system, so users can collect points / XP /
        your custom branded score, and compete on a leaderboard. You’ll also be able
        to set points based requirements for satisfying higher level roles!
      </Text>
      {!!existingPointsRewards.length && (
        <ExistingPointsTypeSelect
          existingPointsRewards={existingPointsRewards}
          selectedExistingId={selectedExistingId}
          showCreateNew
          mb="5"
        />
      )}
      <Collapse
        in={!existingPointsRewards.length || selectedExistingId === null}
        style={{ flexShrink: 0 }}
      >
        <AddNewPointsType
          name={name}
          imageUrl={imageUrl}
          isOptional={!existingPointsRewards.length}
        />
        <Divider mt={8} mb={7} />
      </Collapse>

      <SetPointsAmount {...{ imageUrl, name }} fieldName={"amount"} />

      <LogicDivider logic="OR" my={3} />
      <DynamicSetupButton onClick={handleNext} />

      <BaseValueModal
        roleId={targetRoleId as number}
        isOpen={baseValueModalIsOpen}
        onClose={baseValueModalOnClose}
        onSelect={handleBaseValueSelection}
      />

      <Flex justifyContent={"flex-end"} mt="auto" pt="10">
        <Button colorScheme="green" onClick={onSubmit}>
          Continue
        </Button>
      </Flex>
    </DefaultAddRewardPanelWrapper>
  )
}

export default PointsRewardSetup
