import {
  FormControl,
  FormHelperText,
  FormLabel,
  Skeleton,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { ControlledRelativeTimeInput } from "components/common/RelativeTimeInput"
import { ControlledTimestampInput } from "components/common/TimestampInput"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import useBlockNumberByTimestamp from "../hooks/useBlockNumberByTimestamp"

type Props = {
  type?: "ABSOLUTE" | "RELATIVE"
  baseFieldPath: string
  dataFieldName: string
  label: string
  isRequired?: boolean
}

const BlockNumberFormControl = ({
  type = "ABSOLUTE",
  baseFieldPath,
  dataFieldName,
  label,
  isRequired,
}: Props): JSX.Element => {
  const {
    register,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    register(`${baseFieldPath}.data.${dataFieldName}`, {
      required: isRequired && "This field is required.",
    })
  }, [])

  const timestamp = useWatch({
    name: `${baseFieldPath}.data.timestamps.${dataFieldName}`,
  })
  const debouncedTimestamp = useDebouncedState(timestamp)
  const unixTimestamp =
    typeof debouncedTimestamp === "number" && !isNaN(debouncedTimestamp)
      ? type === "ABSOLUTE"
        ? Math.floor(debouncedTimestamp / 1000)
        : Math.floor((Date.now() - debouncedTimestamp) / 1000)
      : undefined

  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  const { data, error } = useBlockNumberByTimestamp(chain, unixTimestamp)

  useEffect(() => {
    if (!error) {
      clearErrors(`${baseFieldPath}.data.${dataFieldName}`)
      return
    }
    setError(`${baseFieldPath}.data.${dataFieldName}`, {
      message: error,
    })
  }, [error])

  useEffect(() => {
    setValue(`${baseFieldPath}.data.${dataFieldName}`, data)
    if (data) trigger(`${baseFieldPath}.data.${dataFieldName}`)
  }, [data])

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.[dataFieldName]}
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

      {unixTimestamp && (
        <FormHelperText>
          <Text as="span">Block: </Text>
          <Skeleton display="inline" isLoaded={!!data}>
            {data ?? "loading"}
          </Skeleton>
        </FormHelperText>
      )}

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.[dataFieldName]?.message ??
          error}
      </FormErrorMessage>
    </FormControl>
  )
}

export default BlockNumberFormControl
