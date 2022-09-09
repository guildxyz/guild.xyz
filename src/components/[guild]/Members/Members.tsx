import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import useScrollEffect from "hooks/useScrollEffect"
import { useMemo, useRef, useState } from "react"
import useGuild from "../hooks/useGuild"
import Member from "./components/Member"

type Props = {
  members: Array<string>
}
const BATCH_SIZE = 48

const Members = ({ members }: Props): JSX.Element => {
  const { isLoading, admins } = useGuild()

  const ownerAddress = useMemo(
    () => admins?.find((admin) => admin?.isOwner)?.address,
    [admins]
  )

  const adminsSet = useMemo(
    () => new Set(admins?.map((admin) => admin.address) ?? []),
    [admins]
  )

  const sortedMembers = useMemo(
    () =>
      members?.sort((a, b) => {
        // If the owner is behind anything, sort it before "a"
        if (b === ownerAddress) return 1

        // If an admin is behind anything other than an owner, sort it before "a"
        if (adminsSet.has(b) && a !== ownerAddress) return 1

        // Otherwise don't sort
        return -1
      }) || [],
    [members, ownerAddress, adminsSet]
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
  }, [members, renderedMembersCount])

  const renderedMembers = useMemo(
    () => sortedMembers?.slice(0, renderedMembersCount) || [],
    [sortedMembers, renderedMembersCount]
  )

  if (isLoading) return <Text>Loading members...</Text>

  if (!renderedMembers?.length) return <Text>This guild has no members yet</Text>

  return (
    <>
      {!isLoading && (
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
      )}
      {members?.length > renderedMembersCount && (
        <Center pt={6}>
          <Spinner />
        </Center>
      )}
    </>
  )
}

export default Members
