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
import { useEffect, useMemo, useState } from "react"
import { UseFormSetValue } from "react-hook-form"
import { FixedSizeList } from "react-window"
import { RequirementComponentProps } from "types"
import Requirement from "./common/Requirement"
import { RequirementButton } from "./common/RequirementButton"

type Props = RequirementComponentProps & {
  setValueForBalancy: UseFormSetValue<any>
}

const AllowlistRequirement = ({
  requirement,
  setValueForBalancy,
  ...rest
}: Props): JSX.Element => {
  const { addresses, hideAllowlist } = requirement.data

  useEffect(() => {
    if (setValueForBalancy && addresses)
      setValueForBalancy("data.validAddresses", addresses)
  }, [setValueForBalancy, addresses])

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
    <Requirement
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
      {...rest}
    >
      Be included in allowlist
    </Requirement>
  )
}

export default AllowlistRequirement
