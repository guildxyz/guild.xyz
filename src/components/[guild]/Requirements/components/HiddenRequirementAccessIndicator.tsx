import { accountModalAtom } from "@/components/Providers/atoms"
import { Badge, BadgeProps } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/Collapsible"
import {
  ArrowSquareIn,
  CaretDown,
  Check,
  DotsThree,
  LockSimple,
  Warning,
  X,
} from "@phosphor-icons/react/dist/ssr"
import RecheckAccessesButton from "components/[guild]/RecheckAccessesButton"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import { useSetAtom } from "jotai"
import { ReactNode } from "react"
import capitalize from "utils/capitalize"
import RequirementAccessIndicatorUI from "./RequirementAccessIndicatorUI"

type Props = {
  roleId: number
}

const HiddenRequirementAccessIndicator = ({ roleId }: Props) => {
  const { roles } = useGuild()
  const role = roles.find((r) => r.id === roleId)
  const { reqAccesses, hasRoleAccess } = useRoleMembership(roleId)

  const { data: requirements } = useRequirements(roleId)
  const publicReqIds = requirements?.map((req) => req.id) ?? []

  if (!reqAccesses) return null

  const hiddenReqsAccessData =
    reqAccesses?.filter(
      (reqAccessData) => !publicReqIds.includes(reqAccessData.requirementId)
    ) ?? []

  const hiddenReqsErrorMessages = [
    ...new Set<string>(
      reqAccesses
        ?.filter(
          (req) =>
            !req.access &&
            !publicReqIds.includes(req.requirementId) &&
            !["PLATFORM_NOT_CONNECTED", "PLATFORM_CONNECT_INVALID"].includes(
              req.errorType
            ) &&
            !!req.errorMsg
        )
        ?.map((req) => req.errorMsg)
    ),
  ]

  const count = hiddenReqsAccessData.reduce(
    (acc, curr) => {
      if (curr.access) {
        acc.accessed += 1
        return acc
      }

      const reqError = reqAccesses?.find(
        (obj) =>
          obj.requirementId === curr.requirementId && !obj.access && !!obj.errorMsg
      )
      if (!reqError) {
        acc.notAccessed += 1
        return acc
      }

      if (
        ["PLATFORM_NOT_CONNECTED", "PLATFORM_CONNECT_INVALID"].includes(
          reqError.errorType
        )
      ) {
        acc.platformErrored += 1
        return acc
      }

      acc.errored += 1
      return acc
    },
    {
      accessed: 0,
      notAccessed: 0,
      platformErrored: 0,
      errored: 0,
    }
  )

  if (
    role.logic === "AND"
      ? count.accessed === hiddenReqsAccessData.length
      : role.logic === "ANY_OF"
        ? count.accessed >= role.anyOfNum
        : count.accessed > 0
  )
    return (
      <RequirementAccessIndicatorUI colorScheme="green" icon={Check}>
        <HiddenRequirementAccessIndicatorPopover
          count={count}
          errorMessages={hiddenReqsErrorMessages}
          roleId={roleId}
        />
      </RequirementAccessIndicatorUI>
    )

  if (count.platformErrored === hiddenReqsAccessData?.length)
    return (
      <RequirementAccessIndicatorUI
        colorScheme="blue"
        icon={LockSimple}
        isAlwaysOpen={!hasRoleAccess}
      >
        <HiddenRequirementAccessIndicatorPopover
          count={count}
          errorMessages={hiddenReqsErrorMessages}
          roleId={roleId}
        />
      </RequirementAccessIndicatorUI>
    )

  if (count.errored === hiddenReqsAccessData?.length)
    return (
      <RequirementAccessIndicatorUI
        colorScheme="orange"
        icon={Warning}
        isAlwaysOpen={!hasRoleAccess}
      >
        <HiddenRequirementAccessIndicatorPopover
          count={count}
          errorMessages={hiddenReqsErrorMessages}
          roleId={roleId}
        />
      </RequirementAccessIndicatorUI>
    )

  return (
    <RequirementAccessIndicatorUI
      colorScheme="gray"
      icon={count.notAccessed === hiddenReqsAccessData?.length ? X : DotsThree}
      isAlwaysOpen={!hasRoleAccess}
    >
      <HiddenRequirementAccessIndicatorPopover
        count={count}
        errorMessages={["OMG", "Oh no, anyway"]}
        roleId={roleId}
      />
    </RequirementAccessIndicatorUI>
  )
}

type HiddenRequirementAccessIndicatorPopoverProps = {
  count: {
    accessed: number
    notAccessed: number
    platformErrored: number
    errored: number
  }
  errorMessages: string[]
  roleId: number
}

const HiddenRequirementAccessIndicatorPopover = ({
  count,
  errorMessages,
  roleId,
}: HiddenRequirementAccessIndicatorPopoverProps) => {
  const setIsAccountModalOpen = useSetAtom(accountModalAtom)

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">
        Satisfaction of secret requirements with your connected accounts:
      </p>

      <CountAccessIndicatorUI
        count={count.accessed}
        colorScheme="green"
        icon={<Check weight="bold" />}
        label="satisfied"
      />
      <CountAccessIndicatorUI
        count={count.notAccessed}
        colorScheme="gray"
        icon={<X weight="bold" />}
        label="not satisfied"
      />
      <CountAccessIndicatorUI
        count={count.platformErrored}
        colorScheme="blue"
        icon={<LockSimple weight="bold" />}
        label="connect / reconnect needed"
        errorMessages={errorMessages}
      />
      <CountAccessIndicatorUI
        count={count.errored}
        colorScheme="orange"
        icon={<Warning weight="bold" />}
        label="couldn't check access"
        errorMessages={errorMessages}
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          rightIcon={<ArrowSquareIn weight="bold" />}
          onClick={() => setIsAccountModalOpen(true)}
        >
          View connections
        </Button>
        <RecheckAccessesButton roleId={roleId} size="sm" />
      </div>
    </div>
  )
}

type CountAccessIndicatorUIProps = {
  count: number
  colorScheme: BadgeProps["colorScheme"]
  icon: ReactNode
  label: string
  errorMessages?: string[]
}

const CountAccessIndicatorUI = ({
  count,
  colorScheme,
  icon,
  label,
  errorMessages,
}: CountAccessIndicatorUIProps) => {
  if (!count) return

  if (errorMessages?.length)
    return (
      <div className="flex w-full flex-col">
        <Collapsible>
          <CollapsibleTrigger className="group flex items-center gap-1.5">
            <Badge
              colorScheme={colorScheme}
              className="size-6 max-w-none shrink-0 justify-center p-0"
            >
              {icon}
            </Badge>

            <span>
              <span className="font-semibold">{count}</span>
              {` ${label}`}
            </span>

            <CaretDown
              weight="bold"
              className="group-[[data-state=open]]:-rotate-180 transfrom duration-200"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-0.5 pt-1 pl-9">
              <span className="font-bold text-muted-foreground text-xs uppercase">
                {count > 1 ? "Errors:" : "Error:"}
              </span>
              <ul className="text-sm">
                {errorMessages.map((msg, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <Warning weight="fill" className="text-muted-foreground" />
                    <span className="text-muted-foreground">{capitalize(msg)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )

  return (
    <div className="flex gap-1.5">
      <Badge
        className="size-6 max-w-none shrink-0 justify-center p-0"
        colorScheme={colorScheme}
      >
        {icon}
      </Badge>
      <p>
        <span className="font-semibold">{count}</span>
        {` ${label}`}
      </p>
    </div>
  )
}

export default HiddenRequirementAccessIndicator
