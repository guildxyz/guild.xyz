import { Button } from "@/components/ui/Button"
import { FormField, FormItem } from "@/components/ui/Form"
import { Separator } from "@/components/ui/Separator"
import { useToast } from "@/components/ui/hooks/useToast"
import { Eyedropper, Image as ImageIcon } from "@phosphor-icons/react"
import usePinata from "hooks/usePinata"
import { ProfileBackgroundImageUploader } from "./ProfileBackgroundImageUploader"
import { ProfileColorPicker } from "./ProfileColorPicker"

export const EditProfileBanner = () => {
  const { toast } = useToast()

  // todo: move this up to the wrapper component & disable the save button while loading
  const backgroundUploader = usePinata({
    fieldToSetOnSuccess: "backgroundImageUrl",
    onError: (err) =>
      toast({
        variant: "error",
        title: "Error",
        description: err,
      }),
  })

  return (
    <FormField
      name="backgroundImageUrl"
      render={({ field }) => (
        <FormItem className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border-muted">
          <div className="absolute inset-0 flex size-full items-center">
            {field.value?.startsWith("http") || field.value?.startsWith("/") ? (
              <img
                src={field.value}
                alt="profile background"
                style={{
                  filter: "brightness(50%)",
                }}
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
      )}
    />
  )
}
