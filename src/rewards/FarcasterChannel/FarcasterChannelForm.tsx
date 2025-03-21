import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { FormControl, FormLabel, Text } from "@chakra-ui/react"
import { AddFarcasterChannelFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddFarcasterChannelPanel"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import { useFormContext, useFormState } from "react-hook-form"
import useSWRImmutable from "swr/immutable"
import { PlatformType } from "types"

const FarcasterChannelForm = () => {
  const { farcasterProfiles } = useUser()
  const { errors } = useFormState<AddFarcasterChannelFormType>()

  return !farcasterProfiles?.length ? (
    <Text>Please connect your Farcaster profile.</Text>
  ) : (
    <>
      <Text colorScheme="gray" fontWeight="semibold" mb="8">
        The users will be invited to the Farcaster channel, which you can specify
        below.
      </Text>

      <FormControl isInvalid={!!errors.channel?.id}>
        <FormLabel>Channel:</FormLabel>
        <FarcasterChannelPicker />
      </FormControl>
    </>
  )
}

const FarcasterChannelPicker = () => {
  const { setValue } = useFormContext<AddFarcasterChannelFormType>()

  const { farcasterProfiles } = useUser()
  const { data, isValidating } = useSWRImmutable<
    { id: string; name: string; imageUrl?: string }[]
  >(`/api/farcaster/users-channels?fid=${farcasterProfiles[0].fid}`)

  const { guildPlatforms } = useGuild()
  const channelIDs = data?.map((channel) => channel.id) ?? []
  const fidsAlredayInUse = guildPlatforms
    ?.filter(
      (gp) =>
        gp.platformId === PlatformType.FARCASTER_CHANNEL &&
        channelIDs.includes(gp.platformGuildId)
    )
    .map((gp) => gp.platformGuildId)

  const filteredData = data?.filter(
    (channel) => !fidsAlredayInUse?.includes(channel.id)
  )

  return (
    <div className="grid gap-1">
      <Select
        disabled={isValidating}
        onValueChange={(newValue) => {
          const channel = data?.find((c) => c.id === newValue)

          if (!channel) return

          setValue("channel", channel, {
            shouldDirty: true,
          })
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pick a channel" />
        </SelectTrigger>
        <SelectContent>
          {filteredData?.length ? (
            filteredData.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))
          ) : (
            <p className="p-4">Couldn't find any usable channels</p>
          )}
        </SelectContent>
      </Select>
      {isValidating && (
        <p className="text-muted-foreground text-sm">Loading your channels...</p>
      )}
    </div>
  )
}

export default FarcasterChannelForm
