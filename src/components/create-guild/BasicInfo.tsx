import {
  FormControl,
  FormHelperText,
  Icon,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import Section from "components/common/Section"
import { ArrowSquareOut } from "phosphor-react"
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
      </Stack>

      <Pagination nextButtonHidden>
        <CreateGuildButton />
      </Pagination>
    </>
  )
}

export default BasicInfo
