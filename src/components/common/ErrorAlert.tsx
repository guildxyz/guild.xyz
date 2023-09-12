import {
  Alert,
  AlertDescription,
  AlertIcon,
  ChakraProps,
  Stack,
} from "@chakra-ui/react"

type Props = {
  label: string
} & ChakraProps

const ErrorAlert = ({ label, ...chakraProps }: Props) => (
  <Alert status="error" mb="6" pb="5" {...chakraProps}>
    <AlertIcon />
    <Stack>
      <AlertDescription position="relative" top={1} fontWeight="semibold">
        {label}
      </AlertDescription>
    </Stack>
  </Alert>
)

export default ErrorAlert
