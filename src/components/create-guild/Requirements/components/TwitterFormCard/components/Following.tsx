import {
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Spinner,
} from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import useTwitterAvatar from "hooks/useTwitterAvatar"
import Image from "next/image"
import { useController, useFormState } from "react-hook-form"

const TWITTER_LINK_CHECK_REGEX = /twitter\.com\/(.*)$/i
const PREFIXED_USERNAME_CHECK_REGEX = /^@(.*)$/i

const Following = ({ index }: { index: number }) => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `requirements.${index}.data.username`,
    rules: {
      required: "Please paste a link or enter a username",
    },
  })

  const debouncedUsername = useDebouncedState(field.value)

  const { url, isLoading } = useTwitterAvatar(debouncedUsername)

  return (
    <FormControl
      isInvalid={!!errors?.requirements?.[index]?.data?.username?.message}
    >
      <FormLabel>User to follow</FormLabel>

      <HStack>
        {isLoading ? (
          <Center width={"40px"} height={"40px"}>
            <Spinner size="sm" />
          </Center>
        ) : (
          <Center
            position={"relative"}
            width={"40px"}
            height={"40px"}
            border={"1px solid var(--chakra-colors-whiteAlpha-300)"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            <Image src={url} layout="fill" alt="Twitter avatar" />
          </Center>
        )}
        <Input
          {...field}
          onChange={({ target: { value } }) =>
            field.onChange(
              value.match(TWITTER_LINK_CHECK_REGEX)?.[1] ??
                value.match(PREFIXED_USERNAME_CHECK_REGEX)?.[1] ??
                value
            )
          }
          w="auto"
          flexGrow={1}
        />
      </HStack>
      <FormHelperText>Paste a link or enter a username</FormHelperText>
      <FormErrorMessage>
        {errors?.requirements?.[index]?.data?.username?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default Following
