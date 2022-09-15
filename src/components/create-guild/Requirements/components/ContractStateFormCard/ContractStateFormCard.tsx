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
import { useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement } from "types"
import ChainPicker from "../ChainPicker"
import useAbi from "./hooks/useAbi"

type Props = {
  index: number
  field: Requirement
}

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const getParamTypes = (params) => {
  const a = params.map((param) => param.type)
  // console.log(a)
  const b = a.join(",")
  // console.log(b)
  return b
}

const resultMatchOptions = [
  {
    label: "=",
    value: "=",
  },
  {
    label: "<",
    value: "<",
  },
  {
    label: ">",
    value: ">",
  },
]

const ContractStateRequirementCard = ({ index, field }: Props) => {
  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.address` })
  const [methodIndex, setMethodIndex] = useState<number>()

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
    clearErrors([`requirements.${index}.address`])
  }

  const {
    data: abi,
    error,
    isValidating: isAbiValidating,
  } = useAbi(chain, ADDRESS_REGEX.test(address) && address)

  const methodOptions = abi?.map(({ name, inputs, outputs }, i) => {
    const a = `${name}(${getParamTypes(inputs)})(${getParamTypes(outputs)})`
    return {
      label: a,
      value: a,
      index: i,
    }
  })

  const outputOptions = abi?.[methodIndex]?.outputs?.map((param, index) => ({
    label: param.name ? `${param.name} (${param.type})` : param.type,
    value: index,
  }))

  // console.log(abi, methodIndex, abi?.[methodIndex])

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
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
          defaultValue={field.address}
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
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {error?.message ?? errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Method:</FormLabel>

        <Controller
          name={`requirements.${index}.data.id` as const}
          control={control}
          defaultValue={field.data?.id}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isLoading={isAbiValidating}
              options={methodOptions}
              placeholder="Choose method"
              value={value}
              onChange={(...selectedOption) => {
                onChange(...selectedOption)
                setMethodIndex(selectedOption[0]?.index)
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id}
        </FormErrorMessage>
      </FormControl>
      {abi?.[methodIndex]?.inputs?.map((input, index) => (
        <FormControl
          key={input.name}
          isRequired
          isInvalid={error || errors?.requirements?.[index]?.data?.params?.[index]}
        >
          <HStack mb="2" spacing="0">
            <FormLabel mb="0">{`${index}. param: ${input.name}`}</FormLabel>
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
            name={`requirements.${index}.data.params.${index}` as const}
            control={control}
            defaultValue={
              field.data?.params?.[index] ?? input.type === "address"
                ? "USER_ADDRESS"
                : undefined
            }
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                placeholder={`${input.type}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <FormErrorMessage>
            {errors?.requirements?.[index]?.data?.params?.[index]}
          </FormErrorMessage>
        </FormControl>
      ))}
      <Divider />
      <FormControl isRequired>
        <FormLabel>Expected output:</FormLabel>

        {outputOptions?.length > 1 && (
          <Controller
            name={`requirements.${index}.data.resultIndex` as const}
            control={control}
            defaultValue={field.data?.resultIndex ?? 0}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isLoading={isAbiValidating}
                options={outputOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                chakraStyles={{ container: { mb: 2 } }}
              />
            )}
          />
        )}

        <HStack>
          <Controller
            name={`requirements.${index}.data.resultMatch` as const}
            control={control}
            defaultValue={field.data?.resultMatch ?? "="}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                options={resultMatchOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                chakraStyles={{ container: { w: "105px" } }}
              />
            )}
          />
          <Controller
            name={`requirements.${index}.data.expected` as const}
            control={control}
            defaultValue={field.data?.expected}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                placeholder={`Expected value`}
                value={value}
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

export default ContractStateRequirementCard
