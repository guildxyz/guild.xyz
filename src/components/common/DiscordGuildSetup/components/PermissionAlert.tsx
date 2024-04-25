import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  Box,
  Collapse,
} from "@chakra-ui/react"
import { atom, useAtomValue } from "jotai"

export const shouldShowPermissionAlertAtom = atom(false)

export default function PermissionAlert(props: AlertProps) {
  const shouldShowPermissionAlert = useAtomValue(shouldShowPermissionAlertAtom)

  return (
    // Not sure what the exact reason if, but without a Box wrapper, it had invalid height
    <Box>
      <Collapse in={shouldShowPermissionAlert} autoFocus>
        <Alert status="warning" alignItems={"center"} {...props}>
          <AlertIcon />
          <AlertDescription>
            Try adding the bot again, and make sure to allow all requested
            permissions
          </AlertDescription>
        </Alert>
      </Collapse>
    </Box>
  )
}
