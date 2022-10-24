import {
  Flex,
  Icon,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import SearchBar from "components/explorer/SearchBar"
import { ArrowSquareIn, ListPlus } from "phosphor-react"
import { useEffect, useState } from "react"
import { FixedSizeList } from "react-window"
import { Requirement } from "types"
import { RequirementButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const AllowlistRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { addresses, hideAllowlist } = requirement.data

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")
  const itemSize = useBreakpointValue({ base: 55, md: 25 })

  const [filteredAllowlist, setFilteredAllowlist] = useState(addresses)

  useEffect(() => {
    if (!addresses) return
    if (!search) setFilteredAllowlist(addresses)
    setFilteredAllowlist(
      addresses.filter((address) =>
        address.toLowerCase().includes(search.toLowerCase())
      ) ?? []
    )
  }, [addresses, search])

  const Row = ({ index, style }) => (
    <ListItem style={style} fontSize={{ base: "md" }} ml="1em" pr="1em">
      {filteredAllowlist[index]}
    </ListItem>
  )

  return (
    <RequirementCard
      requirement={requirement}
      image={<Icon as={ListPlus} boxSize={6} />}
      footer={
        <Flex justifyContent="start">
          {hideAllowlist ? (
            <Text color="gray" fontSize="xs" fontWeight="normal">
              Allowlisted addresses are hidden
            </Text>
          ) : (
            <RequirementButton rightIcon={<ArrowSquareIn />} onClick={onOpen}>
              {`View ${addresses?.length} address${
                addresses?.length > 1 ? "es" : ""
              }`}
            </RequirementButton>
          )}
          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxW="540px">
              <ModalHeader>Allowlist</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SearchBar {...{ search, setSearch }} placeholder="Search address" />
                <UnorderedList
                  mt="6"
                  ml="2"
                  sx={{ "> div": { overflow: "hidden scroll !important" } }}
                >
                  {filteredAllowlist?.length ? (
                    <FixedSizeList
                      height={350}
                      itemCount={filteredAllowlist.length}
                      itemSize={itemSize}
                      className="custom-scrollbar"
                    >
                      {Row}
                    </FixedSizeList>
                  ) : (
                    <Text colorScheme={"gray"} h="350">
                      No results
                    </Text>
                  )}
                </UnorderedList>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
      }
    >
      Be included in allowlist
    </RequirementCard>
  )
}

export default AllowlistRequirementCard
