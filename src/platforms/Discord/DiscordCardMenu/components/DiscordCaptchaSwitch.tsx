import { Box, HStack, Icon, Spinner, Text, Tooltip } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Switch from "components/common/Switch"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Question, Shield } from "phosphor-react"
import { useState } from "react"
import { GuildPlatform, PlatformGuildData } from "types"
import fetcher from "utils/fetcher"

type Props = {
  serverId: string
}

const DiscordCaptchaSwitch = ({ serverId }: Props): JSX.Element => {
  const { id, guildPlatforms, mutateGuild } = useGuild()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const guildPlatform = guildPlatforms.find(
    (platform) => platform.platformGuildId === serverId
  )

  const submit = (signedValidation: SignedValidation) =>
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    fetcher(`/v2/guilds/${id}/guild-platforms/${guildPlatform.id}`, {
      method: "PUT",
      ...signedValidation,
    })

  const { onSubmit, isLoading } = useSubmitWithSign<GuildPlatform>(submit, {
    onSuccess: (response) => {
      toast({
        status: "success",
        title: "Successfully updated Discord settings",
      })
      mutateGuild(
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        (prev) => ({
          ...prev,
          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          guildPlatforms: prev.guildPlatforms.map((gp) => {
            if (gp.id !== response.id) return gp

            return {
              ...gp,
              platformGuildData: {
                ...gp.platformGuildData,
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                needCaptcha: response.platformGuildData.needCaptcha,
              } as PlatformGuildData["DISCORD"],
            }
          }),
        }),
        { revalidate: false }
      )
    },
    onError: (err) => showErrorToast(err),
  })

  const [isChecked, setIsChecked] = useState(
    guildPlatform?.platformGuildData?.needCaptcha
  )

  const onChange = (e) => {
    if (isLoading) {
      e.preventDefault()
      return
    }

    const newIsChecked = e.target.checked
    setIsChecked(newIsChecked)
    onSubmit({
      platformGuildData: {
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        ...guildPlatform.platformGuildData,
        needCaptcha: newIsChecked,
      },
      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      platformGuildId: guildPlatform.platformGuildId,
    })
  }

  return (
    <Box position="relative">
      <HStack position="relative" px={3} py={1.5} justifyContent="space-between">
        <HStack
          spacing={1}
          opacity={isLoading ? 0.5 : 1}
          transition="opacity 0.2 ease"
        >
          {isLoading ? (
            <Spinner size="xs" boxSize="0.8em" mr={2} p={0} />
          ) : (
            <Icon as={Shield} boxSize="0.8em" mr={2} />
          )}
          <Text as="span">Discord CAPTCHA</Text>
          <Tooltip
            label="Users need to complete a CAPTCHA before joining
                  your guild on Discord"
            hasArrow
            placement="top"
          >
            <Icon as={Question} color="gray" />
          </Tooltip>
        </HStack>
        <Switch
          ml="auto"
          onChange={onChange}
          isChecked={isChecked}
          isDisabled={isLoading}
        />
      </HStack>
    </Box>
  )
}

export default DiscordCaptchaSwitch
