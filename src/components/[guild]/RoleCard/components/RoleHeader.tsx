import { cn } from "@/lib/utils"
import { Visibility } from "components/[guild]/Visibility"
import GuildLogo from "components/common/GuildLogo"
import { PropsWithChildren } from "react"

const RoleHeader = ({ role, isOpen = true, children }: PropsWithChildren<any>) => (
  <div className="flex items-center gap-3 p-5">
    <div className="flex items-center gap-4">
      <GuildLogo imageUrl={role.imageUrl} size={{ base: "48px", md: "52px" }} />
      <div className="flex flex-wrap gap-2">
        <h3
          className={cn(
            "-mt-px break-words font-bold font-display text-xl leading-tight",
            {
              "line-clamp-1": !isOpen,
            }
          )}
        >
          {role.name}
        </h3>
        <Visibility
          visibilityRoleId={role.visibilityRoleId}
          entityVisibility={role.visibility}
        />
      </div>
    </div>
    {children}
  </div>
)

export { RoleHeader }
