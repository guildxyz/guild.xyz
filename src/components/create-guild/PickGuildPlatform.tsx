import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import Discord from "static/icons/discord.svg"
import Telegram from "static/icons/telegram.svg"

const PickGuildPlatform = () => {
  const { colorMode } = useColorMode()

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const inputValue = useWatch({ name: "platform" })

  return (
    <>
      <HStack width="full">
        <Tooltip label="Coming soon">
          <Box width="full">
            <Button
              width="full"
              disabled
              colorScheme={inputValue === "TELEGRAM" ? "TELEGRAM" : "gray"}
              onClick={() => setValue("platform", "TELEGRAM")}
            >
              <HStack spacing={2}>
                <Icon as={Telegram} />
                <Text display={{ base: "none", lg: "inline" }}>Telegram</Text>
              </HStack>
            </Button>
          </Box>
        </Tooltip>
        <Button
          width="full"
          colorScheme={inputValue === "DISCORD" ? "DISCORD" : "gray"}
          onClick={() => setValue("platform", "DISCORD")}
        >
          <HStack spacing={2}>
            <Icon as={Discord} />
            <Text display={{ base: "none", lg: "inline" }}>
              Official Guild.xyz Discord
            </Text>
          </HStack>
        </Button>
        <Tooltip label="Coming soon">
          <Box position="relative" width="full">
            <Button
              width="full"
              disabled
              colorScheme={inputValue === "DISCORD_CUSTOM" ? "DISCORD" : "gray"}
              onClick={() => setValue("platform", "DISCORD_CUSTOM")}
            >
              <HStack height="full" spacing={2} justifyContent="center">
                <Icon as={Discord} />
                <Text display={{ base: "none", lg: "inline" }}>Custom Discord</Text>
                <Text display={{ base: "inline", lg: "none" }}>Custom</Text>
              </HStack>
            </Button>

            {/* <Box
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
              <Text
                position="relative"
                top={-0.5}
                fontFamily="display"
                fontWeight="bold"
              >
                ?
              </Text>
            </a>
          </Box> */}
          </Box>
        </Tooltip>
      </HStack>
      {/* For now the value of this input can be "DISCORD" | "DISCORD_CUSTOM" | "TELEGRAM" */}
      <FormControl isInvalid={errors.platform}>
        <Input
          type="hidden"
          {...register("platform", {
            required: "You must pick a realm for your guild",
          })}
        />
        <FormErrorMessage>{errors.platform?.message}</FormErrorMessage>
      </FormControl>
    </>
  )
}

export default PickGuildPlatform
