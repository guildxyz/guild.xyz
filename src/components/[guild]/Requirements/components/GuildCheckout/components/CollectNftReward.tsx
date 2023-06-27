import { Img } from "@chakra-ui/react"
import useNftDetails from "components/[guild]/collect/hooks/useNftDetails"
import { RewardDisplay } from "components/[guild]/RoleCard/components/Reward"
import { useCollectNftContext } from "./CollectNftContext"

const CollectNftReward = (): JSX.Element => {
  const { chain, address } = useCollectNftContext()
  const { data } = useNftDetails(chain, address)

  return (
    <RewardDisplay
      icon={
        data?.image && (
          <Img
            w="full"
            zIndex={1}
            src={data.image}
            alt="Guild Pin image"
            borderRadius="full"
            boxSize="6"
          />
        )
      }
      label={<>{data?.name ?? "Unknown NFT"}</>}
    />
  )
}

export default CollectNftReward
