import MemberSinceInput from "./MemberSinceInput"
import ServerPicker from "./ServerPicker"

type Props = {
  baseFieldPath: string
}

const DiscordMemberSince = ({ baseFieldPath }: Props): JSX.Element => (
  <>
    <ServerPicker baseFieldPath={baseFieldPath} />
    <MemberSinceInput baseFieldPath={baseFieldPath} label="Joined server before" />
  </>
)

export default DiscordMemberSince
