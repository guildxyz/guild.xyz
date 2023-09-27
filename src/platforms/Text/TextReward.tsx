import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import { ArrowSquareOut } from "phosphor-react"
import ViewFullTextModal from "./ViewFullTextModal"

const TextReward = ({ platform, withMotionImg }: RewardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const platformGuildData = platform.guildPlatform.platformGuildData

  return (
    <>
      <RewardDisplay
        icon={
          <RewardIcon
            rolePlatformId={platform.id}
            guildPlatform={platform?.guildPlatform}
            withMotionImg={withMotionImg}
          />
        }
        label={
          <>
            {`View text: `}
            <Button
              variant="link"
              rightIcon={<ArrowSquareOut />}
              iconSpacing="1"
              maxW="full"
              onClick={onOpen}
            >
              {platformGuildData.name ?? "Text reward"}
            </Button>
          </>
        }
      />

      <ViewFullTextModal isOpen={isOpen} onClose={onClose}>
        {platformGuildData.text}
      </ViewFullTextModal>
    </>
  )
}
export default TextReward
