import { Collapse, FormControl, FormLabel, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect } from "react"
import { useController, useForm } from "react-hook-form"
import { ADDRESS_REGEX } from "utils/guildCheckout/constants"
import useFarcasterCast from "../hooks/useFarcasterCast"
import FarcasterCast from "./FarcasterCast"

type Props = {
  baseFieldPath: string
}

const FarcasterCastHash = ({ baseFieldPath }: Props) => {
  const {
    field: { onChange: onHashChange, value: hash },
  } = useController({
    name: `${baseFieldPath}.data.hash`,
    rules: {
      required: true,
    },
  })

  /**
   * Handling the combined URL & hash input in a separate form, so we can easily
   * valide the input
   */
  const urlOrHashForm = useForm<{ urlOrHash: string }>({
    mode: "all",
  })

  const urlOrHashField = useController({
    control: urlOrHashForm.control,
    name: "urlOrHash",
    defaultValue: hash ?? "",
    rules: {
      required: "This field is required.",
      validate: (value) => {
        if (ADDRESS_REGEX.test(value) || value.startsWith("https://warpcast.com"))
          return true
        return "Please provide a valid Warpcast URL or hash"
      },
    },
  })

  const debouncedUrlOrHash = useDebouncedState(urlOrHashField.field.value)

  const { data, isLoading, error } = useFarcasterCast(debouncedUrlOrHash)

  useEffect(() => {
    if (hash === data?.hash) return
    onHashChange(data?.hash)
  }, [hash, onHashChange, data?.hash])

  return (
    <>
      <FormControl isRequired isInvalid={urlOrHashField.fieldState.invalid}>
        <FormLabel>Cast URL or hash:</FormLabel>

        <Input {...urlOrHashField.field} />

        <FormErrorMessage>
          {urlOrHashField.fieldState.error?.message}
        </FormErrorMessage>
      </FormControl>

      <Collapse in={data || isLoading || error} style={{ width: "100%" }}>
        <FarcasterCast cast={data} loading={isLoading} error={!!error} />
      </Collapse>
    </>
  )
}

export default FarcasterCastHash
