import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRolePlatform } from "../../RolePlatformProvider"
import PlatformCard from "../PlatformCard"

const TelegramCard = ({ onRemove }) => {
  const { roles } = useGuild()
  const { nativePlatformId, roleId } = useRolePlatform()
  const role = roles?.find((r) => r.id === roleId)

  const {
    data: { groupIcon, groupName },
  } = useIsTGBotIn(nativePlatformId)

  return (
    <PlatformCard
      onRemove={onRemove}
      imageUrl={groupIcon || role?.imageUrl || "/default_telegram_icon.png"}
      name={groupName || role?.name || ""}
    />
  )
}

export default TelegramCard
