import useIsTGBotIn from "components/create-guild/TelegramGroup/hooks/useIsTGBotIn"
import { useRolePlatform } from "../../RolePlatformProvider"
import PlatformCard from "../PlatformCard"

const TelegramCard = ({ onRemove }) => {
  const { nativePlatformId } = useRolePlatform()
  const {
    data: { groupIcon, groupName },
  } = useIsTGBotIn(nativePlatformId)

  return (
    <PlatformCard
      onRemove={onRemove}
      imageUrl={groupIcon || "/default_telegram_icon.png"}
      name={groupName || ""}
    />
  )
}

export default TelegramCard
