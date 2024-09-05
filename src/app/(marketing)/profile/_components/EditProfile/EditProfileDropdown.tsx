import FarcasterImage from "@/../static/socialIcons/farcaster.svg"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { DotsThreeVertical } from "@phosphor-icons/react"
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
        className="-bottom-3 absolute right-0 translate-y-full"
        asChild
      >
        <Button variant="ghost" size="icon">
          <DotsThreeVertical weight="bold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {farcasterProfile && (
          <DropdownMenuItem
            className="flex gap-2"
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
            <FarcasterImage /> Fill data by Farcaster
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="mt-2 text-destructive-subtle-foreground">
          Danger zone
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={deleteProfile.onSubmit}>
          Delete profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
