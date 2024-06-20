import { Collapse } from "@chakra-ui/react"
import { walletSelectorModalAtom } from "components/_app/Web3ConnectionManager/components/WalletSelectorModal"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import { useSetAtom } from "jotai"
import { useFormContext } from "react-hook-form"
import { CreateGuildFormType } from "./CreateGuildForm"
import useCreateGuild from "./hooks/useCreateGuild"

const CreateGuildButton = () => {
  const { handleSubmit } = useFormContext<CreateGuildFormType>()
  const { onSubmit, isLoading } = useCreateGuild()

  const { isWeb3Connected } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)

  return (
    <>
      <Collapse in={!isWeb3Connected}>
        <Button
          size="xl"
          colorScheme="blue"
          onClick={() => setIsWalletSelectorModalOpen(true)}
          isDisabled={isWeb3Connected}
          w="full"
        >
          Connect wallet
        </Button>
      </Collapse>
      <Button
        colorScheme="green"
        ml="auto"
        size="xl"
        borderRadius="2xl"
        w="full"
        isLoading={isLoading}
        loadingText="Creating guild"
        onClick={handleSubmit(onSubmit)}
        isDisabled={!isWeb3Connected}
      >
        Create guild
      </Button>
    </>
  )
}

export default CreateGuildButton
