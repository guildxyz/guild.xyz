import { cn } from "@/lib/utils"
import { Question } from "@phosphor-icons/react/dist/ssr"
import { Fragment } from "react"
import { Role } from "types"
import { LogicDivider } from "../LogicDivider"
import useRequirements from "../hooks/useRequirements"
import AnyOfHeader from "./components/AnyOfHeader"
import { HiddenRequirementAccessIndicator } from "./components/HiddenRequirementAccessIndicator"
import RequirementComponent, { RequirementSkeleton } from "./components/Requirement"
import RequirementDisplayComponent from "./components/RequirementDisplayComponent"

type Props = {
  role: Role
  isOpen: boolean
}

const RoleRequirements = ({ role, isOpen }: Props) => {
  const { data: requirements, isLoading } = useRequirements(role?.id)

  return (
    <div
      className={cn(
        "custom-scrollbar scroll-shadow flex flex-col overflow-y-auto opacity-0",
        {
          "opacity-100": isOpen,
        }
      )}
      inert={!isOpen}
    >
      {role.logic === "ANY_OF" && <AnyOfHeader anyOfNum={role.anyOfNum} />}
      <div className="flex flex-col p-5 pt-0">
        {isLoading && !requirements ? (
          <RoleRequirementsSkeleton />
        ) : (
          <div className="flex flex-col">
            {requirements?.map((requirement, i) => (
              <div
                className={cn(
                  "w-full translate-y-2 animate-in opacity-0 transition-all duration-200",
                  {
                    "translate-y-0 opacity-100": isOpen,
                  }
                )}
                style={{
                  transitionDelay: `${i * 0.1}s`,
                }}
                key={i}
              >
                <RequirementDisplayComponent requirement={requirement} />
                {i < requirements?.length - 1 && <LogicDivider logic={role.logic} />}
              </div>
            ))}
            {(role.hiddenRequirements || requirements?.length === 0) && (
              <div
                className={cn(
                  "w-full translate-y-2 animate-in opacity-0 transition-all duration-200",
                  {
                    "translate-y-0 opacity-100": isOpen,
                  }
                )}
                style={{
                  transitionDelay: `${(requirements?.length ?? 0) * 0.1}s`,
                }}
              >
                {(requirements?.length ?? 0) > 0 && (
                  <LogicDivider logic={role.logic} />
                )}
                <SomeSecretRequirements roleId={role.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const SomeSecretRequirements = ({ roleId }: { roleId: number }) => (
  <RequirementComponent
    image={<Question weight="bold" className="size-5" />}
    rightElement={<HiddenRequirementAccessIndicator roleId={roleId} />}
  >
    Some secret requirements
  </RequirementComponent>
)

const RoleRequirementsSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <Fragment key={i}>
        <RequirementSkeleton key={i} />
        {i !== 2 && <LogicDivider logic="ANY_OF" />}
      </Fragment>
    ))}
  </>
)

export { RoleRequirements, RoleRequirementsSkeleton }
