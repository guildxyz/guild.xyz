import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  ChakraProps,
  Stack,
} from "@chakra-ui/react"

type Props = {
  label: string
  description?: string
} & ChakraProps

const ErrorAlert = ({ label, description, ...chakraProps }: Props) => (
  <Alert status="error" mb="6" pb="5" {...chakraProps}>
    <AlertIcon />
    <Stack>
      <AlertTitle position="relative" top={"4px"} fontWeight="semibold">
        {label}
      </AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Stack>
  </Alert>
)

export default ErrorAlert
