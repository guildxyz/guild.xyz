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
  role?: Role // Role can be undefined when the role is private
  isRoleLoading?: boolean // In some cases we want to control the loading state from outside of the component
  isOpen: boolean
  withScroll?: boolean
  className?: string
}

const RoleRequirements = ({
  role,
  isOpen,
  withScroll,
  isRoleLoading,
  className,
}: Props) => {
  const { data: requirements, isLoading } = useRequirements(role?.id)

  return (
    <div
      className={cn(
        "custom-scrollbar flex w-full flex-grow basis-80 flex-col overflow-y-auto opacity-0 md:basis-0",
        {
          "opacity-100": isOpen,
          "basis-full": (requirements?.length ?? 0) < 3,
          "scroll-shadow": withScroll,
        },
        className
      )}
      // boolean values didn't work, I guess that's a bug
      inert={!isOpen ? ("true" as unknown as boolean) : undefined}
    >
      {role?.logic === "ANY_OF" && <AnyOfHeader anyOfNum={role.anyOfNum} />}
      <div className="flex flex-col p-5 pt-0">
        {/* If the role is private, we can't display the requirements */}
        {!role && !isRoleLoading ? (
          <SomeSecretRequirements />
        ) : isRoleLoading || (isLoading && !requirements) ? (
          <RoleRequirementsSkeleton />
        ) : (
          <div className="flex flex-col">
            {requirements?.map((requirement, i) => (
              <div
                className={cn(
                  "w-full translate-y-2 opacity-0 transition-all duration-200",
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
                {i < requirements?.length - 1 && (
                  <LogicDivider logic={role?.logic ?? "AND"} />
                )}
              </div>
            ))}
            {(role?.hiddenRequirements || requirements?.length === 0) && (
              <div
                className={cn(
                  "w-full translate-y-2 opacity-0 transition-all duration-200",
                  {
                    "translate-y-0 opacity-100": isOpen,
                  }
                )}
                style={{
                  transitionDelay: `${(requirements?.length ?? 0) * 0.1}s`,
                }}
              >
                {(requirements?.length ?? 0) > 0 && (
                  <LogicDivider logic={role?.logic ?? "AND"} />
                )}
                {role && <SomeSecretRequirements roleId={role.id} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const SomeSecretRequirements = ({ roleId }: { roleId?: number }) => (
  <RequirementComponent
    image={<Question weight="bold" className="size-5" />}
    rightElement={
      roleId ? <HiddenRequirementAccessIndicator roleId={roleId} /> : undefined
    }
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
