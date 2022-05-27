import {
  ListItem,
  Modal,
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
import Button from "components/common/Button"
import SearchBar from "components/explorer/SearchBar"
import { ArrowSquareOut } from "phosphor-react"
import { useMemo, useState } from "react"
import { FixedSizeList } from "react-window"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const AllowlistRequirementCard = ({ requirement }: Props): JSX.Element => {
  const { addresses, hideAllowlist } = requirement.data

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")
  const itemSize = useBreakpointValue({ base: 55, md: 25 })

  const filteredAllowlist = useMemo(
    () =>
      addresses?.filter((address) =>
        address?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, addresses]
  )

  const Row = ({ index, style }) => (
    <ListItem style={style} fontSize={{ base: "md" }} ml="1em" pr="1em">
      {filteredAllowlist[index]}
    </ListItem>
  )

  return (
    <RequirementCard
      requirement={requirement}
      footer={
        <>
          {hideAllowlist ? (
            <Text opacity={0.5}>Allowlisted addresses are hidden</Text>
          ) : (
            <Button
              px={0}
              variant="ghost"
              fontWeight="medium"
              fontSize="sm"
              h="10"
              rightIcon={<ArrowSquareOut />}
              iconSpacing="3"
              _hover={{ bgColor: null }}
              _active={{ bgColor: null }}
              onClick={onOpen}
            >
              {`View ${addresses?.length} address${
                addresses?.length > 1 ? "es" : ""
              }`}
            </Button>
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
        </>
      }
      pr={undefined}
    >
      Be included in allowlist
    </RequirementCard>
  )
}

export default AllowlistRequirementCard
