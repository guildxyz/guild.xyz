import useGuild from "components/[guild]/hooks/useGuild"
import { useEffect } from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { Visibility } from "types"

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
        platformGuildId: `polygonid-${guildId}`,
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
