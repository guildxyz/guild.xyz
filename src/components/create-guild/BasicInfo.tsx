import {
  Center,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import Section from "components/common/Section"
import { DiscordLogo, TwitterLogo } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"
import { useCreateGuildContext } from "./CreateGuildContext"
import Pagination from "./Pagination"

const BasicInfo = (): JSX.Element => {
  const { layout } = useCreateGuildContext()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  return (
    <>
      <Stack spacing={10}>
        <Section title="How could we contact you?">
          <FormControl>
            <Stack alignItems="center" direction={{ base: "column", sm: "row" }}>
              <Input
                type="email"
                maxW={{ base: "full", sm: "sm" }}
                placeholder="Your e-mail address"
              />
              <Center w={{ base: "full", sm: 8 }} h={{ base: 6, sm: 10 }}>
                <Text
                  as="span"
                  fontWeight="bold"
                  colorScheme="gray"
                  fontSize="sm"
                  textTransform="uppercase"
                >
                  or
                </Text>
              </Center>
              <Button
                as="a"
                href="https://discord.gg/guildxyz"
                target="_blank"
                leftIcon={<DiscordLogo />}
                colorScheme="indigo"
                w={{ base: "full", sm: "max-content" }}
                h={10}
                flexShrink={0}
              >
                Join our Discord
              </Button>
            </Stack>
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

      <Pagination
        nextStepLabel="Create Guild"
        nextStepHandler={handleSubmit(console.log, console.log)}
      />
    </>
  )
}

export default BasicInfo
