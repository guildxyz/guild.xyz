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
      <AlertIcon />
      <Stack position="relative" top={1} spacing={1}>
        <AlertTitle>You can send 1 message per day</AlertTitle>
        <AlertDescription>{`You'll be able to send your next message at ${rateLimitEnd}`}</AlertDescription>
      </Stack>
    </Alert>
  )
}
export default MessagingRateLimitAlert
