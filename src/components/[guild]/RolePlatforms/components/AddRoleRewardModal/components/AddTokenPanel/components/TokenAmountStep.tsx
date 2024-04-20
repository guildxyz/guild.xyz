import { Collapse, Flex, Stack } from "@chakra-ui/react"
import { useAccessedTokens } from "components/[guild]/AccessHub/hooks/useAccessedTokens"
import Button from "components/common/Button"
import RadioButtonGroup from "components/common/RadioButtonGroup"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TokenRewardType } from "../AddTokenPanel"
import DynamicAmount from "./DynamicAmount"
import StaticAmount from "./StaticAmount"

const TokenAmountStep = ({ onContinue }: { onContinue: () => void }) => {
  const { setValue } = useFormContext()

  const type: TokenRewardType = useWatch({ name: `type` })

  const requirements = useWatch({ name: `requirements` })
  const multiplier = useWatch({ name: `multiplier` })
  const addition = useWatch({ name: `addition` })
  const chain = useWatch({ name: `chain` })
  const address = useWatch({ name: `tokenAddress` })

  const accessedTokens = useAccessedTokens()

  const platformForToken = accessedTokens.find(
    (guildPlatform) =>
      guildPlatform.platformGuildData.chain === chain &&
      guildPlatform.platformGuildData.tokenAddress === address
  )

  useEffect(() => {
    if (platformForToken) setValue("type", TokenRewardType.STATIC)
  }, [platformForToken, setValue])

  const getContinueDisabled = () => {
    switch (type) {
      case TokenRewardType.DYNAMIC_SNAPSHOT:
        return requirements === undefined || multiplier === undefined
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

  const options = [
    {
      label: "Dynamic amount",
      value: TokenRewardType.DYNAMIC_SNAPSHOT,
      disabled: !!platformForToken,
    },
    {
      label: "Static amount",
      value: TokenRewardType.STATIC,
    },
  ]

  const [isCollapsed, ,] = useState(false)

  return (
    <Stack gap={5}>
      <RadioButtonGroup
        options={options}
        value={type}
        onChange={(val) => {
          setValue("type", val)
        }}
        chakraStyles={{
          spacing: 1.5,
          mt: 2,
          size: "sm",
          width: "full",
          colorScheme: "indigo",
          mb: -2,
        }}
      />

      <Collapse startingHeight={150} animateOpacity in={!isCollapsed}>
        <Stack gap={5}>
          {[
            TokenRewardType.DYNAMIC_POINTS,
            TokenRewardType.DYNAMIC_SNAPSHOT,
          ].includes(type) ? (
            <DynamicAmount />
          ) : (
            <StaticAmount />
          )}
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
