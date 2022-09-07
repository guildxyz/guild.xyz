import { Center, HStack, SimpleGrid, Spinner, Tag, Text } from "@chakra-ui/react"
import Section from "components/common/Section"
import useScrollEffect from "hooks/useScrollEffect"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"
import { GuildAdmin } from "types"
import useGuildPermission from "../hooks/useGuildPermission"
import Member from "./components/Member"

type Props = {
  showMembers: boolean
  isLoading?: boolean
  admins: GuildAdmin[]
  members: Array<string>
}

const BATCH_SIZE = 48

const Members = ({
  showMembers,
  isLoading,
  admins,
  members,
}: Props): JSX.Element => {
  const { isAdmin } = useGuildPermission()

  const [DynamicMembersExporter, setDynamicMembersExporter] = useState(null)

  useEffect(() => {
    if (!isAdmin || DynamicMembersExporter) return
    const MembersExporter = dynamic(() => import("./components/MembersExporter"))
    setDynamicMembersExporter(MembersExporter)
  }, [isAdmin, DynamicMembersExporter])

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

  if (!showMembers && !isAdmin) return null

  if (isLoading) return <Text>Loading members...</Text>

  if (!renderedMembers?.length) return <Text>This guild has no members yet</Text>

  return (
    <Section
      title="Members"
      titleRightElement={
        <HStack>
          <Tag size="sm">
            {isLoading ? (
              <Spinner size="xs" />
            ) : (
              members?.filter((address) => !!address)?.length ?? 0
            )}
          </Tag>
          {DynamicMembersExporter && <DynamicMembersExporter />}
        </HStack>
      }
    >
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
    </Section>
  )
}

export default Members
