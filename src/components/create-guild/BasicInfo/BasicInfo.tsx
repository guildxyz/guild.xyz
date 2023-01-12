import {
  FormControl,
  FormHelperText,
  Icon,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Section from "components/common/Section"
import useDatadog from "components/_app/Datadog/useDatadog"
import { ArrowSquareOut } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import CreateGuildButton from "../CreateGuildButton"
import { useCreateGuildContext } from "../CreateGuildContext"
import Pagination from "../Pagination"
import PlatformlessGuildForm from "./components/PlatformlessGuildForm"
import TwitterUrlInput from "./components/TwitterUrlInput"

const BasicInfo = (): JSX.Element => {
  const { addDatadogAction } = useDatadog()

  const { platform, template } = useCreateGuildContext()
  const {
    control,
    register,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const guildName = useWatch({ control, name: "name" })
  const contact = useWatch({ control, name: "contact" })

  useEffect(() => {
    if (!contact) return
    addDatadogAction("Typed in contact (basic info)")
  }, [contact])

  return (
    <>
      <Card px={{ base: 5, sm: 6 }} py={8}>
        <Stack spacing={10}>
          {!platform && <PlatformlessGuildForm />}

          <Section title="How could we contact you?">
            <Text fontSize="sm" colorScheme="gray">
              This contact is only visible for the Guild Team to reach you with
              support and partnership initiatives if needed.{" "}
            </Text>

            <FormControl>
              <Input
                maxW={{ base: "full", sm: "sm" }}
                placeholder="E-mail address or Telegram handle"
                {...register("contact")}
              />
              <FormHelperText>
                Or{" "}
                <Link isExternal href="https://discord.gg/guildxyz">
                  <Text as="span">join our Discord</Text>
                  <Icon ml={1} as={ArrowSquareOut} />
                </Link>
              </FormHelperText>
            </FormControl>
          </Section>

          {template === "GROWTH" && (
            <Section title="Links for community members">
              <TwitterUrlInput />
            </Section>
          )}
        </Stack>
      </Card>

      <Pagination nextButtonHidden>
        <CreateGuildButton
          isDisabled={
            !guildName ||
            !!Object.values(errors).length ||
            (template === "GROWTH" && !touchedFields?.socialLinks?.TWITTER)
          }
        />
      </Pagination>
    </>
  )
}

export default BasicInfo
