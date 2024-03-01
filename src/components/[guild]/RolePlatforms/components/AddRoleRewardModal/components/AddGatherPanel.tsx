import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { SectionTitle } from "components/common/Section"
import useDebouncedState from "hooks/useDebouncedState"
import { Question } from "phosphor-react"
import { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import useSWRImmutable from "swr/immutable"

export type AddGatherFormType = {
  apiKey: string
  spaceUrl: string
  spaceId: string
  role: string
  affiliation: string
}

type Props = {
  onSuccess: () => void
}

const AddGatherPanel = ({ onSuccess }: Props) => {
  const methods = useForm<AddGatherFormType>({
    mode: "all",
  })

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const {
    control,
    register,
    formState: { errors },
  } = methods

  const [spaceId, setSpaceId] = useState(null)

  const requiredInputs = useWatch({ name: ["apiKey", "spaceUrl"], control: control })

  const debouncedInputs: [string, string] = useDebouncedState(requiredInputs)
  const [apiKey, spaceUrl] = debouncedInputs

  const shouldCheckAccess = () =>
    !!apiKey && !!spaceUrl && !errors?.apiKey && !errors?.spaceUrl

  const {
    data,
    isLoading,
    error: accessCheckError,
  } = useSWRImmutable(
    shouldCheckAccess() && !!spaceId
      ? `/api/gather?apiKey=${apiKey}&spaceId=${spaceId}`
      : null
  )

  const bg = useColorModeValue("gray.50", "blackAlpha.200")

  useEffect(() => {
    if (!spaceUrl || !!errors?.spaceUrl) return

    const relevantSection = decodeURIComponent(spaceUrl).slice(
      "https://app.gather.town/app/".length
    )

    // according to docs, forward slashes in spaceId need to be replaced by backslashes
    // https://gathertown.notion.site/Gather-HTTP-API-3bbf6c59325f40aca7ef5ce14c677444#3c526203a2d543879841dae77dbe3ed5
    setSpaceId(relevantSection.replace("/", "\\"))
  }, [spaceUrl])

  const onSubmit = (data) => {
    append({
      guildPlatform: {
        platformName: "GATHER",
        platformGuildId: spaceId,
        platformGuildData: {
          spaceId: spaceId,
          gatherApiKey: data.apiKey,
          affiliation: data.affiliation,
          role: data.role,
        },
      },
      isNew: true,
    })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        The email addresses of eligible users will be added to the guest list for the
        Gather space, which you can specify below.
      </Text>

      {!isLoading && !!data && (
        <>
          <Alert overflow="initial" status="success" mb={6} alignItems={"center"}>
            <AlertIcon mt={0} />{" "}
            <p>
              <strong>Connection successful!</strong> Your space ID and API key have
              been successfully verified.
            </p>
          </Alert>
        </>
      )}

      {isLoading && (
        <Alert
          overflow="initial"
          status="info"
          mb={6}
          display={"flex"}
          gap={4}
          alignItems={"center"}
        >
          <Spinner size={"sm"} /> <Text>Checking connection...</Text>
        </Alert>
      )}

      {!isLoading && !data && !accessCheckError && (
        <Alert overflow="initial" status="info" mb={6} alignItems={"center"}>
          <AlertIcon mt={0} />
          <p>Enter API key and space URL below to set up connection.</p>
        </Alert>
      )}

      {!isLoading && !!accessCheckError && (
        <>
          <Alert
            overflow="initial"
            status="warning"
            mb={6}
            display={"flex"}
            alignItems={"center"}
          >
            <AlertIcon mt={0} />
            {accessCheckError.type === "APIKeyError" ? (
              <p>
                <strong>Unable to access your account!</strong> Please make sure to
                enter a valid API key.
              </p>
            ) : (
              <p>
                <strong>Failed to connect to space!</strong> Please make sure to
                enter a valid API key and space URL.
              </p>
            )}
          </Alert>
        </>
      )}

      <FormControl pt={{ md: 0.5 }} isInvalid={!!errors?.apiKey}>
        <Stack>
          <HStack>
            <Text as="span">API key:</Text>
            <Tooltip
              label="Used to securely communicate with Gather."
              placement="top"
              hasArrow
            >
              <Icon as={Question} color="GrayText" />
            </Tooltip>
          </HStack>
          <Input
            type="password"
            {...register("apiKey", {
              required: "This field is required",
            })}
          />
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
        <FormErrorMessage>{errors?.apiKey?.message}</FormErrorMessage>
      </FormControl>

      <FormControl pt={{ md: 0.5 }} isInvalid={!!errors?.spaceUrl}>
        <Stack>
          <HStack mt={6}>
            <Text as="span">Space URL:</Text>
            <Tooltip
              label="You can copy this from your browser when you are inside the space."
              placement="top"
              hasArrow
            >
              <Icon as={Question} color="GrayText" />
            </Tooltip>
          </HStack>
          <Input
            {...register("spaceUrl", {
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
        <FormErrorMessage>{errors?.spaceUrl?.message}</FormErrorMessage>
      </FormControl>

      <Divider my={6}></Divider>

      <FormControl>
        <SectionTitle title={"Guest parameters"} mb={1}></SectionTitle>
        <Text colorScheme="gray" fontWeight="semibold" mb="8">
          Customize the parameters for guests who gained access to your space via
          this reward.
        </Text>
        <Stack gap={6}>
          <Stack>
            <HStack>
              <Text as="span">Affiliation:</Text>
              <Tooltip
                label="Displays information below the person's name in the user info card available from the Participants list."
                placement="top"
                hasArrow
              >
                <Icon as={Question} color="GrayText" />
              </Tooltip>
            </HStack>
            <Input {...register("affiliation")} placeholder="Optional" />
          </Stack>

          <Stack>
            <HStack>
              <Text as="span">Role:</Text>
              <Tooltip
                label="Describes the person's role in your space. This field is for your internal use only and does not actually assign a user role."
                placement="top"
                hasArrow
              >
                <Icon as={Question} color="GrayText" />
              </Tooltip>
            </HStack>
            <Input {...register("role")} placeholder="Optional" />
          </Stack>
        </Stack>
      </FormControl>

      <Flex justifyContent={"flex-end"} mt="auto" pt="10">
        <Button
          isDisabled={!!accessCheckError}
          colorScheme="green"
          onClick={methods.handleSubmit(onSubmit)}
        >
          Continue
        </Button>
      </Flex>
    </FormProvider>
  )
}

export default AddGatherPanel
