import { Alert, AlertDescription, AlertIcon, Box, Stack } from "@chakra-ui/react"
import Layout from "components/common/Layout"

type Props = {
  title: string
}

const NotConnectedError = ({ title }: Props): JSX.Element => (
  <Box>
    <Layout title={title}>
      <Alert status="error" mb="6">
        <AlertIcon />
        <Stack>
          <AlertDescription position="relative" top={1}>
            Please connect your wallet in order to continue!
          </AlertDescription>
        </Stack>
      </Alert>
    </Layout>
  </Box>
)

export default NotConnectedError
