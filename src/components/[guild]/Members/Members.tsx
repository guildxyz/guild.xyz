import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import useScrollEffect from "hooks/useScrollEffect"
import { useMemo, useRef, useState } from "react"
import { GuildOwner } from "types"
import useGuild from "../hooks/useGuild"
import Member from "./Member"

type Props = {
  owner: GuildOwner
  members: Array<string>
  fallbackText: string
}

const BATCH_SIZE = 48

const dummyServerAdmins = [
  {
    id: 1,
    address: "0x0000000000000000000000000000000000000001",
  },
  {
    id: 3,
    address: "0x0000000000000000000000000000000000000003",
  },
]

const Members = ({ owner, members, fallbackText }: Props): JSX.Element => {
  const { admins } = useGuild()

  const sortedMembers = useMemo(
    () =>
      [
        ...(members ?? []),
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000005",
      ]?.sort((a, b) => {
        // If the owner is behind anything, sort it before "a"
        if (b === owner.address) return 1

        // If an admin is behind anything other than an owner, sort it before "a"
        if (
          dummyServerAdmins.findIndex((admin) => admin.address === b) >= 0 && // TODO: use admins instead of dummyServerAdmins
          a !== owner.address
        )
          return 1

        // Otherwise don't sort
        return -1
      }) || [],
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
