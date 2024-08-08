import { Button } from "@/components/ui/Button"
import { ColorPicker } from "@/components/ui/ColorPicker"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Eyedropper } from "@phosphor-icons/react"
import { useFormContext, useWatch } from "react-hook-form"
import getColorByImage from "utils/getColorByImage"

export const ProfileColorPicker = () => {
  const { setValue } = useFormContext()

  const profileImageUrl = useWatch({ name: "profileImageUrl" })

  const setColorByProfilePic = async () => {
    const color = await getColorByImage(profileImageUrl)
    setValue("backgroundImageUrl", color)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant="ghost">
          <Eyedropper weight="bold" size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="font-normal">
          <ColorPicker fieldName="backgroundImageUrl" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="mt-2 flex items-center gap-2 px-4 font-semibold"
          onClick={setColorByProfilePic}
        >
          <Eyedropper weight="bold" className="size-4" />
          Get color from profile pic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
