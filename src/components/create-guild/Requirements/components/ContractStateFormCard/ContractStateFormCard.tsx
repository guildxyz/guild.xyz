import {
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Tooltip,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Info } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Requirement, SelectOption } from "types"
import ChainPicker from "../ChainPicker"
import useAbi from "./hooks/useAbi"

type Props = {
  index: number
  field: Requirement
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const getParamTypes = (params) => params.map((param) => param.type).join(",")

const ContractStateFormCard = ({ index }: Props) => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const method = useWatch({ name: `requirements.${index}.data.id` })
  const resultIndex = useWatch({ name: `requirements.${index}.data.resultIndex` })

  // Reset form on chain change
  const resetForm = () => {
    setValue(`requirements.${index}.address`, "")
    setValue(`requirements.${index}.data.id`, "")
    setValue(`requirements.${index}.data.resultIndex`, "")
    setValue(`requirements.${index}.data.expected`, "")
    clearErrors([`requirements.${index}.address`])
  }

  const {
    data: abi,
    error,
    isValidating: isAbiValidating,
  } = useAbi(chain, ADDRESS_REGEX.test(address) && address)

  const methodOptions = useMemo(
    () =>
      abi?.map(({ name, inputs, outputs }, i) => {
        const option = `${name}(${getParamTypes(inputs)})(${getParamTypes(outputs)})`
        return {
          label: option,
          value: option,
          index: i,
        }
      }),
    [abi]
  )

  const methodData = useMemo(
    () =>
      abi &&
      method &&
      (abi.find((m) => m.name === method.split("(")[0]) ||
        setValue(`requirements.${index}.data.id`, null)),
    [abi, method]
  )

  const outputOptions = useMemo(
    () =>
      methodData?.outputs?.map((param, i) => ({
        label: param.name ? `${param.name} (${param.type})` : param.type,
        type: param.type,
        value: i,
      })),
    [methodData]
  )

  useEffect(() => {
    setValue(`requirements.${index}.data.resultIndex`, 0)
  }, [outputOptions])

  const outputType = outputOptions?.[resultIndex ?? 0]?.type

  const resultMatchOptions = useMemo(() => {
    const isDisabled = ["string", "bool", "address"].includes(outputType)
    if (isDisabled) setValue(`requirements.${index}.data.resultMatch`, "=")

    return [
      { label: "=", value: "=" },
      { label: "<", value: "<", isDisabled },
      { label: ">", value: ">", isDisabled },
      { label: "<=", value: "<=", isDisabled },
      { label: ">=", value: ">=", isDisabled },
    ]
  }, [outputType])

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        supportedChains={[
          "ETHEREUM",
          "POLYGON",
          "AVALANCHE",
          "GNOSIS",
          "FANTOM",
          "ARBITRUM",
          "CELO",
          "BSC",
          "OPTIMISM",
          "MOONRIVER",
          "METIS",
          "CRONOS",
          "BOBA",
          "PALM",
          "RINKEBY",
          "GOERLI",
        ]}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={error || errors?.requirements?.[index]?.address}
      >
        <FormLabel>Contract address:</FormLabel>

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
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              ref={ref}
              placeholder="Paste address"
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {error?.message ?? errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired isDisabled={!abi}>
        <FormLabel>Method:</FormLabel>

        <Controller
          name={`requirements.${index}.data.id` as const}
          control={control}
          rules={{ required: "This field is required." }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isLoading={isAbiValidating}
              options={methodOptions}
              placeholder="Choose method"
              value={methodOptions?.find((option) => option.value === value) ?? ""}
              onChange={(selectedOption: SelectOption) => {
                onChange(selectedOption?.value)
                // setValue(`requirements.${index}.data.expected`, "")
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id}
        </FormErrorMessage>
      </FormControl>
      {methodData?.inputs?.map((input, i) => (
        <FormControl
          key={`${input.name}${i}`}
          isRequired
          isInvalid={error || errors?.requirements?.[index]?.data?.params?.[i]}
        >
          <HStack mb="2" spacing="0">
            <FormLabel mb="0">{`${i + 1}. input param: ${input.name}`}</FormLabel>
            {input.type === "address" && (
              <Tooltip
                label={
                  "'USER_ADDRESS' autofills the actual user's address when checking access"
                }
              >
                <Info />
              </Tooltip>
            )}
          </HStack>

          <Controller
            name={`requirements.${index}.data.params.${i}` as const}
            control={control}
            // rules={{ required: "This field is required." }}
            defaultValue={input.type === "address" ? "USER_ADDRESS" : ""}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                placeholder={`${input.type}`}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.params?.[i]}
          </FormErrorMessage>
        </FormControl>
      ))}

      <Divider />

      <FormControl isRequired isDisabled={!method}>
        <FormLabel>Expected output:</FormLabel>

        {outputOptions?.length > 1 && (
          <Controller
            name={`requirements.${index}.data.resultIndex` as const}
            defaultValue={0}
            control={control}
            rules={{ required: "This field is required." }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isLoading={isAbiValidating}
                options={outputOptions}
                value={outputOptions[value] ?? ""}
                onChange={(selectedOption: SelectOption) => {
                  onChange(selectedOption.value)
                }}
                onBlur={onBlur}
                chakraStyles={{ container: { mb: 2 } } as any}
                placeholder="Choose output param"
              />
            )}
          />
        )}

        <HStack>
          <Controller
            name={`requirements.${index}.data.resultMatch` as const}
            control={control}
            defaultValue={"="}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                options={resultMatchOptions}
                value={resultMatchOptions.find((option) => option.value === value)}
                onChange={(selectedOption: SelectOption) =>
                  onChange(selectedOption.value)
                }
                onBlur={onBlur}
                chakraStyles={{ container: { w: "105px" } } as any}
              />
            )}
          />
          <Controller
            name={`requirements.${index}.data.expected` as const}
            control={control}
            rules={{ required: "This field is required." }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                placeholder={outputType}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                flex="1"
              />
            )}
          />
        </HStack>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.expected}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default ContractStateFormCard
