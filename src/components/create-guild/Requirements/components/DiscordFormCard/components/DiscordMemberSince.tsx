import MemberSinceInput from "./MemberSinceInput"
import ServerPicker from "./ServerPicker"

type Props = {
  index: number
}

const DiscordMemberSince = ({ index }: Props): JSX.Element => (
  <>
    <ServerPicker index={index} />
    <MemberSinceInput index={index} label="Joined server before" />
  </>
)

export default DiscordMemberSince
