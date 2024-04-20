import { Box, Button, Collapse } from "@chakra-ui/react"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useAtom } from "jotai"
import { ArrowLeft } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { useCreateGuildContext } from "../CreateGuildContext"
import TemplateCard from "./components/TemplateCard"
import useTemplate from "./useTemplate"

const ChooseTemplate = (): JSX.Element => {
  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { buildTemplate, toggleReward, toggleTemplate } = useTemplate()
  const [isWalletSelectorModalOpen, setIsWalletSelectorModalOpen] = useAtom(
    walletSelectorModalAtom
  )

  useEffect(() => {
    if (isWeb3Connected || isWalletSelectorModalOpen) return
    setIsWalletSelectorModalOpen(true)
  }, [isWeb3Connected, isWalletSelectorModalOpen, setIsWalletSelectorModalOpen])

  const { setDisabled, stepPart, setPart } = useCreateGuildContext()

  const { control } = useFormContext<GuildFormType>()

  const roles = useWatch({ control, name: "roles" })

  useEffect(() => {
    setDisabled(!roles.length)
  }, [setDisabled, roles.length])

  return (
    <>
      <Box>
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

        {buildTemplate().map((role) => (
          <Collapse
            in={
              stepPart === 0 ||
              (stepPart === 1 && !!roles.find((r) => r.name === role.name))
            }
            style={{ width: "100%", padding: 1, margin: -1 }}
            key={role.name}
          >
            <TemplateCard
              part={stepPart}
              name={role.name}
              role={role}
              selected={!!roles.find((r) => r.name === role.name)}
              {...role}
              onClick={(templateName) => {
                if (stepPart === 0) toggleTemplate(templateName)
              }}
              onCheckReward={(rewradIndex) => {
                toggleReward(role.name, rewradIndex)
              }}
            />
          </Collapse>
        ))}
      </Box>
    </>
  )
}

export default ChooseTemplate
