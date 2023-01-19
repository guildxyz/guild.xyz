import {
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Info } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import useAbi from "./hooks/useAbi"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const getParamTypes = (params) => params.map((param) => param.type).join(",")

const ContractStateForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })
  const method = useWatch({ name: `${baseFieldPath}.data.id` })
  const resultIndex = useWatch({ name: `${baseFieldPath}.data.resultIndex` })

  // Reset form on chain change
  const resetForm = () => {
    setValue(`${baseFieldPath}.address`, "")
    setValue(`${baseFieldPath}.data.id`, "")
    setValue(`${baseFieldPath}.data.resultIndex`, "")
    setValue(`${baseFieldPath}.data.expected`, "")
    clearErrors([`${baseFieldPath}.address`])
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
        setValue(`${baseFieldPath}.data.id`, null)),
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
    if (!touchedFields.data?.resultIndex) return
    setValue(`${baseFieldPath}.data.resultIndex`, 0)
  }, [outputOptions])

  const outputType = outputOptions?.[resultIndex ?? 0]?.type

  const resultMatchOptions = useMemo(() => {
    const isDisabled = ["string", "bool", "address"].includes(outputType)
    if (isDisabled) setValue(`${baseFieldPath}.data.resultMatch`, "=")

    return [
      { label: "=", value: "=" },
      { label: "<", value: "<", isDisabled },
      { label: ">", value: ">", isDisabled },
      { label: "<=", value: "<=", isDisabled },
      { label: ">=", value: ">=", isDisabled },
    ]
  }, [outputType])

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
        supportedChains={[
          "ETHEREUM",
          "POLYGON",
          "AVALANCHE",
          "GNOSIS",
          "FANTOM",
          "ARBITRUM",
          "NOVA",
          "CELO",
          "BSC",
          "OPTIMISM",
          "MOONRIVER",
          "MOONBEAM",
          "METIS",
          "CRONOS",
          "BOBA",
          "BOBA_AVAX",
          "PALM",
          "GOERLI",
        ]}
        onChange={resetForm}
      />

      <FormControl
        isRequired
        isInvalid={error || parseFromObject(errors, baseFieldPath)?.address}
      >
        <FormLabel>Contract address:</FormLabel>

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
          {error?.message ??
            parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired isDisabled={!abi}>
        <FormLabel>Method:</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.data.id` as const}
          rules={{ required: "This field is required." }}
          isClearable
          isLoading={isAbiValidating}
          options={methodOptions}
          placeholder="Choose method"
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id}
        </FormErrorMessage>
      </FormControl>
      {methodData?.inputs?.map((input, i) => (
        <FormControl
          key={`${input.name}${i}`}
          isRequired
          isInvalid={
            error || parseFromObject(errors, baseFieldPath)?.data?.params?.[i]
          }
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
            name={`${baseFieldPath}.data.params.${i}` as const}
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
            {parseFromObject(errors, baseFieldPath)?.data?.params?.[i]}
          </FormErrorMessage>
        </FormControl>
      ))}

      <Divider />

      <FormControl isRequired isDisabled={!method}>
        <FormLabel>Expected output:</FormLabel>

        {outputOptions?.length > 1 && (
          <ControlledSelect
            name={`${baseFieldPath}.data.resultIndex` as const}
            defaultValue={0}
            rules={{ required: "This field is required." }}
            isLoading={isAbiValidating}
            options={outputOptions}
            placeholder="Choose output param"
            chakraStyles={{ container: { mb: 2 } } as any}
          />
        )}

        <HStack>
          <ControlledSelect
            name={`${baseFieldPath}.data.resultMatch` as const}
            defaultValue={"="}
            options={resultMatchOptions}
            chakraStyles={{ container: { w: "105px" } } as any}
          />
          <Controller
            name={`${baseFieldPath}.data.expected` as const}
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
          {parseFromObject(errors, baseFieldPath)?.data?.expected}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

export default ContractStateForm
