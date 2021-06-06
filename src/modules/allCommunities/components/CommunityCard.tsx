import { Link } from "common/components/Link"
import type { Community } from "temporaryData/communities"

type Props = {
  community: Community
}

const CommunityCard = ({ community }: Props): JSX.Element => (
  <Link href={`/${community.urlName}`}>{community.name}</Link>
)

export default CommunityCard
