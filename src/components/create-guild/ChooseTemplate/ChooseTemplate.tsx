import { SimpleGrid } from "@chakra-ui/react"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { useCreateGuildContext } from "../CreateGuildContext"
import Pagination from "../Pagination"
import TemplateCard from "./components/TemplateCard"

const ChooseTemplate = (): JSX.Element => {
  const { isWeb3Connected, openWalletSelectorModal, isWalletSelectorModalOpen } =
    useWeb3ConnectionManager()

  useEffect(() => {
    if (isWeb3Connected || isWalletSelectorModalOpen) return
    openWalletSelectorModal()
  }, [isWeb3Connected, isWalletSelectorModalOpen])

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
