import { Box } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import { useCreateGuildContext } from "../CreateGuildContext"
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
    setTemplate,
  } = useCreateGuildContext()

  const { control, setValue } = useFormContext<GuildFormType>()

  const requirements = useWatch({ control, name: "roles.0.requirements" })

  return (
    <>
      <Box sx={{ columnCount: [1, 1, 2], columnGap: [4, 4, 6] }}>
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
      </Box>
      <Pagination nextButtonDisabled={!requirements?.length} />
    </>
  )
}

export default ChooseTemplate
