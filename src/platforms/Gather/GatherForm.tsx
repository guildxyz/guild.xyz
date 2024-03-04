import {
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  Link,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { AddGatherFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddGatherPanel"
import { SectionTitle } from "components/common/Section"
import useDebouncedState from "hooks/useDebouncedState"
import { Question } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import GatherConnectionStatusAlert from "./GatherConnectionStatusAlert"

const GatherForm = ({}) => {
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext<AddGatherFormType>()

  const requiredInputs = useWatch({ name: ["gatherApiKey", "gatherSpaceUrl"] })
  const spaceId = useWatch({ name: "gatherSpaceId" })

  const debouncedInputs: [string, string] = useDebouncedState(requiredInputs)
  const [gatherApiKey, gatherSpaceUrl] = debouncedInputs

  const shouldCheckAccess = () =>
    !!gatherApiKey &&
    !!gatherSpaceUrl &&
    !errors?.gatherApiKey &&
    !errors?.gatherSpaceUrl

  const {
    data,
    isLoading,
    error: accessCheckError,
  } = useSWRImmutable(
    shouldCheckAccess() && !!spaceId
      ? `/api/gather?apiKey=${gatherApiKey}&spaceId=${spaceId}`
      : null
  )

  useEffect(() => {
    if (!gatherSpaceUrl || !!errors?.gatherSpaceUrl) return

    const relevantSection = decodeURIComponent(gatherSpaceUrl).slice(
      "https://app.gather.town/app/".length
    )

    // according to docs, forward slashes in spaceId need to be replaced by backslashes
    // https://gathertown.notion.site/Gather-HTTP-API-3bbf6c59325f40aca7ef5ce14c677444#3c526203a2d543879841dae77dbe3ed5
    const constructedSpaceId = relevantSection.replace("/", "\\")
    setValue("gatherSpaceId", constructedSpaceId)
  }, [gatherSpaceUrl])

  return (
    <>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        The email addresses of eligible users will be added to the guest list for the
        Gather space, which you can specify below.
      </Text>

      <GatherConnectionStatusAlert
        isLoading={isLoading}
        success={!!data}
        error={accessCheckError}
      />

      <FormControl pt={{ md: 0.5 }} isInvalid={!!errors?.gatherApiKey}>
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
            {...register("gatherApiKey", {
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
        <FormErrorMessage>{errors?.gatherApiKey?.message}</FormErrorMessage>
      </FormControl>

      <FormControl pt={{ md: 0.5 }} isInvalid={!!errors?.gatherSpaceUrl}>
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
            {...register("gatherSpaceUrl", {
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
        <FormErrorMessage>{errors?.gatherSpaceUrl?.message}</FormErrorMessage>
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
            <Input {...register("gatherAffiliation")} placeholder="Optional" />
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
            <Input {...register("gatherRole")} placeholder="Optional" />
          </Stack>
        </Stack>
      </FormControl>
    </>
  )
}

export default GatherForm
