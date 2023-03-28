import {
  FormControl,
  FormHelperText,
  FormLabel,
  Skeleton,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { TimestampInput } from "components/common/TimestampInput"
import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import parseFromObject from "utils/parseFromObject"
import useBlockNumberByTimestamp from "../hooks/useBlockNumberByTimestamp"

type Props = {
  baseFieldPath: string
  dataFieldName: string
  label: string
}

const AbsoluteBlockNumberFormControl = ({
  baseFieldPath,
  dataFieldName,
  label,
}: Props): JSX.Element => {
  const [timestamp, setTimestamp] = useState<number>()
  const unixTimestamp =
    typeof timestamp === "number" && !isNaN(timestamp)
      ? Math.floor(timestamp / 1000)
      : undefined

  const {
    register,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext()

  const chain = useWatch({ name: `${baseFieldPath}.chain` })

  const { data, error } = useBlockNumberByTimestamp(chain, unixTimestamp)

  useEffect(() => {
    register(`${baseFieldPath}.data.${dataFieldName}`, {
      required: "This field is required.",
    })
  }, [])

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
    setValue(`${baseFieldPath}.data.${dataFieldName}`, unixTimestamp)
    if (unixTimestamp) trigger(`${baseFieldPath}.data.${dataFieldName}`)
  }, [unixTimestamp])

  return (
    <FormControl
      isRequired
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.[dataFieldName]}
    >
      <FormLabel>{label}</FormLabel>

      <TimestampInput onChange={(v) => setTimestamp(v)} />

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

export default AbsoluteBlockNumberFormControl
