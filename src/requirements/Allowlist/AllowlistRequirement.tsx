import {
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
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import SearchBar from "components/explorer/SearchBar"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { ArrowSquareIn, ListPlus } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import { UseFormSetValue } from "react-hook-form"
import { FixedSizeList } from "react-window"

type Props = RequirementProps & {
  setValueForBalancy: UseFormSetValue<any>
}

const AllowlistRequirement = ({
  setValueForBalancy,
  ...rest
}: Props): JSX.Element => {
  const requirement = useRequirementContext()

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
        hideAllowlist && (
          <Text color="gray" fontSize="xs" fontWeight="normal">
            Allowlisted addresses are hidden
          </Text>
        )
      }
      {...rest}
    >
      {"Be included in "}
      {hideAllowlist ? (
        "allowlist"
      ) : (
        <Button variant="link" rightIcon={<ArrowSquareIn />} onClick={onOpen}>
          allowlist
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
    </Requirement>
  )
}

export default AllowlistRequirement
