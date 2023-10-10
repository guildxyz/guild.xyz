import { VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { TemplateType, useCreateGuildContext } from "../CreateGuildContext"
import Pagination from "../Pagination"
import TemplateCard from "./components/TemplateCard"

const ChooseTemplate = (): JSX.Element => {
  const { triedEager, openWalletSelectorModal, isWalletSelectorModalOpen } =
    useWeb3ConnectionManager()
  const { account } = useWeb3React()

  useEffect(() => {
    if (!triedEager || account || isWalletSelectorModalOpen) return
    openWalletSelectorModal()
  }, [triedEager, account, isWalletSelectorModalOpen])

  const {
    TEMPLATES,
    template: templateInContext,
    getTemplate,
    setTemplate,
  } = useCreateGuildContext()

  const { control, setValue } = useFormContext<GuildFormType>()

  const requirements = useWatch({ control, name: "roles.0.requirements" })

  return (
    <>
      <VStack>
        {Object.entries(getTemplate()).map(([id, template], index) => (
          <TemplateCard
            key={index}
            id={id}
            selected={!!templateInContext.find((selected) => selected === id)}
            {...template}
            onClick={(newTemplateId) => {
              setValue("roles", TEMPLATES[newTemplateId].roles)
              setTemplate(id as TemplateType)
            }}
          />
        ))}
      </VStack>
      <Pagination nextButtonDisabled={!requirements?.length} />
    </>
  )
}

export default ChooseTemplate
