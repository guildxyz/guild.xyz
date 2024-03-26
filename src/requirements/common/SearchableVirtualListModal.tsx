import {
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import SearchBar from "components/explorer/SearchBar"
import { useMemo, useState } from "react"
import { FixedSizeList } from "react-window"

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  initialList: string[]
}

const SearchableVirtualListModal = ({
  isOpen,
  onClose,
  title,
  initialList,
}: Props) => {
  const [search, setSearch] = useState("")
  const itemSize = useBreakpointValue({ base: 55, md: 25 })

  const filteredList = useMemo(
    () =>
      initialList?.filter((address) =>
        address?.toLowerCase()?.includes(search?.toLowerCase())
      ) ?? [],
    [initialList, search]
  )

  const Row = ({ index, style }) => (
    <ListItem style={style} fontSize={{ base: "md" }} ml="1em" pr="1em">
      {filteredList[index]}
    </ListItem>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="540px">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SearchBar {...{ search, setSearch }} placeholder="Search address" />
          <UnorderedList
            mt="6"
            ml="2"
            sx={{ "> div": { overflow: "hidden scroll !important" } }}
          >
            {filteredList.length > 0 ? (
              <FixedSizeList
                height={350}
                itemCount={filteredList.length}
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
  )
}
export default SearchableVirtualListModal
