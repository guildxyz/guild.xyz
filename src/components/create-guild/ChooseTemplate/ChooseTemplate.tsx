import { Button, Collapse, VStack } from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { ArrowLeft } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { useAccount } from "wagmi"
import CreateGuildButton from "../CreateGuildButton"
import { useCreateGuildContext } from "../CreateGuildContext"
import GuildCreationProgress from "../GuildCreationProgress"
import TemplateCard from "./components/TemplateCard"

const ChooseTemplate = (): JSX.Element => {
  const { openWalletSelectorModal, isWalletSelectorModalOpen } =
    useWeb3ConnectionManager()
  const { address } = useAccount()

  useEffect(() => {
    if (address || isWalletSelectorModalOpen) return
    openWalletSelectorModal()
  }, [address, isWalletSelectorModalOpen])

  const { getTemplate, setTemplate, nextStep, toggleReward, stepPart, setPart } =
    useCreateGuildContext()

  const { control } = useFormContext<GuildFormType>()

  const roles = useWatch({ control, name: "roles" })

  return (
    <>
      <VStack>
        {stepPart === 1 && (
          <Button
            onClick={() => setPart(0)}
            variant={"link"}
            leftIcon={<ArrowLeft />}
            alignSelf={"flex-start"}
            mb={4}
          >
            Go back and choose more templates
          </Button>
        )}

        {getTemplate().map((role) => (
          <Collapse
            in={
              stepPart === 0 ||
              (stepPart === 1 && !!roles.find((r) => r.name === role.name))
            }
            style={{ width: "100%" }}
            key={role.name}
          >
            <TemplateCard
              part={stepPart}
              name={role.name}
              role={role}
              selected={!!roles.find((r) => r.name === role.name)}
              {...role}
              onClick={(templateName) => {
                if (stepPart === 0) setTemplate(templateName)
              }}
              onCheckReward={(rewradIndex) => {
                toggleReward(role.name, rewradIndex)
              }}
            />
          </Collapse>
        ))}
      </VStack>

      <GuildCreationProgress
        next={() => {
          if (stepPart === 0) {
            setPart(1)
          } else nextStep()
        }}
        progress={stepPart === 0 ? 50 : 65}
        isDisabled={!roles.length}
      >
        {stepPart === 0 ? (
          <Button
            isDisabled={!roles.length}
            colorScheme="green"
            onClick={() => setPart(1)}
          >
            Continue
          </Button>
        ) : (
          <>
            <CreateGuildButton isDisabled={!roles.length} />
          </>
        )}
      </GuildCreationProgress>
    </>
  )
}

export default ChooseTemplate
