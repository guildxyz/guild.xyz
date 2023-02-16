import { Tag } from "@chakra-ui/react"
import Button from "components/common/Button"
import RewardCard from "components/common/RewardCard"
import { PropsWithChildren } from "react"
import { usePoap } from "requirements/Poap/hooks/usePoaps"
import { GuildPoap, Rest } from "types"
import usePoapLinks from "../hooks/usePoapLinks"

type Props = {
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
  poap: GuildPoap
} & Rest

const PoapRewardCard = ({
  poap: guildPoap,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const { poap } = usePoap(guildPoap?.fancyId)
  const { poapLinks, isPoapLinksLoading } = usePoapLinks(guildPoap?.id)
  const { image_url: image, name } = poap
  const colorScheme = guildPoap.activated ? `purple` : `gray`

  return (
    <RewardCard
      label={`POAP ${!guildPoap?.activated ? "- not active yet" : ""}`}
      title={name}
      description={
        <Tag mt="1">{`${poapLinks?.total - poapLinks?.claimed} available`}</Tag>
      }
      {...{ image, colorScheme, actionRow, cornerButton }}
      {...rest}
    >
      {!poapLinks?.total ? (
        <Button>Upload minting links</Button>
      ) : !guildPoap.activated ? (
        <Button>Activate</Button>
      ) : (
        <Button colorScheme={colorScheme}>Mint POAP</Button>
      )}
    </RewardCard>
  )
}

export default PoapRewardCard
