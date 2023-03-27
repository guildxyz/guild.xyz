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
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import useBlockNumberByTimeStamp from "../hooks/useBlockNumberByTimestamp"

const AlchemyFirstTx = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
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

  const { data, error } = useBlockNumberByTimeStamp(chain, unixTimestamp)

  useEffect(() => {
    register(`${baseFieldPath}.data.minAmount`, {
      required: "This field is required.",
    })
  }, [])

  useEffect(() => {
    if (!error) {
      clearErrors(`${baseFieldPath}.data.minAmount`)
      return
    }
    setError(`${baseFieldPath}.data.minAmount`, {
      message: error,
    })
  }, [error])

  useEffect(() => {
    setValue(`${baseFieldPath}.data.minAmount`, unixTimestamp)
    if (unixTimestamp) trigger(`${baseFieldPath}.data.minAmount`)
  }, [unixTimestamp])

  return (
    <>
      <FormControl
        isRequired
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.minAmount}
      >
        <FormLabel>Wallet creation date</FormLabel>

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
          {parseFromObject(errors, baseFieldPath)?.data?.minAmount?.message ?? error}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default AlchemyFirstTx
