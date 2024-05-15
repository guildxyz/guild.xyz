import {
  Center,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react"
import NftDataForm, {
  CreateNftFormType,
} from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/components/NftDataForm"
import { ContractCallSupportedChain } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddContractCallPanel/components/CreateNftForm/hooks/useCreateNft"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { FormProvider, FormState, useForm, useWatch } from "react-hook-form"
import { GuildPlatform } from "types"
import { formatUnits } from "viem"
import { useAccount } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import useEditNft from "../hooks/useEditNft"

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
    isLoading,
  } = useNftDetails(chain, contractAddress)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      colorScheme="dark"
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Edit NFT</ModalHeader>
        <ModalBody pt={0}>
          {isLoading ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : (
            <EditNftForm
              guildPlatformId={guildPlatform.id}
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
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const EditNftForm = ({
  defaultValues,
  guildPlatformId,
}: {
  defaultValues: CreateNftFormType
  guildPlatformId: number
}) => {
  const methods = useForm<CreateNftFormType>({
    mode: "all",
    defaultValues,
  })

  const { chainId } = useAccount()
  const chain = useWatch({
    control: methods.control,
    name: "chain",
  })
  const shouldSwitchChain = Chains[chainId] !== chain

  const { onSubmit, isLoading } = useEditNft(guildPlatformId)

  return (
    <FormProvider {...methods}>
      <NftDataForm isEditMode>
        <Button
          colorScheme="green"
          isDisabled={shouldSwitchChain}
          onClick={methods.handleSubmit((data) =>
            onSubmit(getNftDataFormDirtyFields(data, methods.formState.dirtyFields))
          )}
          isLoading={isLoading}
          loadingText="Saving"
        >
          Save
        </Button>
      </NftDataForm>
    </FormProvider>
  )
}

const getNftDataFormDirtyFields = (
  data: CreateNftFormType,
  dirtyFields: FormState<CreateNftFormType>["dirtyFields"]
) => {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    name: _name,
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    chain: _chain,
    attributes,
    ...rootFields
  } = data
  const { attributes: dirtyAttributes, ...dirtyRootFields } = dirtyFields

  const hasDirtyAttributes = dirtyAttributes?.some((attr) => attr.name || attr.value)

  const filteredData: Partial<CreateNftFormType> = {}

  if (hasDirtyAttributes) {
    filteredData.attributes = attributes
  }

  for (const key in Object.keys(dirtyRootFields)) {
    filteredData[key] = rootFields[key]
  }

  return filteredData
}

export default EditNftModal
