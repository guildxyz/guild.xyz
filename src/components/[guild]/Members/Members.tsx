import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import useScrollEffect from "hooks/useScrollEffect"
import { useMemo, useRef, useState } from "react"
import { GuildOwner } from "types"
import Member from "./Member"

type Props = {
  owner: GuildOwner
  members: Array<string>
  fallbackText: string
}

const BATCH_SIZE = 48

const Members = ({ owner, members, fallbackText }: Props): JSX.Element => {
  const sortedMembers = useMemo(
    () => members?.sort((address) => (address === owner.address ? -1 : 1)) || [],
    [owner, members]
  )

  const [renderedMembersCount, setRenderedMembersCount] = useState(BATCH_SIZE)
  const membersEl = useRef(null)
  useScrollEffect(() => {
    if (
      !membersEl.current ||
      membersEl.current.getBoundingClientRect().bottom > window.innerHeight ||
      members?.length <= renderedMembersCount
    )
      return

    setRenderedMembersCount((prevValue) => prevValue + BATCH_SIZE)
  })

  const renderedMembers = useMemo(
    () => sortedMembers?.slice(0, renderedMembersCount) || [],
    [sortedMembers, renderedMembersCount]
  )

  if (!renderedMembers?.length) return <Text>{fallbackText}</Text>

  return (
    <>
      <SimpleGrid
        ref={membersEl}
        columns={{ base: 3, sm: 4, md: 6, lg: 8 }}
        gap={{ base: 6, md: 8 }}
        mt={3}
      >
        {renderedMembers?.map((address) => (
          <Member
            key={address}
            address={address}
            isOwner={address === owner?.address}
          />
        ))}
      </SimpleGrid>
      <Center pt={6}>{members?.length > renderedMembersCount && <Spinner />}</Center>
    </>
  )
}

export default Members
