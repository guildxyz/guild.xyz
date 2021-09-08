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
          colorScheme="gray"
          bgColor={inputValue === "TG" && "telegram.500"}
          color={inputValue === "TG" && "white"}
          _hover={{
            bgColor: inputValue === "TG" && "telegram.400",
          }}
          onClick={() => setValue("guildPlatform", "TG")}
        >
          <HStack spacing={2}>
            <Icon as={TelegramLogo} />
            <Text display={{ base: "none", lg: "inline" }}>Telegram</Text>
          </HStack>
        </Button>
        <Button
          width="full"
          colorScheme="gray"
          bgColor={inputValue === "DC" && "indigo.500"}
          color={inputValue === "DC" && "white"}
          _hover={{
            bgColor: inputValue === "DC" && "indigo.400",
          }}
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
          bgColor={inputValue === "DC_CUSTOM" && "indigo.500"}
          color={inputValue === "DC_CUSTOM" && "white"}
          _hover={{
            bgColor: inputValue === "DC_CUSTOM" && "indigo.400",
          }}
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
            top={-3}
            right={-3}
            width={6}
            height={6}
            bgColor={colorMode === "light" ? "gray.400" : "gray.500"}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            rounded="full"
          >
            <a
              href="https://agora-space.gitbook.io/agoraspace/tools/role-management-bot/discord"
              target="_blank"
              rel="noreferrer"
            >
              <Icon as={Question} size={4} position="relative" top="-1px" />
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
