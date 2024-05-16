import { ModalBody, ModalCloseButton, ModalHeader, Text } from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { AddRewardPanelProps } from "platforms/rewards"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

type Props = {
  append?: AddRewardPanelProps["onAdd"]
  showExisting?: boolean
}

const SelectRewardPanel = ({ append, showExisting = false }: Props) => {
  const { modalRef, setSelection, setStep, onClose } = useAddRewardContext()

  return (
    <>
      <ModalCloseButton />
      <ModalHeader>
        <Text>Add reward</Text>
      </ModalHeader>

      <ModalBody ref={modalRef} className="custom-scrollbar">
        {showExisting && (
          <SelectExistingPlatform
            onClose={onClose}
            onSelect={(selectedRolePlatform) => append?.(selectedRolePlatform)}
          />
        )}
        <Text fontWeight="bold" mb="3">
          Add new reward
        </Text>
        <PlatformsGrid
          onSelection={(platform) => {
            setSelection(platform)
            setStep("REWARD_SETUP")
          }}
          disabledRewards={{
            ERC20: `Token rewards cannot be added to existing roles. Please use the "Add reward" button in the top right corner of the Guild page to create the reward with a new role.`,
          }}
        />
      </ModalBody>
    </>
  )
}

export default SelectRewardPanel
