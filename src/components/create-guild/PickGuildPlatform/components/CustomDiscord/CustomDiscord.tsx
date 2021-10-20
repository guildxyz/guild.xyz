import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  useColorMode,
} from "@chakra-ui/react"
import { Check } from "phosphor-react"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useServerData from "./hooks/useServerData"

const CustomDiscord = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const invite = useWatch({ name: "discord_invite" })
  useEffect(() => {
    console.log("invite", invite)
  }, [invite])
  const platform = useWatch({ name: "platform" })
  const [{ serverId, categories }, loading] = useServerData(invite)

  useEffect(() => {
    if (platform === "DISCORD_CUSTOM" && serverId)
      setValue("discordServerId", serverId)
  }, [serverId])

  const { colorMode } = useColorMode()

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing="4"
      px="5"
      py="4"
      w="full"
    >
      <FormControl
        isInvalid={errors?.discord_invite || (invite && !loading && !serverId)}
      >
        <FormLabel>1. Paste invite link</FormLabel>
        <Input
          {...register("discord_invite", {
            required: platform === "DISCORD_CUSTOM" && "This field is required.",
          })}
        />
        <FormErrorMessage>
          {errors?.discord_invite?.message ?? "Invalid invite"}
        </FormErrorMessage>
      </FormControl>
      <FormControl isDisabled={!serverId}>
        <FormLabel>2. Add bot</FormLabel>
        {!categories?.length ? (
          <Button
            h="10"
            w="full"
            as="a"
            href={
              !serverId
                ? undefined
                : "https://discord.com/api/oauth2/authorize?client_id=868172385000509460&permissions=8&scope=bot%20applications.commands"
            }
            target={serverId && "_blank"}
            isLoading={loading}
            disabled={!serverId || loading}
          >
            Add Medusa
          </Button>
        ) : (
          <Button h="10" w="full" disabled rightIcon={<Check />}>
            Medusa added
          </Button>
        )}
      </FormControl>
      <FormControl isInvalid={errors?.categoryName} isDisabled={!categories?.length}>
        <FormLabel>3. Set the new channel's category</FormLabel>
        <Select {...register(`categoryName`)}>
          <option value="" defaultChecked>
            Select one
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors?.categoryName?.message}</FormErrorMessage>
      </FormControl>
    </SimpleGrid>
  )
}

export default CustomDiscord
