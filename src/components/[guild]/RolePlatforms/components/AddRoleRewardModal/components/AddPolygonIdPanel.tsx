import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect } from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { PlatformType, Visibility } from "types"

type Props = {
  onSuccess: () => void
}

const AddPolygonIDPanel = ({ onSuccess }: Props) => {
  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { id: guildId } = useGuild()

  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  useEffect(() => {
    append({
      guildPlatform: {
        platformName: "POLYGON_ID",
        platformGuildId: `${PlatformType.POLYGON_ID}-${guildId}`,
      },
      isNew: true,
      platformGuildData: {},
      visibility: roleVisibility,
    })
    onSuccess()
  }, [])

  return null
}

export default AddPolygonIDPanel
