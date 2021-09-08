import { Button, HStack, Icon, Input, Text } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"

const PickGuildPlatform = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const inputValue = useWatch({ name: "guildPlatform" })

  return (
    <>
      <HStack width="full">
        <Button
          width="full"
          colorScheme="telegram"
          borderWidth={2}
          borderColor={inputValue === "TG" ? "telegram.700" : "transparent"}
          onClick={() => setValue("guildPlatform", "TG")}
        >
          <HStack spacing={2}>
            <Icon as={TelegramLogo} />
            <Text display={{ base: "none", lg: "inline" }}>Telegram</Text>
          </HStack>
        </Button>
        <Button
          width="full"
          colorScheme="indigo"
          borderWidth={2}
          borderColor={inputValue === "DC" ? "indigo.700" : "transparent"}
          onClick={() => setValue("guildPlatform", "DC")}
        >
          <HStack spacing={2}>
            <Icon as={DiscordLogo} />
            <Text display={{ base: "none", lg: "inline" }}>Official Discord</Text>
          </HStack>
        </Button>
        <Button
          width="full"
          minWidth="max-content"
          colorScheme="indigo"
          borderWidth={2}
          borderColor={inputValue === "DC_CUSTOM" ? "indigo.700" : "transparent"}
          onClick={() => setValue("guildPlatform", "DC_CUSTOM")}
        >
          <HStack spacing={2}>
            <Icon as={DiscordLogo} />
            <Text display={{ base: "none", lg: "inline" }}>Custom Discord</Text>
            <Text display={{ base: "inline", lg: "none" }}>Custom</Text>
          </HStack>
        </Button>
      </HStack>
      {/* For now the value of this input can be "DC" | "DC_CUSTOM" | "TG" */}
      <Input type="hidden" {...register("guildPlatform")} defaultValue="TG" />
    </>
  )
}

export default PickGuildPlatform
