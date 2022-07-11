import { GatedChannels } from "components/[guild]/RolesByPlatform/components/RoleListItem/components/EditRole/components/ChannelsToGate/components/Category"

const preprocessGatedChannels = (gatedChannels: GatedChannels) => {
  const gatedChannelEntries = Object.entries(gatedChannels ?? {})

  if (gatedChannelEntries.length <= 0) return undefined

  return gatedChannelEntries.reduce((acc, [categoryId, { channels }]) => {
    const channelEntries = Object.entries(channels)
    const filtered = channelEntries.filter(([, { isChecked }]) => isChecked)

    if (filtered.length === channelEntries.length) {
      acc.push(categoryId)
      return acc
    }

    acc = [...acc, ...filtered.map(([id]) => id)]

    return acc
  }, [])
}

export default preprocessGatedChannels
