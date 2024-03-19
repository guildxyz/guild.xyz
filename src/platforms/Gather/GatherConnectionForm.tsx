import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import { Eye, EyeClosed, Question } from "@phosphor-icons/react"
import { AddGatherFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
import FormErrorMessage from "components/common/FormErrorMessage"
import { CSSProperties, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import GatherConnectionStatusAlert from "./GatherConnectionStatusAlert"
import useGatherAccess from "./hooks/useGatherAccess"

const censorInputStyle = {
  "-webkit-text-security": "disc",
} as CSSProperties

const GatherConnectionForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddGatherFormType>()

  const [gatherApiKey, gatherSpaceId] = useWatch({
    name: ["gatherApiKey", "gatherSpaceId"],
  })

  const {
    success: isAccessSuccess,
    isLoading: isAccessLoading,
    error: accessError,
  } = useGatherAccess(
    !errors?.gatherApiKey && gatherApiKey,
    !errors?.gatherSpaceId && gatherSpaceId,
  )

  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <Stack spacing={0}>
      <FormControl isInvalid={!!errors?.gatherApiKey} mb={4}>
        <HStack mb={2} spacing={0}>
          <FormLabel mb={0}>API key:</FormLabel>
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
            style={showApiKey ? {} : censorInputStyle}
            autoComplete="off"
            {...register("gatherApiKey", {
              required: "This field is required",
            })}
          />
          <InputRightElement onClick={() => setShowApiKey(!showApiKey)}>
            <IconButton
              opacity={0.5}
              _hover={{ opacity: 1 }}
              variant={"simple"}
              aria-label="Hide/ShowPassword"
              icon={showApiKey ? <EyeClosed /> : <Eye />}
            ></IconButton>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          If you don’t have an API key yet, you can create one{" "}
          <Link
            href="https://gather.town/apiKeys"
            textDecoration="underline"
            isExternal
          >
            here
          </Link>
          .
        </FormHelperText>
        <FormErrorMessage>{errors?.gatherApiKey?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors?.gatherSpaceId}>
        <HStack mb={2} spacing={0}>
          <FormLabel mb={0}>Space URL:</FormLabel>
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
        <FormErrorMessage>{errors?.gatherSpaceId?.message}</FormErrorMessage>
      </FormControl>

      <GatherConnectionStatusAlert
        isLoading={isAccessLoading}
        success={isAccessSuccess}
        error={accessError}
      />
    </Stack>
  )
}

export default GatherConnectionForm
