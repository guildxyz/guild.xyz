import { ButtonProps, buttonVariants } from "@/components/ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { useToast } from "@/components/ui/hooks/useToast"
import { UploadSimple } from "@phosphor-icons/react"
import Button from "components/common/Button"
import useDropzone from "hooks/useDropzone"
import { Uploader } from "hooks/usePinata/usePinata"
import { PropsWithChildren, useState } from "react"

type Props = {
  uploader: Uploader
  tooltipLabel: string
} & ButtonProps

export const ProfileBackgroundImageUploader = ({
  uploader: { isUploading, onUpload },
  children,
  tooltipLabel,
  ...buttonProps
}: PropsWithChildren<Props>): JSX.Element => {
  const [progress, setProgress] = useState<number>(0)
  const { toast } = useToast()
  const showErrorToast = (description: string) =>
    toast({
      variant: "error",
      title: "Couldn't upload image",
      description,
    })

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: false,
    onDrop: (accepted, fileRejections) => {
      setProgress(0)
      if (accepted.length > 0) {
        onUpload({ data: [accepted[0]], onProgress: setProgress })
      }
      if (fileRejections.length > 0)
        showErrorToast(fileRejections[0].errors[0].message)
    },
    onError: (err) => {
      showErrorToast(err.message)
    },
  })

  if (isUploading)
    return (
      <Button {...buttonProps} isDisabled>
        {(progress * 100).toFixed(0)}%
      </Button>
    )

  return (
    <Tooltip>
      <TooltipTrigger>
        <div {...getRootProps()} className={buttonVariants(buttonProps as any)}>
          <input {...getInputProps()} hidden />
          {isDragActive ? <UploadSimple weight="bold" size={24} /> : children}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltipLabel}</TooltipContent>
    </Tooltip>
  )
}
