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
import {
  datetimeLocalToIsoString,
  getShortDate,
} from "components/[guild]/RolePlatforms/components/EditRewardAvailabilityModal/components/StartEndTimeForm"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { useCallback } from "react"
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

  const { roles } = useGuild()
  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

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
              rolePlatformId={rolePlatform.id}
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
                startTime: getShortDate(rolePlatform.startTime),
                endTime: getShortDate(rolePlatform.endTime),
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
  rolePlatformId,
}: {
  defaultValues: CreateNftFormType
  guildPlatformId: number
  rolePlatformId: number
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

  const { onSubmit, isLoading } = useEditNft(guildPlatformId, rolePlatformId)

  const handleSubmitCallback = useCallback(
    (data: CreateNftFormType) =>
      onSubmit(
        getNftDataFormDirtyFields(
          {
            ...data,
            startTime: datetimeLocalToIsoString(data.startTime),
            endTime: datetimeLocalToIsoString(data.endTime),
          },
          methods.formState.dirtyFields
        )
      ),
    [methods.formState.dirtyFields, onSubmit]
  )

  return (
    <FormProvider {...methods}>
      <NftDataForm
        isEditMode
        submitButton={
          <Button
            colorScheme="green"
            isDisabled={shouldSwitchChain}
            onClick={methods.handleSubmit(handleSubmitCallback)}
            isLoading={isLoading}
            loadingText="Saving"
          >
            Save
          </Button>
        }
      />
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

  for (const key of Object.keys(dirtyRootFields)) {
    filteredData[key] = rootFields[key]
  }

  return filteredData
}

export default EditNftModal
