import { Center, Icon, SimpleGrid, Spinner, Text, Tooltip } from "@chakra-ui/react"
import useScrollEffect from "hooks/useScrollEffect"
import { Crown } from "phosphor-react"
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
          <Member key={address} address={address}>
            {admins?.some((admin) => admin?.address === address) && (
              <Tooltip
                label={ownerAddress === address ? "Guild Master" : "Guild Admin"}
              >
                <Icon
                  opacity={ownerAddress === address ? 1 : 0.5}
                  pos="absolute"
                  top="-2"
                  right="0"
                  m="0 !important"
                  color="yellow.400"
                  as={Crown}
                  weight="fill"
                />
              </Tooltip>
            )}
          </Member>
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
