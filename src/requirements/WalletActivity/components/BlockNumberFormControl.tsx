import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Skeleton,
  Spinner,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledRelativeTimeInput } from "components/common/RelativeTimeInput"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import { useBlockNumber } from "wagmi"
import { COVALENT_CHAINS } from "../WalletActivityForm"
import useBlockNumberByTimestamp from "../hooks/useBlockNumberByTimestamp"

type Props = {
  type?: "ABSOLUTE" | "RELATIVE"
  baseFieldPath: string
  dataFieldName: string
  label: string
  isRequired?: boolean
  formHelperText?: string
}

const currentDate = Date.now()

const BlockNumberFormControl = ({
  type = "ABSOLUTE",
  baseFieldPath,
  dataFieldName,
  label,
  isRequired,
  formHelperText,
}: Props): JSX.Element => {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext()

  const timestamp = useWatch({
    name: `${baseFieldPath}.data.timestamps.${dataFieldName}`,
  })
  const debouncedTimestamp = useDebouncedState(timestamp)
  const unixTimestamp =
    typeof debouncedTimestamp === "number" && !isNaN(debouncedTimestamp)
      ? type === "ABSOLUTE"
        ? Math.floor(debouncedTimestamp / 1000)
        : Math.floor((currentDate - debouncedTimestamp) / 1000)
      : undefined

  const requirementType = useWatch({ name: `${baseFieldPath}.type` })
  const chain = useWatch({ name: `${baseFieldPath}.chain` })
  const shouldFetchBlockNumber =
    [
      "ALCHEMY_FIRST_TX",
      "ALCHEMY_FIRST_TX_RELATIVE",
      "ALCHEMY_CONTRACT_DEPLOY",
      "ALCHEMY_CONTRACT_DEPLOY_RELATIVE",
      "ALCHEMY_TX_COUNT",
      "ALCHEMY_TX_COUNT_RELATIVE",
      "ALCHEMY_TX_VALUE",
      "ALCHEMY_TX_VALUE_RELATIVE",
    ].includes(requirementType) && !COVALENT_CHAINS.has(chain)

  useEffect(() => {
    register(`${baseFieldPath}.data.${dataFieldName}`, {
      required:
        !!isRequired && !!shouldFetchBlockNumber && "This field is required.",
    })
  }, [])

  const { data: currentBlock, isLoading } = useBlockNumber({
    enabled: shouldFetchBlockNumber,
  })
  const isBlockNumberLoading = shouldFetchBlockNumber && (!currentBlock || isLoading)

  const { data, error } = useBlockNumberByTimestamp(
    shouldFetchBlockNumber ? chain : null,
    unixTimestamp
  )

  useEffect(() => {
    if (!error) {
      clearErrors(`${baseFieldPath}.data.${dataFieldName}`)
      return
    }
    setError(`${baseFieldPath}.data.${dataFieldName}`, {
      message: error.message ?? "An unknown error occurred",
    })
  }, [error])

  useEffect(() => {
    const newValue =
      typeof data === "number" &&
      typeof currentBlock === "number" &&
      type === "RELATIVE"
        ? currentBlock - data
        : data
    setValue(`${baseFieldPath}.data.${dataFieldName}`, newValue)
    if (data) trigger(`${baseFieldPath}.data.${dataFieldName}`)
  }, [data])

  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.[dataFieldName]}
      isDisabled={isBlockNumberLoading}
    >
      <FormLabel>{label}</FormLabel>

      {type === "ABSOLUTE" ? (
        <ControlledTimestampInput
          fieldName={`${baseFieldPath}.data.timestamps.${dataFieldName}`}
        />
      ) : (
        <ControlledRelativeTimeInput
          fieldName={`${baseFieldPath}.data.timestamps.${dataFieldName}`}
        />
      )}

      {shouldFetchBlockNumber &&
        (isBlockNumberLoading ? (
          <FormHelperText>
            <HStack>
              <Spinner size="xs" />
              <Text as="span">Fetching current block number</Text>
            </HStack>
          </FormHelperText>
        ) : unixTimestamp ? (
          <FormHelperText>
            <Text as="span">Block: </Text>
            <Skeleton display="inline" isLoaded={!!data}>
              {data ?? "loading"}
            </Skeleton>
          </FormHelperText>
        ) : formHelperText ? (
          <FormHelperText>{formHelperText}</FormHelperText>
        ) : null)}

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.[dataFieldName]?.message ??
          error}
      </FormErrorMessage>
    </FormControl>
  )
}

export default BlockNumberFormControl
