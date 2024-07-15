"use client"

import {
  TOAST_ICONS,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast"
import { useToast } from "@/components/ui/hooks/useToast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const IconComponent = props.variant ? TOAST_ICONS[props.variant] : undefined

        return (
          <Toast key={id} {...props}>
            <div className="flex gap-2">
              {IconComponent && (
                <IconComponent
                  weight="fill"
                  className="size-5 text-[--toast-icon]"
                />
              )}

              <div className="-mt-0.5 flex flex-col gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
                {action && <div className="mt-1 flex gap-1">{action}</div>}
              </div>
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
