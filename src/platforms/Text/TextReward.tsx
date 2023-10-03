import { Spinner, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import { ArrowSquareOut } from "phosphor-react"
import useClaimText, { ClaimTextModal } from "./hooks/useClaimText"

const TextReward = ({ platform, withMotionImg }: RewardProps) => {
  const platformGuildData = platform.guildPlatform.platformGuildData

  const {
    onSubmit,
    isLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(platform.id)

  return (
    <>
      <RewardDisplay
        icon={
          isLoading ? (
            <Spinner boxSize={6} />
          ) : (
            <RewardIcon
              rolePlatformId={platform.id}
              guildPlatform={platform?.guildPlatform}
              withMotionImg={withMotionImg}
            />
          )
        }
        label={
          isLoading ? (
            <Text opacity={0.5}>Claiming reward...</Text>
          ) : (
            <>
              {`View text: `}
              <Button
                variant="link"
                rightIcon={<ArrowSquareOut />}
                iconSpacing="1"
                maxW="full"
                onClick={() => {
                  onSubmit()
                  onOpen()
                }}
              >
                {platformGuildData.name ?? "Secret"}
              </Button>
            </>
          )
        }
      />

      <ClaimTextModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
        response={response}
      />
    </>
  )
}
export default TextReward
