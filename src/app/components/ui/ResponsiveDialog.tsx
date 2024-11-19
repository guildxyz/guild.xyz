import { useMediaQuery } from "foxact/use-media-query";
import { type ComponentProps, useCallback, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

const useIsMobile = () => useMediaQuery("(max-width: 640px)", false);

export const ResponsiveDialog = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: ComponentProps<typeof Dialog> & ComponentProps<typeof Drawer>) => {
  const [open, setOpen] = useState(openProp);

  const onOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (typeof onOpenChangeProp === "function") onOpenChangeProp(newOpen);
    },
    [onOpenChangeProp],
  );

  const isMobile = useIsMobile();

  if (isMobile)
    return <Drawer {...props} open={open} onOpenChange={onOpenChange} />;

  return <Dialog {...props} open={open} onOpenChange={onOpenChange} />;
};
ResponsiveDialog.displayName = "ResponsiveDialog";

export const ResponsiveDialogTrigger = (
  props: ComponentProps<typeof DialogTrigger> &
    ComponentProps<typeof DrawerTrigger>,
) => {
  const isMobile = useIsMobile();

  if (isMobile) return <DrawerTrigger {...props} />;

  return <DialogTrigger {...props} />;
};
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

export const ResponsiveDialogPortal = (
  props: ComponentProps<typeof DialogPortal> &
    ComponentProps<typeof DrawerPortal>,
) => {
  const isMobile = useIsMobile();

  if (isMobile) return <DrawerPortal {...props} />;

  return <DialogPortal {...props} />;
};
ResponsiveDialogPortal.displayName = "ResponsiveDialogPortal";

export const ResponsiveDialogOverlay = (
  props: ComponentProps<typeof DialogOverlay> &
    ComponentProps<typeof DrawerOverlay>,
) => {
  const isMobile = useIsMobile();

  if (isMobile) return <DrawerOverlay {...props} />;

  return <DialogOverlay {...props} />;
};
ResponsiveDialogOverlay.displayName = "ResponsiveDialogOverlay";

export const ResponsiveDialogContent = (
  props: ComponentProps<typeof DialogContent> &
    ComponentProps<typeof DrawerContent>,
) => {
  const isMobile = useIsMobile();

  if (isMobile) return <DrawerContent {...props} />;

  return <DialogContent {...props} />;
};
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

export const ResponsiveDialogCloseButton = ({
  children,
  asChild,
  ...props
}: ComponentProps<typeof DialogCloseButton> &
  ComponentProps<typeof DrawerClose>) => {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <DrawerClose {...props} asChild={asChild}>
        {children}
      </DrawerClose>
    );

  return <DialogCloseButton {...props} />;
};
ResponsiveDialogCloseButton.displayName = "ResponsiveDialogCloseButton";

export const ResponsiveDialogHeader = (
  props: ComponentProps<typeof DialogHeader> &
    ComponentProps<typeof DrawerHeader>,
) => {
  const isMobile = useIsMobile();

  if (isMobile) return <DrawerHeader {...props} />;

  return <DialogHeader {...props} />;
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

export const ResponsiveDialogTitle = (
  props: ComponentProps<typeof DialogTitle> &
    ComponentProps<typeof DrawerTitle>,
) => {
  const isMobile = useIsMobile();

  if (isMobile) return <DrawerTitle {...props} />;

  return <DialogTitle {...props} />;
};
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

export const ResponsiveDialogBody = DialogBody;
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";

export const ResponsiveDialogFooter = (
  props: ComponentProps<typeof DialogFooter> &
    ComponentProps<typeof DrawerFooter>,
) => {
  const isMobile = useIsMobile();

  if (isMobile) return <DrawerFooter {...props} />;

  return <DialogFooter {...props} />;
};
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";
