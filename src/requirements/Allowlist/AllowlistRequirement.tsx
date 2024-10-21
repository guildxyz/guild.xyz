import { Button } from "@/components/ui/Button"
import { Schemas } from "@guildxyz/types"
import { ArrowSquareOut, ListPlus } from "@phosphor-icons/react/dist/ssr"
import RequirementConnectButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useRequirement from "components/[guild]/hooks/useRequirement"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { SearchableListDialog } from "requirements/common/SearchableListDialog"
import { useDebounceValue } from "usehooks-ts"
import { isAddress } from "viem"

function HiddenAllowlistText({ isEmail }: { isEmail: boolean }) {
  return (
    <span className="font-normal text-xs">
      {`Allowlisted ${isEmail ? " email" : ""} addresses are hidden`}
    </span>
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

  const [search, setSearch] = useDebounceValue("", 500)

  const {
    addresses: initialAddresses,
    hideAllowlist,
    addressCount,
    fileId,
  } = castedRequirement.data

  const { data: req, isValidating: isSearchingAddresses } = useRequirement(
    castedRequirement?.roleId,
    castedRequirement?.id,
    search
  )

  const addresses = req?.data?.addresses ?? initialAddresses

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
      image={<ListPlus weight="bold" className="size-6" />}
      footer={
        isEmail ? (
          <>
            {!hasAccess && <RequirementConnectButton />}
            {hideAllowlist && <HiddenAllowlistText isEmail={isEmail} />}
          </>
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
        <SearchableListDialog
          trigger={
            <Button
              variant="unstyled"
              className="h-auto p-0 underline-offset-2 hover:underline"
              rightIcon={<ArrowSquareOut weight="bold" />}
            >
              {`${isEmail ? "email " : ""}allowlist`}
            </Button>
          }
          initialList={addresses}
          title={isEmail ? "Email allowlist" : "Allowlist"}
          isLoading={isSearchingAddresses}
          footer={
            shouldShowSearchHints && (
              <p className="text-muted-foreground">
                Showing <strong>{addresses.length}</strong>{" "}
                {isEmail ? "email " : " "}
                addresses from <strong>{addressCount}</strong>. Search to see if an
                address is included.
              </p>
            )
          }
          onSearchChange={setSearch}
        />
      )}
    </Requirement>
  )
}

export default AllowlistRequirement
