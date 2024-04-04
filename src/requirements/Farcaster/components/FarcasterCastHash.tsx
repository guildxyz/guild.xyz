import {
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useState } from "react"
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
  const debouncedHash = useDebouncedState(hash)

  const [url, setUrl] = useState("")
  const debouncedUrl = useDebouncedState(url)

  const {
    data: castByHash,
    isLoading: isCastByHashLoading,
    error: castByHashError,
  } = useFarcasterCast(debouncedHash)
  const {
    data: castByUrl,
    isLoading: isCastByUrlLoading,
    error: castByUrlError,
  } = useFarcasterCast(debouncedUrl)

  useEffect(() => {
    if (!castByUrl?.hash) return
    setValue(`${baseFieldPath}.data.hash`, castByUrl.hash)
  }, [baseFieldPath, castByUrl?.hash, setValue])

  const [showUrlInput, setShowUrlInput] = useState(hash?.length > 0 ? false : true)

  const toggleUrlOrHash = () => {
    setShowUrlInput((prev) => !prev)
    setValue(`${baseFieldPath}.data.hash`, "")
    clearErrors(`${baseFieldPath}.data.hash`)
  }

  return (
    <>
      <FormControl
        isRequired
        isInvalid={
          showUrlInput
            ? !!castByUrlError
            : !!parseFromObject(errors, baseFieldPath)?.data?.hash
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
          <InputGroup>
            <Input
              onChange={(e) => {
                const newValue = e.target.value
                if (!/^https:\/\/(.)+\.(.)+$/.test(newValue)) return
                setUrl(newValue)

                if (!newValue.includes(debouncedHash?.slice(0, 8)))
                  setValue(`${baseFieldPath}.data.hash`, "")
              }}
            />
            {isCastByUrlLoading && (
              <InputRightElement>
                <Spinner size="sm" />
              </InputRightElement>
            )}
          </InputGroup>
        ) : (
          <Input
            {...register(`${baseFieldPath}.data.hash`, {
              required: "This field is required.",
              pattern: {
                value: ADDRESS_REGEX,
                message:
                  "Please input a 42 characters long, 0x-prefixed hexadecimal hash.",
              },
            })}
          />
        )}

        <FormErrorMessage>
          {showUrlInput && castByUrlError
            ? "Couldn't fetch cast"
            : parseFromObject(errors, baseFieldPath)?.data?.hash?.message}
        </FormErrorMessage>
      </FormControl>

      <Collapse
        in={!!castByHash || !!isCastByHashLoading || !!castByHashError}
        style={{ width: "100%" }}
      >
        <FarcasterCast
          cast={castByHash}
          loading={isCastByHashLoading}
          error={!!castByHashError}
        />
      </Collapse>
    </>
  )
}
export default FarcasterCastHash
