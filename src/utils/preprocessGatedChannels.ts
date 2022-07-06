import { GatedChannels } from "components/[guild]/RolesByPlatform/components/RoleListItem/components/EditRole/components/ChannelsToGate/components/Category"

const preprocessGatedChannels = (gatedChannels: GatedChannels) => {
  const gatedChannelEntries = Object.entries(gatedChannels ?? {})

  if (gatedChannelEntries.length <= 0) return undefined

  return gatedChannelEntries.reduce(
    (acc, [categoryId, { channels }]) => {
      const channelEntries = Object.entries(channels)
      const filtered = channelEntries.filter(([, { isChecked }]) => isChecked)

      if (filtered.length === channelEntries.length) {
        acc.categories.push(categoryId)
        return acc
      }

      acc.channels = [...acc.channels, ...filtered.map(([id]) => id)]

      return acc
    },
    { categories: [], channels: [] }
  )
}

export default preprocessGatedChannels
