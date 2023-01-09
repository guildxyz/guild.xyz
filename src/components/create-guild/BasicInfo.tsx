import {
  FormControl,
  FormHelperText,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import Section from "components/common/Section"
import { ArrowSquareOut, TwitterLogo } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"
import CreateGuildButton from "./CreateGuildButton"
import { useCreateGuildContext } from "./CreateGuildContext"
import Pagination from "./Pagination"

const BasicInfo = (): JSX.Element => {
  const { layout } = useCreateGuildContext()
  const {
    register,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  return (
    <>
      <Stack spacing={10}>
        <Section title="How could we contact you?">
          <FormControl>
            <Input
              maxW={{ base: "full", sm: "sm" }}
              placeholder="E-mail address or Telegram handle"
            />
            <FormHelperText>
              or{" "}
              <Link isExternal href="https://discord.gg/guildxyz">
                <Text as="span">join our Discord</Text>
                <Icon ml={1} as={ArrowSquareOut} />
              </Link>
            </FormHelperText>
          </FormControl>
        </Section>

        <Section title="Links for community members">
          <FormControl
            maxW="sm"
            isInvalid={!!errors?.socialLinks?.twitter}
            isRequired={layout === "GROWTH"}
          >
            <InputGroup>
              <InputLeftElement>
                <Icon as={TwitterLogo} />
              </InputLeftElement>
              <Input
                placeholder="https://twitter.com/guildxyz"
                {...register("socialLinks.twitter", {
                  required: layout === "GROWTH" ? "This field is required" : false,
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors?.socialLinks?.twitter?.message}
            </FormErrorMessage>
          </FormControl>
        </Section>
      </Stack>

      <Pagination nextButtonHidden>
        <CreateGuildButton />
      </Pagination>
    </>
  )
}

export default BasicInfo
