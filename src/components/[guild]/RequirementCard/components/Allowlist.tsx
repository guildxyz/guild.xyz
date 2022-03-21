import {
  Box,
  Divider,
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
import SearchBar from "components/index/SearchBar"
import { ArrowSquareOut } from "phosphor-react"
import { useMemo, useState } from "react"
import { FixedSizeList } from "react-window"
import RequirementText from "./RequirementText"

type Props = {
  allowlist: Array<string>
  hidden: boolean
}

const Allowlist = ({ allowlist, hidden }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")
  const itemSize = useBreakpointValue({ base: 55, md: 25 })

  const filteredAllowlist = useMemo(
    () => allowlist?.filter((address) => address.includes(search)),
    [search, allowlist]
  )

  const Row = ({ index, style }) => (
    <ListItem style={style} fontSize={{ base: "md" }} ml="1em" pr="1em">
      {filteredAllowlist[index]}
    </ListItem>
  )

  return (
    <Box w="full">
      <RequirementText>Be included in allowlist</RequirementText>
      <Divider my={4} />
      {hidden ? (
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
          {`View ${allowlist?.length} address${allowlist?.length > 1 ? "es" : ""}`}
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
    </Box>
  )
}

export default Allowlist
