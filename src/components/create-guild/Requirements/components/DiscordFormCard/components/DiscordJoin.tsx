import MemberSinceInput from "./MemberSinceInput"

type Props = {
  baseFieldPath: string
}

const DiscordJoin = ({ baseFieldPath }: Props): JSX.Element => (
  <>
    <MemberSinceInput baseFieldPath={baseFieldPath} label="Registered before" />
  </>
)

export default DiscordJoin
