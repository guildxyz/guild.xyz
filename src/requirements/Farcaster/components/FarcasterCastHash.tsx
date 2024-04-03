import { FormControl, FormLabel, HStack, Input, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { useState } from "react"
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
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const hash = useWatch({ name: `${baseFieldPath}.data.hash` })
  const url = useWatch({ name: `${baseFieldPath}.data.url` })
  const debouncedHash = useDebouncedState(hash)
  const debouncedUrl = useDebouncedState(url)

  const { data, isLoading, error } = useFarcasterCast(debouncedHash, debouncedUrl)

  const [showUrlInput, setShowUrlInput] = useState(hash?.length > 0 ? false : true)

  const toggleUrlOrHash = () => {
    setShowUrlInput((prev) => !prev)
    setValue(`${baseFieldPath}.data.hash`, undefined)
    setValue(`${baseFieldPath}.data.url`, undefined)
    clearErrors([`${baseFieldPath}.data.hash`, `${baseFieldPath}.data.url`])
  }

  return (
    <>
      <FormControl
        isRequired
        isInvalid={
          !!parseFromObject(errors, baseFieldPath)?.data?.[!!url ? "url" : "hash"]
        }
      >
        <HStack justifyContent="space-between">
          <FormLabel>{showUrlInput ? "Cast URL:" : "Cast hash:"}</FormLabel>

          <Button
            size="xs"
            variant="ghost"
            borderRadius="lg"
            onClick={toggleUrlOrHash}
          >
            <Text colorScheme={"gray"}>
              {showUrlInput ? "Paste hash" : "Paste URL"}
            </Text>
          </Button>
        </HStack>

        {showUrlInput ? (
          <Input
            {...register(`${baseFieldPath}.data.url`, {
              required: !hash ? "This field is required." : false,
              pattern: {
                value: /^https:\/\/(.)+\.(.)+$/,
                message: "Invalid URL",
              },
              shouldUnregister: true,
            })}
          />
        ) : (
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
            placeholder={!!url ? url.split("/").at(-1) : ""}
          />
        )}

        <FormErrorMessage>
          {
            parseFromObject(errors, baseFieldPath)?.data?.[!!url ? "url" : "hash"]
              ?.message
          }
        </FormErrorMessage>
      </FormControl>

      {(!!data || !!isLoading || !!error) && (
        <FarcasterCast cast={data} loading={isLoading} error={!!error} />
      )}
    </>
  )
}
export default FarcasterCastHash
