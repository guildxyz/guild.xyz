import {
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { AddGatherFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
import { Eye, EyeClosed, Question } from "phosphor-react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import GatherConnectionStatusAlert from "./GatherConnectionStatusAlert"
import useGatherAccess from "./hooks/useGatherAccess"

const GatherConnectionForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddGatherFormType>()

  const [showApiKey, setShowApiKey] = useState(false)

  const [gatherApiKey, gatherSpaceId] = useWatch({
    name: ["gatherApiKey", "gatherSpaceId"],
  })
  const {
    success: accessSuccess,
    isLoading: accessLoading,
    error: accessError,
  } = useGatherAccess(
    !errors?.gatherApiKey && gatherApiKey,
    !errors?.gatherSpaceId && gatherSpaceId
  )

  return (
    <>
      <GatherConnectionStatusAlert
        isLoading={accessLoading}
        success={accessSuccess}
        error={accessError}
      />

      <FormControl pt={{ md: 0.5 }} isInvalid={!!errors?.gatherApiKey}>
        <Stack>
          <HStack>
            <Text as="span">API key:</Text>
            <Tooltip
              label="Used to securely communicate with Gather"
              placement="top"
              hasArrow
            >
              <Icon as={Question} color="GrayText" />
            </Tooltip>
          </HStack>
          <InputGroup>
            <Input
              autoComplete="off"
              type={showApiKey ? "text" : "password"}
              {...register("gatherApiKey", {
                required: "This field is required",
              })}
            />
            <InputRightElement onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? <EyeClosed /> : <Eye />}
            </InputRightElement>
          </InputGroup>
        </Stack>
        <Text as="small" colorScheme="gray">
          If you don’t have an API key yet, you can create one{" "}
          <Link
            href="https://gather.town/apiKeys"
            textDecoration="underline"
            isExternal
          >
            here
          </Link>
          .
        </Text>
        <FormErrorMessage>{errors?.gatherApiKey?.message}</FormErrorMessage>
      </FormControl>

      <FormControl pt={{ md: 0.5 }} isInvalid={!!errors?.gatherSpaceId}>
        <Stack>
          <HStack mt={6}>
            <Text as="span">Space URL:</Text>
            <Tooltip
              label="You can copy this from your browser when you are inside the space"
              placement="top"
              hasArrow
            >
              <Icon as={Question} color="GrayText" />
            </Tooltip>
          </HStack>
          <Input
            {...register("gatherSpaceId", {
              required: "This field is required",
              validate: (val) => {
                if (!val) return true
                try {
                  new URL(val)
                  if (!val.startsWith("https://app.gather.town/app"))
                    return "This is not a Gather space URL!"
                  return true
                } catch {
                  return "Invalid URL!"
                }
              },
            })}
          />
        </Stack>
        <FormErrorMessage>{errors?.gatherSpaceId?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}

export default GatherConnectionForm
