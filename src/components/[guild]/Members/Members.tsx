import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react"
import useScrollEffect from "hooks/useScrollEffect"
import { useMemo, useRef, useState } from "react"
import Member from "./Member"

type Props = {
  members: Array<string>
  fallbackText: string
}

const BATCH_SIZE = 48

const Members = ({ members, fallbackText }: Props): JSX.Element => {
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
    () => members?.slice(0, renderedMembersCount) || [],
    [members, renderedMembersCount]
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
          <Member key={address} address={address} />
        ))}
      </SimpleGrid>
      <Center pt={6}>{members?.length > renderedMembersCount && <Spinner />}</Center>
    </>
  )
}

export default Members
