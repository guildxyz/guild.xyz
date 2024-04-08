import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"
import { DAY_IN_MS } from "utils/formatRelativeTimeFromNow"

type Props = {
  latestMessageCreatedAt: number
}

const MessagingRateLimitAlert = ({ latestMessageCreatedAt }: Props) => {
  const rateLimitEnd = new Date(
    latestMessageCreatedAt + DAY_IN_MS
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })

  return (
    <Alert status="info">
      <AlertIcon mt="-1px" />
      <Stack spacing={1}>
        <AlertTitle>You can only send one message per day</AlertTitle>
        <AlertDescription>{`You'll be able to send your next message on ${rateLimitEnd}`}</AlertDescription>
      </Stack>
    </Alert>
  )
}
export default MessagingRateLimitAlert
