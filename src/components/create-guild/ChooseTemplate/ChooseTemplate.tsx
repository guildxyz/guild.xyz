import { SimpleGrid } from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { useAccount } from "wagmi"
import { useCreateGuildContext } from "../CreateGuildContext"
import Pagination from "../Pagination"
import TemplateCard from "./components/TemplateCard"

const ChooseTemplate = (): JSX.Element => {
  const { triedEager, openWalletSelectorModal, isWalletSelectorModalOpen } =
    useWeb3ConnectionManager()
  const { address } = useAccount()

  useEffect(() => {
    if (!triedEager || address || isWalletSelectorModalOpen) return
    openWalletSelectorModal()
  }, [triedEager, address, isWalletSelectorModalOpen])

  const {
    TEMPLATES,
    template: templateInContext,
    setTemplate,
  } = useCreateGuildContext()

  const { control, setValue } = useFormContext<GuildFormType>()

  const requirements = useWatch({ control, name: "roles.0.requirements" })

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
        {Object.entries(TEMPLATES).map(([id, template], index) => (
          <TemplateCard
            key={index}
            id={id}
            {...template}
            selected={id === templateInContext}
            onClick={(newTemplateId) => {
              setValue("roles", TEMPLATES[newTemplateId].roles)
              setTemplate(newTemplateId)
            }}
          />
        ))}
      </SimpleGrid>
      <Pagination nextButtonDisabled={!requirements?.length} />
    </>
  )
}

export default ChooseTemplate
