import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import NftDataForm, {
  CreateNftFormType,
} from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/NftDataForm"
import { ContractCallSupportedChain } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { Modal } from "components/common/Modal"
import { FormProvider, useForm } from "react-hook-form"
import { GuildPlatform } from "types"
import { formatUnits } from "viem"
import { CHAIN_CONFIG } from "wagmiConfig/chains"

type Props = {
  isOpen: boolean
  onClose: () => void
  guildPlatform: GuildPlatform
}

const EditNftModal = ({ isOpen, onClose, guildPlatform }: Props) => {
  const {
    chain,
    contractAddress,
    description: platformGuildDataDescription,
  } = guildPlatform.platformGuildData
  const {
    maxSupply,
    mintableAmountPerUser,
    soulbound,
    fee,
    name,
    image,
    description,
    attributes,
    treasury,
  } = useNftDetails(chain, contractAddress)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Edit NFT</ModalHeader>
        <ModalBody pt={0}>
          TODO: show a spinner first, and only return the component if we can fill
          defaultValues
          <EditNftForm
            defaultValues={{
              chain: chain as ContractCallSupportedChain,
              tokenTreasury: treasury,
              name,
              price: Number(
                formatUnits(fee, CHAIN_CONFIG[chain].nativeCurrency.decimals)
              ),
              description,
              richTextDescription: platformGuildDataDescription,
              image,
              attributes: attributes?.map((attr) => ({
                name: attr.trait_type,
                value: attr.value,
              })),
              maxSupply: Number(maxSupply),
              mintableAmountPerUser: Number(mintableAmountPerUser),
              soulbound: soulbound ? "true" : "false",
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const EditNftForm = ({ defaultValues }: { defaultValues: CreateNftFormType }) => {
  const methods = useForm<CreateNftFormType>({
    mode: "all",
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <NftDataForm isEditMode>{/* TODO: Submit button & hook */}</NftDataForm>
    </FormProvider>
  )
}

export default EditNftModal
