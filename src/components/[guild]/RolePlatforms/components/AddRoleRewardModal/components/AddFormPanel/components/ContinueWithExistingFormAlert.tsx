import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Collapse,
  Stack,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import StyledSelect from "components/common/StyledSelect"
import { ArrowRight } from "phosphor-react"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import { PlatformGuildData } from "types"

const useNotConnectedForms = () => {
  const { id: guildId, guildPlatforms } = useGuild()

  const { data, isLoading } = useSWRImmutable<Schemas["Form"][]>(
    `/v2/guilds/${guildId}/forms/`
  )

  const notConnectedForms = useMemo(() => {
    if (!data) return
    return data.filter(
      (form) =>
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        !guildPlatforms.filter((fgp) => fgp.platformGuildData?.formId === form.id)
          .length
    )
  }, [guildPlatforms, data])

  return { notConnectedForms, isLoading }
}

const ContinueWithExistingFormAlert = ({ onAdd }) => {
  const { notConnectedForms, isLoading } = useNotConnectedForms()

  return (
    <Collapse in={!!notConnectedForms?.length}>
      <Alert status="info">
        <AlertIcon />
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent={"space-between"}
          gap={{ base: 3, md: 4 }}
          w="full"
        >
          <Box>
            <AlertTitle>Continue with existing form?</AlertTitle>
            <AlertDescription>
              There're forms that you've created but haven't added as a reward yet
            </AlertDescription>
          </Box>
          <Center flexShrink={0} w="full" maxW={48}>
            <StyledSelect
              isLoading={isLoading}
              onChange={({ value }) =>
                onAdd({
                  guildPlatform: {
                    platformName: "FORM",
                    platformId: value.FORM,
                    platformGuildId: `form-${value.id}`,
                    platformGuildData: {
                      formId: value.id,
                    } satisfies PlatformGuildData["FORM"],
                  },
                  isNew: true,
                })
              }
              options={notConnectedForms?.map((form) => ({
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                label: form.name,
                value: form,
                details: <ArrowRight />,
              }))}
            />
          </Center>
        </Stack>
      </Alert>
    </Collapse>
  )
}

export default ContinueWithExistingFormAlert
