import {
  FormControl,
  FormHelperText,
  Icon,
  Input,
  Link,
  Text,
} from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"

const ContactInfo = (): JSX.Element => {
  const { register } = useFormContext<GuildFormType>()

  return (
    <>
      <Text fontSize="sm" colorScheme="gray">
        This contact is only visible for the Guild Team to reach you with support and
        partnership initiatives if needed.{" "}
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
    </>
  )
}

export default ContactInfo
