import { Fade, HStack, Icon, Text, useDisclosure } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import { ArrowSquareIn, ListPlus } from "@phosphor-icons/react"
import RequirementConnectButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useRequirement from "components/[guild]/hooks/useRequirement"
import Button from "components/common/Button"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useDebouncedState from "hooks/useDebouncedState"
import { useState } from "react"
import SearchableVirtualListModal from "requirements/common/SearchableVirtualListModal"
import { isAddress } from "viem"

function HiddenAllowlistText({ isEmail }: { isEmail: boolean }) {
  return (
    <Text color="gray" fontSize="xs" fontWeight="normal">
      {`Allowlisted ${isEmail ? " email" : ""} addresses are hidden`}
    </Text>
  )
}

const AllowlistRequirement = ({ ...rest }: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext<"ALLOWLIST" | "ALLOWLIST_EMAIL">()
  // TODO: we should add addressCount to the schema, and remove the cast later on
  const castedRequirement = requirement as unknown as Extract<
    Schemas["Requirement"],
    { type: "ALLOWLIST" | "ALLOWLIST_EMAIL" }
  > & {
    data: {
      // These are not included in the schemas, as these are appended on-the-fly by the BE, when sending the response
      addressCount?: number
    }
  }

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedState(search)

  const {
    addresses: initialAddresses,
    hideAllowlist,
    addressCount,
    fileId,
  } = castedRequirement.data

  const willSearchAddresses = search !== debouncedSearch
  const { data: req, isValidating: isSearchingAddresses } = useRequirement(
    castedRequirement?.roleId,
    castedRequirement?.id,
    debouncedSearch
  )

  const addresses = req?.data?.addresses ?? initialAddresses

  // Needed for a smooth fade, if we used 'addresses', it changes during the fade out
  const delayedAddresses = useDebouncedState(addresses, 200)
  const addressCountToShow =
    search.length <= 0 ? addresses.length : delayedAddresses.length

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isEmail = castedRequirement.type === "ALLOWLIST_EMAIL"

  const { reqAccesses } = useRoleMembership(castedRequirement.roleId)

  const hasAccess = reqAccesses?.find(
    ({ requirementId }) => requirementId === castedRequirement.id
  )?.access

  const shouldShowSearchHints =
    !!fileId &&
    addressCount &&
    ((!isEmail && !isAddress(search, { strict: false })) ||
      (isEmail && addresses.length > 1))

  return (
    <Requirement
      image={<Icon as={ListPlus} boxSize={6} />}
      footer={
        isEmail ? (
          <HStack>
            {!hasAccess && <RequirementConnectButton />}
            {hideAllowlist && <HiddenAllowlistText isEmail={isEmail} />}
          </HStack>
        ) : (
          hideAllowlist && <HiddenAllowlistText isEmail={isEmail} />
        )
      }
      {...rest}
    >
      {"Be included in "}
      {hideAllowlist ? (
        `${isEmail ? "email " : ""}allowlist`
      ) : (
        <Button variant="link" rightIcon={<ArrowSquareIn />} onClick={onOpen}>
          {`${isEmail ? "email " : ""}allowlist`}
        </Button>
      )}
      <SearchableVirtualListModal
        aboveList={
          <Fade in={shouldShowSearchHints}>
            <Text>
              Showing <strong>{addressCountToShow}</strong>{" "}
              {isEmail ? "email " : " "}
              addresses from <strong>{addressCount}</strong>
            </Text>
          </Fade>
        }
        belowList={
          <Fade in={shouldShowSearchHints}>
            <Text fontSize={"sm"} textAlign={"center"} color="gray" mt={2}>
              {addressCount - addressCountToShow} more addresses. Search to see if an
              address is included
            </Text>
          </Fade>
        }
        initialList={addresses}
        isOpen={isOpen}
        onClose={onClose}
        title={isEmail ? "Email allowlist" : "Allowlist"}
        onSearch={setSearch}
        isSearching={isSearchingAddresses || willSearchAddresses}
      />
    </Requirement>
  )
}

export default AllowlistRequirement
