import { ModalBody, ModalCloseButton, ModalHeader, Text } from "@chakra-ui/react"
import { PlatformName } from "@guildxyz/types"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import PlatformsGrid from "components/create-guild/PlatformsGrid"
import { AddRewardPanelProps } from "platforms/rewards"
import SelectExistingPlatform from "./components/SelectExistingPlatform"

type Props = {
  append?: AddRewardPanelProps["onAdd"]
  showExisting?: boolean
  disabledRewards?: Partial<Record<PlatformName, string>>
}

const SelectRewardPanel = ({
  append,
  showExisting = false,
  disabledRewards = {},
}: Props) => {
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
          disabledRewards={disabledRewards}
        />
      </ModalBody>
    </>
  )
}

export default SelectRewardPanel
