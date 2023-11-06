import { Button, Collapse, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import CreateGuildButton from "../CreateGuildButton"
import { useCreateGuildContext } from "../CreateGuildContext"
import GuildCreationProgress from "../GuildCreationProgress"
import TemplateCard from "./components/TemplateCard"

const ChooseTemplate = (): JSX.Element => {
  const { triedEager, openWalletSelectorModal, isWalletSelectorModalOpen } =
    useWeb3ConnectionManager()
  const { account } = useWeb3React()
  const [part, setPart] = useState(1)

  useEffect(() => {
    if (!triedEager || account || isWalletSelectorModalOpen) return
    openWalletSelectorModal()
  }, [triedEager, account, isWalletSelectorModalOpen])

  const { getTemplate, setTemplate, nextStep, toggleReward } =
    useCreateGuildContext()

  const { control } = useFormContext<GuildFormType>()

  const roles = useWatch({ control, name: "roles" })

  return (
    <>
      <VStack>
        {getTemplate().map((template) => (
          <Collapse
            in={
              part === 1 ||
              (part === 2 && !!roles.find((role) => role.name === template.name))
            }
            style={{ width: "100%" }}
            key={template.name}
          >
            <TemplateCard
              part={part}
              name={template.name}
              role={template}
              selected={!!roles.find((role) => role.name === template.name)}
              {...template}
              onClick={(templateName) => {
                if (part === 1) setTemplate(templateName)
              }}
              onCheckReward={(rewradIndex) => {
                toggleReward(template.name, rewradIndex)
              }}
            />
          </Collapse>
        ))}
      </VStack>
      <GuildCreationProgress
        next={() => {
          if (part === 1) {
            setPart(2)
          } else nextStep()
        }}
        progress={part === 1 ? 50 : 65}
        isDisabled={!roles.length}
        customButton={
          part === 1 ? (
            <Button colorScheme="green" onClick={() => setPart(2)}>
              Continue
            </Button>
          ) : (
            <>
              <Button onClick={() => setPart(1)}>Cancel</Button>
              <CreateGuildButton isDisabled={!roles.length} />
            </>
          )
        }
      />
    </>
  )
}

export default ChooseTemplate
