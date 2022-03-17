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
import { GuildFormType } from "types"
import Discord from "./components/Discord"
import PlatformOption from "./components/PlatformOption"
import TelegramGroup from "./components/TelegramGroup"

const options = [
  {
    value: "DISCORD",
    color: "DISCORD",
    title: "Discord",
    description: "Will create a role with a join button on your server",
    icon: DiscordLogo,
    disabled: false,
    children: <Discord />,
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
  } = useFormContext<GuildFormType>()

  const { field } = useController({
    control,
    name: "platform",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "platform",
    onChange: field.onChange,
    value: field.value,
  })

  const group = getRootProps()

  return (
    <FormControl isRequired isInvalid={!!errors?.platform}>
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
