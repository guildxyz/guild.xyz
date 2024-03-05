import { Divider, FormControl, FormLabel, Input } from "@chakra-ui/react"
import LogicDivider from "components/[guild]/LogicDivider"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import parseFromObject from "utils/parseFromObject"
import useFarcasterCast from "../hooks/useFarcasterCast"
import FarcasterCast from "./FarcasterCast"

type Props = {
  baseFieldPath: string
}

const FarcasterCastHash = ({ baseFieldPath }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const hash = useWatch({ name: `${baseFieldPath}.data.hash` })
  const url = useWatch({ name: `${baseFieldPath}.data.url` })

  const { data, isLoading, error } = useFarcasterCast(hash, url)

  return (
    <>
      {(!!data || !!isLoading || !!error) && (
        <FarcasterCast cast={data} loading={isLoading} error={!!error} />
      )}
      <Divider mb={2} />
      <FormControl
        isRequired={!url}
        isInvalid={!url && parseFromObject(errors, baseFieldPath)?.data?.hash}
      >
        <FormLabel opacity={!!url ? 0.3 : 1}>Cast hash:</FormLabel>

        <Input
          {...register(`${baseFieldPath}.data.hash`, {
            required: !url ? "This field is required." : false,
            disabled: !!url,
            pattern: {
              value: ADDRESS_REGEX,
              message:
                "Please input a 42 characters long, 0x-prefixed hexadecimal hash.",
            },
          })}
        />

        <FormErrorMessage>
          {!url && parseFromObject(errors, baseFieldPath)?.data?.hash?.message}
        </FormErrorMessage>
      </FormControl>

      <LogicDivider logic="OR" />

      <FormControl
        isRequired={!hash}
        isInvalid={!hash && parseFromObject(errors, baseFieldPath)?.data?.url}
      >
        <FormLabel opacity={!!hash ? 0.3 : 1}>Cast URL:</FormLabel>

        <Input
          {...register(`${baseFieldPath}.data.url`, {
            required: !hash ? "This field is required." : false,
            disabled: !!hash,
            pattern: {
              value: /^https:\/\/(.)+\.(.)+$/,
              message: "Invalid URL",
            },
          })}
        />

        <FormErrorMessage>
          {!hash && parseFromObject(errors, baseFieldPath)?.data?.url?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}
export default FarcasterCastHash
