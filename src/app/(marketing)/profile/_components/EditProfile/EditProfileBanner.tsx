import { Button } from "@/components/ui/Button"
import { FormField, FormItem } from "@/components/ui/Form"
import { Separator } from "@/components/ui/Separator"
import { Eyedropper, Image as ImageIcon } from "@phosphor-icons/react"
import Image from "next/image"
import { ProfileColorPicker } from "./ProfileColorPicker"

export const EditProfileBanner = () => {
  return (
    <FormField
      name="backgroundImageUrl"
      render={({ field }) => (
        <FormItem className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border-muted">
          <div className="absolute inset-0 size-full">
            {field.value?.startsWith("http") || field.value?.startsWith("/") ? (
              <Image
                src={field.value}
                width={144}
                height={144}
                alt="profile background"
              />
            ) : (
              <div
                className={`size-full`}
                style={{
                  background: field.value ?? "black",
                  filter: "brightness(70%)",
                }}
              />
            )}
          </div>
          <div className="relative flex items-center gap-3">
            <Button size="icon" variant="ghost" className="text-white">
              <ImageIcon weight="bold" size={24} />
            </Button>
            <Separator orientation="vertical" className="h-6 w-0.5 bg-white/50" />
            <ProfileColorPicker>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-white"
              >
                <Eyedropper weight="bold" size={24} />
              </Button>
            </ProfileColorPicker>
          </div>
        </FormItem>
      )}
    />
  )
}
