import { Button } from "@/components/ui/Button"
import { FormField, FormItem } from "@/components/ui/Form"
import { Separator } from "@/components/ui/Separator"
import { Eyedropper, Image as ImageIcon } from "@phosphor-icons/react"
import { Uploader } from "hooks/usePinata/usePinata"
import { ProfileBackgroundImageUploader } from "./ProfileBackgroundImageUploader"
import { ProfileColorPicker } from "./ProfileColorPicker"

export const EditProfileBanner = ({
  backgroundUploader,
}: { backgroundUploader: Uploader }) => (
  <FormField
    name="backgroundImageUrl"
    render={({ field }) => {
      const isImage = field.value?.startsWith("http") || field.value?.startsWith("/")

      return (
        <FormItem className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border-muted">
          <div className="absolute inset-0 flex size-full items-center">
            {isImage ? (
              <img
                src={field.value}
                alt="profile background"
                style={{
                  filter: "brightness(50%)",
                }}
                className="size-full object-cover"
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
            <ProfileBackgroundImageUploader
              uploader={backgroundUploader}
              size="icon"
              variant="ghost"
              tooltipLabel={isImage ? "Change image" : "Upload image"}
              className="text-white"
            >
              <ImageIcon weight="bold" size={24} />
            </ProfileBackgroundImageUploader>

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
      )
    }}
  />
)
