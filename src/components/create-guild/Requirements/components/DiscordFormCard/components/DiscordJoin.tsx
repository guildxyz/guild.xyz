import MemberSinceInput from "./MemberSinceInput"

type Props = {
  index: number
}

const DiscordJoin = ({ index }: Props): JSX.Element => (
  <>
    <MemberSinceInput index={index} label="Registered before" />
  </>
)

export default DiscordJoin
