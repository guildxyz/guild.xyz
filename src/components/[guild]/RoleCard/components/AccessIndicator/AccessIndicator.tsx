import { accountModalAtom } from "@/components/Providers/atoms"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { cn } from "@/lib/utils"
import {
  CaretDown,
  Check,
  LockSimple,
  Warning,
  X,
} from "@phosphor-icons/react/dist/ssr"
import { useOpenJoinModal } from "components/[guild]/JoinModal/JoinModalProvider"
import RecheckAccessesButton from "components/[guild]/RecheckAccessesButton"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import useMembership, {
  useRoleMembership,
} from "components/explorer/hooks/useMembership"
import { useSetAtom } from "jotai"
import { useMediaQuery } from "usehooks-ts"
import {
  ACCESS_INDICATOR_CLASSNAME,
  AccessIndicatorUI,
} from "./components/AccessIndicatorUI"

type Props = {
  roleId: number
  isOpen: boolean
  onToggle: () => void
}

const AccessIndicator = ({ roleId, isOpen, onToggle }: Props): JSX.Element => {
  const { roles } = useGuild()
  const role = roles?.find((r) => r.id === roleId)
  const { error, isValidating, reqAccesses, hasRoleAccess } =
    useRoleMembership(roleId)

  const accessedRequirementCount = reqAccesses?.filter((r) => r.access)?.length

  const setIsAccountModalOpen = useSetAtom(accountModalAtom)
  const { isMember } = useMembership()
  const openJoinModal = useOpenJoinModal()
  const isMobile = useMediaQuery("(max-width: 640px")

  const { data: requirements } = useRequirements(roleId)
  const requirementsWithErrors =
    requirements?.filter((req) => {
      const relevantReq = reqAccesses?.find((r) => r.requirementId === req.id)
      return !relevantReq?.access && !!relevantReq?.errorMsg
    }) ?? []

  if (!isMember)
    return (
      <Button
        leftIcon={!isMobile && <LockSimple weight="bold" className="size-[0.9em]" />}
        rightIcon={isMobile && <LockSimple weight="bold" className="size-[0.9em]" />}
        size="sm"
        onClick={openJoinModal}
        className={ACCESS_INDICATOR_CLASSNAME}
      >
        Join Guild to check access
      </Button>
    )

  if (hasRoleAccess)
    return (
      <div className="flex shrink-0">
        <AccessIndicatorUI
          colorScheme="green"
          label="You have access"
          icon={<Check weight="bold" />}
          className="max-w-none flex-grow rounded-br-none md:rounded-tr-none"
        />
        <Separator
          orientation="vertical"
          className="h-8 bg-success-subtle-foreground/25 dark:bg-white/25"
        />
        <Button
          size="sm"
          rightIcon={
            <CaretDown
              weight="bold"
              className={cn("transform duration-300", {
                "-rotate-180": isOpen,
              })}
            />
          }
          onClick={onToggle}
          className={cn(
            ACCESS_INDICATOR_CLASSNAME,
            "!rounded-tl-none rounded-br-2xl rounded-bl-none md:rounded-br-lg"
          )}
        >
          <div
            className={cn(
              "-mr-1.5 w-0 overflow-hidden text-left transition-all duration-200",
              {
                "mr-1.5 w-[5.25rem]": !isOpen,
              }
            )}
          >
            View details
          </div>
        </Button>
      </div>
    )

  if (isValidating)
    return <AccessIndicatorUI colorScheme="gray" label="Checking access" isLoading />

  if (
    reqAccesses?.some(
      (err) =>
        err.errorType === "PLATFORM_CONNECT_INVALID" ||
        err.errorType === "PLATFORM_NOT_CONNECTED"
    )
  )
    return (
      <Button
        colorScheme="info"
        variant="subtle"
        size="sm"
        leftIcon={<LockSimple weight="bold" />}
        onClick={() => setIsAccountModalOpen(true)}
        className={ACCESS_INDICATOR_CLASSNAME}
      >
        Reconnect needed to check access
      </Button>
    )

  if (requirementsWithErrors?.length > 0 || error)
    return (
      <div className="flex shrink-0">
        <AccessIndicatorUI
          colorScheme="orange"
          label="Couldn't check access"
          icon={<Warning weight="bold" />}
          className="max-w-none flex-grow rounded-br-none md:rounded-tr-none"
        />
        <Separator orientation="vertical" className="h-8 dark:bg-white/25" />
        <RecheckAccessesButton
          roleId={roleId}
          size="sm"
          h="8"
          // {...ACCESS_INDICATOR_STYLES}
          {...{
            flexShrink: 0,
            borderRadius: "lg",
            borderTopRadius: { base: 0, md: "lg" },
            justifyContent: { base: "space-between", md: "start" },
            px: { base: 5, md: 3 },
            py: { base: 2, md: 0 },
          }}
          borderTopLeftRadius="0 !important"
          borderBottomLeftRadius="0 !important"
          // Card's `overflow: clip` isn't enough in Safari
          borderBottomRightRadius={{ base: "2xl", md: "lg" }}
        />
      </div>
    )

  return (
    <div className="flex shrink-0">
      <AccessIndicatorUI
        colorScheme="gray"
        label={`No access${
          role?.logic === "ANY_OF" && typeof accessedRequirementCount === "number"
            ? ` (${accessedRequirementCount}/${role?.anyOfNum})`
            : ""
        }`}
        icon={<X weight="bold" />}
        className="max-w-none flex-grow rounded-br-none md:rounded-tr-none"
      />
      <Separator orientation="vertical" className="h-8 dark:bg-white/25" />
      <RecheckAccessesButton
        roleId={roleId}
        size="sm"
        h="8"
        // {...ACCESS_INDICATOR_STYLES}
        {...{
          flexShrink: 0,
          borderRadius: "lg",
          borderTopRadius: { base: 0, md: "lg" },
          justifyContent: { base: "space-between", md: "start" },
          px: { base: 5, md: 3 },
          py: { base: 2, md: 0 },
        }}
        borderTopLeftRadius="0 !important"
        borderBottomLeftRadius="0 !important"
        // Card's `overflow: clip` isn't enough in Safari
        borderBottomRightRadius={{ base: "2xl", md: "lg" }}
      />
    </div>
  )
}

export { AccessIndicator }
