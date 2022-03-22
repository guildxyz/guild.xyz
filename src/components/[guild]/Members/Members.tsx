import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import useScrollEffect from "hooks/useScrollEffect"
import { useMemo, useRef, useState } from "react"
import { GuildAdmin } from "types"
import Member from "./Member"

type Props = {
  admins: GuildAdmin[]
  members: Array<string>
}

const BATCH_SIZE = 48

const Members = ({ admins, members }: Props): JSX.Element => {
  const ownerAddress = useMemo(
    () => admins?.find((admin) => admin?.isOwner)?.address,
    [admins]
  )

  const sortedMembers = useMemo(
    () =>
      members?.sort((a, b) => {
        const bAdmin = admins.find((admin) => admin.address === b)

        // If the owner is behind anything, sort it before "a"
        if (bAdmin?.isOwner) return 1

        const aAdmin = admins.find((admin) => admin.address === a)

        // If an admin is behind anything other than an owner, sort it before "a"
        if (!!bAdmin && !aAdmin?.isOwner) return 1

        // Otherwise don't sort
        return -1
      }) || [],
    [admins, members]
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

  if (!renderedMembers?.length) return <Text>This guild has no members yet</Text>

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
            isOwner={ownerAddress === address}
            isAdmin={admins?.some((admin) => admin?.address === address)}
            key={address}
            address={address}
          />
        ))}
      </SimpleGrid>
      {members?.length > renderedMembersCount && (
        <Center pt={6}>
          <Spinner />
        </Center>
      )}
    </>
  )
}

export default Members
