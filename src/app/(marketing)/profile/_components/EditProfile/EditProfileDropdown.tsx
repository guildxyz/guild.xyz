import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import {
  ArrowsClockwise,
  DotsThreeVertical,
  TrashSimple,
} from "@phosphor-icons/react"
import useUser from "components/[guild]/hooks/useUser"
import { useFormContext } from "react-hook-form"
import { useDeleteProfile } from "../../_hooks/useDeleteProfile"

export const EditProfileDropdown = () => {
  const { farcasterProfiles } = useUser()
  const farcasterProfile = farcasterProfiles?.at(0)
  const deleteProfile = useDeleteProfile()
  const { setValue } = useFormContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="-bottom-2 absolute right-0 translate-y-full"
        asChild
      >
        <Button variant="ghost" size="icon-sm">
          <DotsThreeVertical weight="bold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {farcasterProfile && (
          <DropdownMenuItem
            className="flex gap-2 px-4 py-6 font-semibold"
            onClick={() => {
              if (farcasterProfile.avatar) {
                setValue("profileImageUrl", farcasterProfile.avatar, {
                  shouldValidate: true,
                })
              }
              if (farcasterProfile.username) {
                setValue("name", farcasterProfile.username, {
                  shouldValidate: true,
                })
              }
            }}
          >
            <ArrowsClockwise weight="bold" /> Fill data by Farcaster
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={deleteProfile.onSubmit}
          className="gap-2 px-4 py-6 font-semibold text-destructive-subtle-foreground"
        >
          <TrashSimple weight="bold" />
          Delete profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
