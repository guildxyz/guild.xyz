import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Collapse,
  Flex,
  Stack,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useRolePlatformsOfReward from "rewards/Token/hooks/useRolePlatformsOfReward"
import { PlatformType } from "types"
import { AddTokenFormType, TokenRewardType } from "../types"
import DynamicAmount from "./DynamicAmount"

const TokenAmountStep = ({ onContinue }: { onContinue: () => void }) => {
  const { control, setValue } = useFormContext<AddTokenFormType>()

  const type = useWatch({ control, name: `type` })

  const multiplier = useWatch({ control, name: `multiplier` })
  const addition = useWatch({ control, name: `addition` })
  const chain = useWatch({ control, name: `chain` })
  const address = useWatch({ control, name: `tokenAddress` })
  const snapshotRequirement = useWatch({ control, name: `snapshotRequirement` })

  const { guildPlatforms } = useGuild()

  const tokenPlatforms = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.ERC20
  )

  const platformForToken = tokenPlatforms?.find(
    (guildPlatform) =>
      guildPlatform.platformGuildData.chain === chain &&
      guildPlatform.platformGuildData.tokenAddress.toLowerCase() ===
        address?.toLowerCase()
  )

  const rolePlatforms = useRolePlatformsOfReward(platformForToken?.id)

  const dynamicExists =
    rolePlatforms?.find(
      (rp: any) =>
        rp.dynamicAmount?.operation?.input?.[0]?.type === "REQUIREMENT_AMOUNT" &&
        rp?.guildPlatformId === platformForToken?.id
    ) || false

  useEffect(() => {
    if (platformForToken) setValue("type", TokenRewardType.STATIC)
  }, [platformForToken, setValue])

  const getContinueDisabled = () => {
    switch (type) {
      case TokenRewardType.DYNAMIC_SNAPSHOT:
        return snapshotRequirement === undefined || multiplier === undefined
      case TokenRewardType.STATIC:
        return addition === undefined
      case TokenRewardType.DYNAMIC_POINTS:
        // TODO
        return true
      default:
        return true
    }
  }

  const isContinueDisabled = getContinueDisabled()
  const [isCollapsed, ,] = useState(false)

  if (dynamicExists)
    return (
      <>
        <Alert status="warning" my={4}>
          <AlertIcon mt={0} />
          <Box>
            <AlertTitle>Only one dynamic reward is allowed per token</AlertTitle>
            <AlertDescription>
              To create a new one, you must first delete the existing reward
            </AlertDescription>
          </Box>
        </Alert>
      </>
    )

  return (
    <Stack gap={5}>
      <Collapse
        startingHeight={150}
        animateOpacity
        in={!isCollapsed}
        style={{ padding: "2px", margin: "-2px" }}
      >
        <Stack gap={5}>
          <DynamicAmount />
        </Stack>
      </Collapse>

      <Flex justifyContent={"flex-end"} mt="4">
        <Button
          isDisabled={isContinueDisabled}
          colorScheme="indigo"
          onClick={onContinue}
        >
          Continue
        </Button>
      </Flex>
    </Stack>
  )
}

export default TokenAmountStep
