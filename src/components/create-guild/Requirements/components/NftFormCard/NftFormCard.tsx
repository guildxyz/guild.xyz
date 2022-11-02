import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import useTokenData from "hooks/useTokenData"
import { Plus } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, NftRequirementType, Requirement, SelectOption } from "types"
import capitalize from "utils/capitalize"
import ChainPicker from "../ChainPicker"
import MinMaxAmount from "../MinMaxAmount"
import AttributePicker from "./components/AttributePicker"
import useNftMetadata from "./hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"
import useNftType from "./hooks/useNftType"

type Props = {
  index: number
  field: Requirement
}

type NftRequirementTypeOption = {
  label: string
  value: NftRequirementType
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const nftRequirementTypeOptions: Array<NftRequirementTypeOption> = [
  {
    label: "Amount",
    value: "AMOUNT",
  },
  {
    label: "Attribute",
    value: "ATTRIBUTE",
  },
  {
    label: "Custom ID",
    value: "CUSTOM_ID",
  },
]

const NftFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const type = useWatch({ name: `requirements.${index}.type` })
  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const nftRequirementType = useWatch({
    name: `requirements.${index}.nftRequirementType`,
  })

  const {
    fields: traitFields,
    append: appendTrait,
    remove: removeTrait,
  } = useFieldArray({
    name: `requirements.${index}.data.traitTypes`,
  })

  const { nftType, isLoading: isNftTypeLoading } = useNftType(address, chain)

  useEffect(() => {
    if (isNftTypeLoading) return

    if (nftType === "ERC1155" && type !== "ERC1155")
      setValue(`requirements.${index}.type`, "ERC1155")
    if (nftType === "SIMPLE" && type === "ERC1155")
      setValue(`requirements.${index}.type`, "ERC721")
    if (nftType === "NOUNS" && type !== "NOUNS")
      setValue(`requirements.${index}.type`, "NOUNS")
  }, [nftType, isNftTypeLoading])

  const [addressInput, setAddressInput] = useState("")
  const { nfts, isLoading } = useNfts(chain)
  const mappedNfts = useMemo(
    () =>
      nfts?.map((nft) => ({
        img: nft.logoUri,
        label: nft.name,
        value: nft.address,
        slug: nft.slug,
      })),
    [nfts]
  )

  const {
    isValidating: isNftNameSymbolLoading,
    data: { name: nftName, symbol: nftSymbol },
  } = useTokenData(chain, address)

  const nftImage = useMemo(
    () => mappedNfts?.find((nft) => nft.value === address)?.img,
    [address, mappedNfts]
  )

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const { isLoading: isMetadataLoading, metadata } = useNftMetadata(
    address,
    pickedNftSlug
  )

  const nftCustomAttributeNames = useMemo(
    () =>
      Object.keys(metadata || {})
        ?.filter((attributeName) => attributeName !== "error")
        .map((attributeName) => ({
          label: capitalize(attributeName) || "Any attribute",
          value: attributeName,
        })),
    [metadata]
  )

  const mappedNftRequirementTypeOptions =
    Object.keys(metadata || {})?.length ||
    chain === "ETHEREUM" ||
    chain === "POLYGON"
      ? nftRequirementTypeOptions
      : nftRequirementTypeOptions.filter((option) => option.value !== "ATTRIBUTE")

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
    setValue(`requirements.${index}.data.traitTypes`, [])
    setValue(`requirements.${index}.data.id`, null)
    setValue(`requirements.${index}.data.minAmount`, undefined)
    setValue(`requirements.${index}.data.maxAmount`, undefined)
    setValue(`requirements.${index}.nftRequirementType`, null)
    clearErrors([
      `requirements.${index}.address`,
      `requirements.${index}.data.traitTypes`,
      `requirements.${index}.data.id`,
      `requirements.${index}.data.minAmount`,
      `requirements.${index}.data.maxAmount`,
      `requirements.${index}.nftRequirementType`,
    ])
  }

  // Reset key, value, interval, amount fields on nftRequirementType change
  const resetDetails = () => {
    setValue(`requirements.${index}.data.traitTypes`, [])
    setValue(`requirements.${index}.data.id`, null)
    setValue(`requirements.${index}.data.minAmount`, undefined)
    setValue(`requirements.${index}.data.maxAmount`, undefined)
    clearErrors([
      `requirements.${index}.data.traitTypes`,
      `requirements.${index}.data.id`,
      `requirements.${index}.data.minAmount`,
      `requirements.${index}.data.maxAmount`,
    ])
  }

  const customFilterOption = (candidate, input) =>
    candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
    candidate.value.toLowerCase() === input?.toLowerCase()

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        onChange={resetForm}
      />

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.address}>
        <FormLabel>NFT:</FormLabel>
        <InputGroup>
          {address &&
            (nftImage ? (
              <InputLeftElement>
                <OptionImage img={nftImage} alt={nftName} />
              </InputLeftElement>
            ) : (
              <InputLeftAddon px={2} maxW={14}>
                {isNftNameSymbolLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Text as="span" fontSize="xs" fontWeight="bold" noOfLines={1}>
                    {nftSymbol}
                  </Text>
                )}
              </InputLeftAddon>
            ))}
          <Controller
            name={`requirements.${index}.address` as const}
            control={control}
            rules={{
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
              },
            }}
            render={({
              field: { onChange, onBlur, value: addressSelectValue, ref },
            }) => (
              <StyledSelect
                ref={ref}
                isClearable
                isLoading={isLoading}
                placeholder={
                  chain === "ETHEREUM"
                    ? "Search or paste address"
                    : "Paste NFT address"
                }
                options={mappedNfts ?? []}
                filterOption={customFilterOption}
                value={
                  (chain === "ETHEREUM" && addressSelectValue
                    ? mappedNfts?.find((nft) => nft.value === addressSelectValue)
                    : null) ||
                  (addressSelectValue
                    ? {
                        label: nftName && nftName !== "-" ? nftName : address,
                        value: addressSelectValue,
                      }
                    : null)
                }
                onChange={(selectedOption: SelectOption) => {
                  onChange(selectedOption?.value)
                  setPickedNftSlug(selectedOption?.slug)
                  setValue(`requirements.${index}.type`, "ERC721")
                  setValue(`requirements.${index}.data.traitTypes`, [])
                  setValue(`requirements.${index}.data.minAmount`, undefined)
                  setValue(`requirements.${index}.data.maxAmount`, undefined)
                  setValue(`requirements.${index}.nftRequirementType`, null)
                }}
                onBlur={onBlur}
                onInputChange={(text, _) => {
                  if (ADDRESS_REGEX.test(text)) {
                    onChange(text)
                    setPickedNftSlug(null)
                  } else setAddressInput(text)
                }}
                menuIsOpen={
                  chain === "ETHEREUM" ? undefined : ADDRESS_REGEX.test(addressInput)
                }
                // Hiding the dropdown arrow in some cases
                components={
                  chain !== "ETHEREUM" && {
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }
                }
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!errors?.requirements?.[index]?.nftRequirementType}
      >
        <FormLabel>Requirement type:</FormLabel>
        <Controller
          name={`requirements.${index}.nftRequirementType` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({
            field: { onChange, onBlur, value: nftRequirementTypeValue, ref },
          }) => (
            <StyledSelect
              ref={ref}
              isLoading={isMetadataLoading}
              isDisabled={!address || isMetadataLoading}
              options={mappedNftRequirementTypeOptions}
              value={
                nftRequirementTypeValue
                  ? mappedNftRequirementTypeOptions.find(
                      (option) => option.value === nftRequirementTypeValue
                    )
                  : null
              }
              onChange={(selectedOption: SelectOption) => {
                resetDetails()
                onChange(selectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.nftRequirementType?.message}
        </FormErrorMessage>
      </FormControl>

      {nftRequirementType === "ATTRIBUTE" && (
        <Stack spacing={0} w="full">
          <FormLabel>Metadata:</FormLabel>

          {isMetadataLoading ? (
            <Flex w="full" pt={4} justifyContent="center">
              <Spinner />
            </Flex>
          ) : (
            <Stack spacing={4}>
              {traitFields?.map((traitField, traitFieldIndex) => (
                <AttributePicker
                  key={traitField.id}
                  parentFieldIndex={index}
                  index={traitFieldIndex}
                  isMetadataLoading={isMetadataLoading}
                  metadata={metadata}
                  nftCustomAttributeNames={nftCustomAttributeNames}
                  onRemove={removeTrait}
                />
              ))}

              <Button
                leftIcon={<Icon as={Plus} />}
                onClick={() =>
                  appendTrait({
                    trait_type: null,
                    value: null,
                  })
                }
              >
                Define attribute
              </Button>
            </Stack>
          )}
        </Stack>
      )}

      {nftRequirementType === "AMOUNT" && (
        <MinMaxAmount field={field} index={index} />
      )}

      {nftType === "ERC1155" && nftRequirementType === "AMOUNT" && (
        <>
          <Divider />
          <Accordion w="full" allowToggle>
            <AccordionItem border="none">
              <AccordionButton px={0} _hover={{ bgColor: null }}>
                <Box mr="2" textAlign="left" fontWeight="medium" fontSize="md">
                  Advanced
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={0} overflow="hidden">
                <FormControl isInvalid={!!errors?.requirements?.[index]?.data?.id}>
                  <FormLabel>ID:</FormLabel>
                  <Input
                    {...register(`requirements.${index}.data.id` as const, {
                      required:
                        getValues(`requirements.${index}.nftRequirementType`) ===
                        "CUSTOM_ID",
                      validate: (value) =>
                        value &&
                        nftType === "ERC1155" &&
                        getValues(`requirements.${index}.nftRequirementType`) ===
                          "AMOUNT"
                          ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                          : undefined,
                    })}
                    defaultValue={field.data?.id}
                    placeholder="Any index"
                  />
                  <FormErrorMessage>
                    {errors?.requirements?.[index]?.data?.id?.message}
                  </FormErrorMessage>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      )}

      {nftRequirementType === "CUSTOM_ID" && (
        <FormControl
          isRequired
          isInvalid={!!errors?.requirements?.[index]?.data?.id}
        >
          <FormLabel>Custom ID:</FormLabel>
          <Input
            {...register(`requirements.${index}.data.id` as const, {
              required:
                getValues(`requirements.${index}.nftRequirementType`) === "CUSTOM_ID"
                  ? "This field is required."
                  : undefined,
              validate: (value) =>
                getValues(`requirements.${index}.nftRequirementType`) === "CUSTOM_ID"
                  ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                  : undefined,
            })}
            defaultValue={field.data?.id}
          />
          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.id?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </>
  )
}

export default NftFormCard
