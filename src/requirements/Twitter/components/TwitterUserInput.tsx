import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  SkeletonCircle,
} from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import useSWRImmutable from "swr/immutable"
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

  const { data: twitterAvatar, isValidating } = useSWRImmutable(
    debouncedUsername ? `/assets/twitter/avatar/${debouncedUsername}` : null
  )

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
    >
      <FormLabel>Username</FormLabel>

      <HStack>
        <InputGroup>
          <InputLeftElement>@</InputLeftElement>
          <Input {...field} pl={7} />
        </InputGroup>
        {debouncedUsername?.length > 0 && (
          <SkeletonCircle
            size="40px"
            flexShrink={0}
            border="1px solid var(--chakra-colors-whiteAlpha-300)"
            overflow="hidden"
            isLoaded={!isValidating}
          >
            <Img
              src={twitterAvatar ?? "/default_twitter_icon.png"}
              alt="Twitter avatar"
              boxSize="40px"
            />
          </SkeletonCircle>
        )}
      </HStack>
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TwitterUserInput
