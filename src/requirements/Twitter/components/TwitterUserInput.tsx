import {
  Circle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"

const TwitterUserInput = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required",
    },
  })

  const debouncedUsername = useDebouncedState(field.value)

  const [shouldFallbackToDefaultImage, setShouldFallbackToDefaultImage] =
    useState(false)

  useEffect(() => {
    setShouldFallbackToDefaultImage(false)
  }, [debouncedUsername])

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
    >
      <FormLabel>Username</FormLabel>

      <HStack>
        <InputGroup>
          <InputLeftElement>@</InputLeftElement>
          <Input {...field} pl="7" />
        </InputGroup>
        {debouncedUsername?.length > 0 && (
          <Circle
            position={"relative"}
            size={"40px"}
            border={"1px solid var(--chakra-colors-whiteAlpha-300)"}
            overflow="hidden"
          >
            <Image
              blurDataURL={
                typeof window !== "undefined"
                  ? `${window.origin}/api/twitter-avatar?username=${debouncedUsername}&placeholder=true`
                  : "/default_twitter_icon.png"
              }
              placeholder="blur"
              src={
                shouldFallbackToDefaultImage || typeof window === "undefined"
                  ? "/default_twitter_icon.png"
                  : `${window.origin}/api/twitter-avatar?username=${debouncedUsername}`
              }
              layout="fill"
              alt="Twitter avatar"
              onError={() => setShouldFallbackToDefaultImage(true)}
            />
          </Circle>
        )}
      </HStack>
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TwitterUserInput
