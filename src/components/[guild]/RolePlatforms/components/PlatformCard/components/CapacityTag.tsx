import { Tag } from "@chakra-ui/react"
import { useState } from "react"
import { RolePlatform } from "types"

type Props = { rolePlatform: RolePlatform }

const CapacityTag = ({ rolePlatform }: Props) => {
  const [showClaimed, setShowClaimed] = useState(false)

  return (
    <Tag onClick={() => setShowClaimed((prevValue) => !prevValue)} cursor="cursor">
      {showClaimed
        ? `${rolePlatform.capacity - rolePlatform.claimedCapacity} / ${
            rolePlatform.capacity
          } available`
        : `${rolePlatform.claimedCapacity} / ${rolePlatform.capacity} claimed`}
    </Tag>
  )
}
export default CapacityTag
