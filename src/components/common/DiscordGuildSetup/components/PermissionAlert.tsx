import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  Collapse,
} from "@chakra-ui/react"
import { atom, useAtomValue } from "jotai"

export const shouldShowPermissionAlertAtom = atom(false)

export default function PermissionAlert(props: AlertProps) {
  const shouldShowPermissionAlert = useAtomValue(shouldShowPermissionAlertAtom)

  return (
    <Collapse
      in={shouldShowPermissionAlert}
      autoFocus
      style={{
        flexShrink: 0,
      }}
    >
      <Alert status="warning" alignItems="center" {...props}>
        <AlertIcon />
        <AlertDescription>
          Try adding the bot again, and make sure to grant all requested permissions
        </AlertDescription>
      </Alert>
    </Collapse>
  )
}
