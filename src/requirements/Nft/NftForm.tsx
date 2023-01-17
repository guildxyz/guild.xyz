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
import { RequirementFormProps } from "requirements"
import { SelectOption } from "types"
import capitalize from "utils/capitalize"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import MinMaxAmount from "../common/MinMaxAmount"
import AttributePicker from "./components/AttributePicker"
import useNftMetadata from "./hooks/useNftMetadata"
import useNfts from "./hooks/useNfts"
import useNftType from "./hooks/useNftType"

type NftRequirementTypeOption = {
  label: string
  value: "AMOUNT" | "ATTRIBUTE" | "CUSTOM_ID"
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

const NftForm = ({ baseFieldPath, field }: RequirementFormProps): JSX.Element => {
  const {
    control,
    register,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })
  const nftRequirementType = useWatch({
    name: `${baseFieldPath}.nftRequirementType`,
  })

  const {
    fields: traitFields,
    append: appendTrait,
    remove: removeTrait,
  } = useFieldArray({
    name: `${baseFieldPath}.data.attributes`,
  })

  const { nftType, isLoading: isNftTypeLoading } = useNftType(address, chain)

  useEffect(() => {
    if (isNftTypeLoading) return

    if (nftType === "ERC1155" && type !== "ERC1155")
      setValue(`${baseFieldPath}.type`, "ERC1155")
    if (nftType === "SIMPLE" && type === "ERC1155")
      setValue(`${baseFieldPath}.type`, "ERC721")
    if (nftType === "NOUNS" && type !== "NOUNS")
      setValue(`${baseFieldPath}.type`, "NOUNS")
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

  const nftImage = mappedNfts?.find((nft) => nft.value === address)?.img

  const [pickedNftSlug, setPickedNftSlug] = useState(null)
  const { isLoading: isMetadataLoading, metadata } = useNftMetadata(
    address,
    pickedNftSlug
  )

  const nftCustomAttributeNames = useMemo(
    () =>
      Object.keys(metadata?.traits || {})
        ?.filter((attributeName) => attributeName !== "error")
        .map((attributeName) => ({
          label: capitalize(attributeName) || "Any attribute",
          value: attributeName,
        })),
    [metadata]
  )

  const mappedNftRequirementTypeOptions =
    Object.keys(metadata?.traits || {})?.length ||
    chain === "ETHEREUM" ||
    chain === "POLYGON"
      ? nftRequirementTypeOptions
      : nftRequirementTypeOptions.filter((option) => option.value !== "ATTRIBUTE")

  // Reset form on chain change
  const resetForm = () => {
    if (!parseFromObject(touchedFields, baseFieldPath)?.address) return
    setValue(`${baseFieldPath}.address`, null)
    setValue(`${baseFieldPath}.data.attributes`, undefined)
    setValue(`${baseFieldPath}.data.id`, null)
    setValue(`${baseFieldPath}.data.minAmount`, undefined)
    setValue(`${baseFieldPath}.data.maxAmount`, undefined)
    setValue(`${baseFieldPath}.nftRequirementType`, null)
    clearErrors([
      `${baseFieldPath}.address`,
      `${baseFieldPath}.data.attributes`,
      `${baseFieldPath}.data.id`,
      `${baseFieldPath}.data.minAmount`,
      `${baseFieldPath}.data.maxAmount`,
      `${baseFieldPath}.nftRequirementType`,
    ])
  }

  // Reset key, value, interval, amount fields on nftRequirementType change
  const resetDetails = (newType?: NftRequirementTypeOption["value"]) => {
    setValue(
      `${baseFieldPath}.data.attributes`,
      newType === "ATTRIBUTE" ? [] : undefined
    )
    setValue(`${baseFieldPath}.data.id`, null)
    setValue(`${baseFieldPath}.data.minAmount`, undefined)
    setValue(`${baseFieldPath}.data.maxAmount`, undefined)
    clearErrors([
      `${baseFieldPath}.data.attributes`,
      `${baseFieldPath}.data.id`,
      `${baseFieldPath}.data.minAmount`,
      `${baseFieldPath}.data.maxAmount`,
    ])
  }

  const customFilterOption = (candidate, input) =>
    candidate.label.toLowerCase().includes(input?.toLowerCase()) ||
    candidate.value.toLowerCase() === input?.toLowerCase()

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.address}
      >
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
            name={`${baseFieldPath}.address` as const}
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
                  setValue(`${baseFieldPath}.type`, "ERC721")
                  setValue(`${baseFieldPath}.data.attributes`, undefined)
                  setValue(`${baseFieldPath}.data.minAmount`, undefined)
                  setValue(`${baseFieldPath}.data.maxAmount`, undefined)
                  setValue(`${baseFieldPath}.nftRequirementType`, null)
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
          {parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.nftRequirementType}
      >
        <FormLabel>Requirement type:</FormLabel>
        <Controller
          name={`${baseFieldPath}.nftRequirementType` as const}
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
                resetDetails(
                  selectedOption?.value as NftRequirementTypeOption["value"]
                )
                onChange(selectedOption?.value)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.nftRequirementType?.message}
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
            <Stack spacing={2}>
              {traitFields?.map((traitField, traitFieldIndex) => (
                <AttributePicker
                  key={traitField.id}
                  baseFieldPath={baseFieldPath}
                  index={traitFieldIndex}
                  isAttributesLoading={isMetadataLoading}
                  attributes={metadata?.traits}
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
        <MinMaxAmount field={field} baseFieldPath={baseFieldPath} />
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
                <FormControl
                  isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
                >
                  <FormLabel>ID:</FormLabel>
                  <Input
                    {...register(`${baseFieldPath}.data.id` as const, {
                      required:
                        getValues(`${baseFieldPath}.nftRequirementType`) ===
                        "CUSTOM_ID",
                      validate: (value) =>
                        value &&
                        nftType === "ERC1155" &&
                        getValues(`${baseFieldPath}.nftRequirementType`) === "AMOUNT"
                          ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                          : undefined,
                    })}
                    defaultValue={field?.data?.id}
                    placeholder="Any index"
                  />
                  <FormErrorMessage>
                    {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
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
          isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id}
        >
          <FormLabel>Custom ID:</FormLabel>
          <Input
            {...register(`${baseFieldPath}.data.id` as const, {
              required:
                getValues(`${baseFieldPath}.nftRequirementType`) === "CUSTOM_ID"
                  ? "This field is required."
                  : undefined,
              validate: (value) =>
                getValues(`${baseFieldPath}.nftRequirementType`) === "CUSTOM_ID"
                  ? /^[0-9]*$/i.test(value) || "ID can only contain numbers"
                  : undefined,
            })}
            defaultValue={field?.data?.id}
          />
          <FormErrorMessage>
            {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </Stack>
  )
}

export default NftForm
