import {
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  TextProps,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import ControlledSelect from "components/common/ControlledSelect"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import FormErrorMessage from "components/common/FormErrorMessage"
import { Info, Plus, X } from "phosphor-react"
import { useEffect, useMemo } from "react"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import ChainPicker from "../common/ChainPicker"
import useAbi from "./hooks/useAbi"

const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i

const getParamTypes = (params) => params.map((param) => param.type).join(",")

const ContractStateForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const address = useWatch({ name: `${baseFieldPath}.address` })
  const method = useWatch({ name: `${baseFieldPath}.data.id` })
  const resultIndex = useWatch({ name: `${baseFieldPath}.data.resultIndex` })
  const resultMatch = useWatch({ name: `${baseFieldPath}.data.resultMatch` })
  const expectedValue = useWatch({ name: `${baseFieldPath}.data.expected` })

  const resetFormWithoutAddress = () => {
    setValue(`${baseFieldPath}.data.id`, "")
    setValue(`${baseFieldPath}.data.resultIndex`, undefined)
    setValue(`${baseFieldPath}.data.expected`, "")
    setValue(`${baseFieldPath}.data.params`, [])
  }

  const resetForm = () => {
    setValue(`${baseFieldPath}.address`, "")
    resetFormWithoutAddress()

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
    () => abi && method && abi.find((m) => m.name === method.split("(")[0]),
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
  }, [touchedFields.data?.resultIndex, setValue, baseFieldPath, outputOptions])

  const outputType = outputOptions?.[resultIndex ?? 0]?.type

  const resultMatchOptions = useMemo(() => {
    const isDisabled = ["string", "bool", "address"].includes(outputType)
    if (isDisabled) setValue(`${baseFieldPath}.data.resultMatch`, "=")

    return [
      { label: "=", value: "=", text: "equal to" },
      { label: "<", value: "<", text: "less than", isDisabled },
      { label: ">", value: ">", text: "greater than", isDisabled },
      { label: "<=", value: "<=", text: "less than or equal to", isDisabled },
      { label: ">=", value: ">=", text: "greater than or equal to", isDisabled },
    ]
  }, [setValue, baseFieldPath, outputType])

  const shouldRenderSimpleInputs = Array.isArray(abi) && !abi.length
  const {
    fields: paramsFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    name: `${baseFieldPath}.data.params`,
  })

  return (
    <Stack spacing={4} alignItems="start">
      <ChainPicker
        controlName={`${baseFieldPath}.chain` as const}
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
              onChange={(e) => {
                onChange(e)
                resetFormWithoutAddress()
              }}
              onBlur={onBlur}
            />
          )}
        />

        <FormErrorMessage>
          {error?.message ??
            parseFromObject(errors, baseFieldPath)?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Method:</FormLabel>

        {shouldRenderSimpleInputs ? (
          <>
            <Input {...register(`${baseFieldPath}.data.id`)} />
            <FormHelperText>Example: balanceOf(address)(uint256)</FormHelperText>
          </>
        ) : (
          <ControlledSelect
            name={`${baseFieldPath}.data.id`}
            rules={{ required: "This field is required." }}
            isClearable
            isLoading={isAbiValidating}
            options={methodOptions}
            placeholder="Choose method"
          />
        )}

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id}
        </FormErrorMessage>
      </FormControl>

      {shouldRenderSimpleInputs ? (
        <>
          <Stack spacing={1}>
            <Text fontWeight="medium">Params:</Text>
            <UserAddressHelperText fontSize="sm" colorScheme="gray" />
          </Stack>

          {paramsFields.map((field, i) => (
            <FormControl key={field.id}>
              <FormLabel>{`${i + 1}. param:`}</FormLabel>
              <InputGroup>
                <Input {...register(`${baseFieldPath}.data.params.${i}.value`)} />
                <InputRightElement>
                  <IconButton
                    aria-label="Remove parameter"
                    icon={<X />}
                    size="xs"
                    variant="ghost"
                    rounded="full"
                    onClick={() => removeParam(i)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          ))}

          <Button
            w="full"
            leftIcon={<Plus />}
            onClick={() => appendParam({ value: "" })}
          >
            Add parameter
          </Button>
        </>
      ) : (
        <>
          {methodData?.inputs?.map((input, i) => (
            <FormControl
              key={`${input.name}${i}`}
              isRequired
              isInvalid={
                error || !!parseFromObject(errors, baseFieldPath)?.data?.params?.[i]
              }
            >
              <HStack mb="2" spacing="0">
                <FormLabel mb="0">{`${i + 1}. input param: ${
                  input.name
                }`}</FormLabel>
                {input.type === "address" && (
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Info />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <UserAddressHelperText />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </HStack>

              <Controller
                name={`${baseFieldPath}.data.params.${i}.value` as const}
                control={control}
                shouldUnregister
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
                {parseFromObject(errors, baseFieldPath)?.data?.params?.[i]?.message}
              </FormErrorMessage>
            </FormControl>
          ))}
        </>
      )}

      <Divider />

      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.resultIndex}
        isDisabled={!method}
      >
        <FormLabel>Expected output:</FormLabel>

        {shouldRenderSimpleInputs ? (
          <Controller
            name={`${baseFieldPath}.data.resultIndex`}
            control={control}
            defaultValue={0}
            rules={{
              required: "This field is required.",
              min: {
                value: 0,
                message: "Must be positive",
              },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <InputGroup>
                <InputLeftAddon>Output param index</InputLeftAddon>
                <NumberInput
                  ref={ref}
                  value={value}
                  defaultValue={0}
                  onChange={(_, valueAsNumber) =>
                    onChange(!isNaN(valueAsNumber) ? valueAsNumber : "")
                  }
                  onBlur={onBlur}
                  min={0}
                >
                  <NumberInputField borderLeftRadius={0} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            )}
          />
        ) : (
          outputOptions?.length > 1 && (
            <ControlledSelect
              name={`${baseFieldPath}.data.resultIndex`}
              defaultValue={0}
              rules={{ required: "This field is required." }}
              isLoading={isAbiValidating}
              options={outputOptions}
              placeholder="Choose output param"
              chakraStyles={{ container: (base) => ({ ...base, mb: 2 }) }}
            />
          )
        )}

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.resultIndex?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isDisabled={!method}
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.expected}
        mt="-4"
      >
        <HStack>
          <ControlledSelect
            name={`${baseFieldPath}.data.resultMatch`}
            defaultValue={"="}
            options={resultMatchOptions}
            chakraStyles={{ container: (base) => ({ ...base, w: "105px" }) }}
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
        {resultMatch && (
          <FormHelperText>
            {`Satisfied when the method result for the user is ${
              resultMatchOptions.find((option) => option.value === resultMatch).text
            } ${expectedValue || "the provided value"}`}
          </FormHelperText>
        )}

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.expected?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}

const UserAddressHelperText = (props: TextProps) => (
  <Text display="inline" {...props}>
    <DataBlockWithCopy text="USER_ADDRESS">USER_ADDRESS</DataBlockWithCopy>
    <Text as="span" ml={1}>
      autofills the actual user's address when checking access
    </Text>
  </Text>
)

export default ContractStateForm
