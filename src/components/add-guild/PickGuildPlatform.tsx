import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { DiscordLogo, Question, TelegramLogo } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"

const PickGuildPlatform = () => {
  const { colorMode } = useColorMode()

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
          colorScheme={inputValue === "TG" ? "TELEGRAM" : "gray"}
          onClick={() => setValue("guildPlatform", "TG")}
        >
          <HStack spacing={2}>
            <Icon as={TelegramLogo} />
            <Text display={{ base: "none", lg: "inline" }}>Telegram</Text>
          </HStack>
        </Button>
        <Button
          width="full"
          colorScheme={inputValue === "DC" ? "DISCORD" : "gray"}
          onClick={() => setValue("guildPlatform", "DC")}
        >
          <HStack spacing={2}>
            <Icon as={DiscordLogo} />
            <Text display={{ base: "none", lg: "inline" }}>
              Official Guild.xyz Discord
            </Text>
          </HStack>
        </Button>
        <Button
          position="relative"
          width="full"
          minWidth="max-content"
          colorScheme={inputValue === "DC_CUSTOM" ? "DISCORD" : "gray"}
        >
          <Box
            width="full"
            height="full"
            onClick={() => setValue("guildPlatform", "DC_CUSTOM")}
          >
            <HStack height="full" spacing={2} justifyContent="center">
              <Icon as={DiscordLogo} />
              <Text display={{ base: "none", lg: "inline" }}>Custom Discord</Text>
              <Text display={{ base: "inline", lg: "none" }}>Custom</Text>
            </HStack>
          </Box>

          <Box
            position="absolute"
            top="-0.85em"
            right="-0.85em"
            width="1.7em"
            height="1.7em"
            color={colorMode === "light" ? "gray.600" : "white"}
            bgColor={colorMode === "light" ? "white" : "gray.600"}
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <a
              href="https://agora-space.gitbook.io/agoraspace/tools/role-management-bot/discord"
              target="_blank"
              rel="noreferrer"
            >
              <Icon
                as={Question}
                padding="0px"
                width="1.7em"
                height="1.7em"
                position="relative"
                top="-1px"
              />
            </a>
          </Box>
        </Button>
      </HStack>
      {/* For now the value of this input can be "DC" | "DC_CUSTOM" | "TG" */}
      <Input type="hidden" {...register("guildPlatform")} />
    </>
  )
}

export default PickGuildPlatform
