import BackButton from "components/common/Layout/components/BackButton"
import useGuild from "./hooks/useGuild"

const BackToGuildButton = () => {
  const { urlName } = useGuild()

  return (
    <BackButton href={`/${urlName}`} forceRender>
      Back to guild page
    </BackButton>
  )
}
export default BackToGuildButton
