import {
  FormControl,
  StackDivider,
  useColorMode,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import { useController, useFormContext } from "react-hook-form"
import CustomDiscord from "./components/CustomDiscord"
import OfficialDiscord from "./components/OfficialDiscord"
import PlatformOption from "./components/PlatformOption"
import TelegramGroup from "./components/TelegramGroup"

const options = [
  {
    value: "DISCORD_CUSTOM",
    color: "DISCORD",
    title: "Discord",
    description: "Will create a role with a join button on your server",
    icon: DiscordLogo,
    disabled: false,
    children: <CustomDiscord />,
  },
  {
    value: "DISCORD",
    color: "DISCORD",
    title: "Official Guild.xyz Discord",
    description: "Will create a channel and role on the Guild.xyz server",
    icon: DiscordLogo,
    disabled: "Full",
    children: <OfficialDiscord />,
  },
  {
    value: "TELEGRAM",
    color: "TELEGRAM",
    title: "Telegram",
    description: "Will manage your Telegram group",
    icon: TelegramLogo,
    disabled: false,
    children: <TelegramGroup />,
  },
]

const PickRolePlatform = () => {
  const { colorMode } = useColorMode()
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const { field } = useController({
    control,
    name: "platform",
    rules: { required: "You must pick a realm for your guild" },
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "platform",
    onChange: field.onChange,
    value: field.value,
  })

  const group = getRootProps()

  return (
    <FormControl isRequired isInvalid={errors?.platform}>
      <VStack
        {...group}
        borderRadius="xl"
        bg={colorMode === "light" ? "white" : "blackAlpha.300"}
        spacing="0"
        border="1px"
        borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
        divider={<StackDivider />}
      >
        {options.map((option) => {
          const radio = getRadioProps({ value: option.value })
          return <PlatformOption key={option.value} {...radio} {...option} />
        })}
      </VStack>

      <FormErrorMessage>{errors?.platform?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default PickRolePlatform
