import { Badge } from "@/components/ui/Badge"

const OrderStatusBadge = ({
  status,
  createdAt,
}: { status: string; createdAt: string }) => {
  const pendingFailed = () => {
    const timeDiff = new Date().getTime() - new Date(createdAt).getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      return true
    }
    return false
  }

  if (status === "pending" && !pendingFailed()) {
    return <Badge colorScheme="blue">Pending</Badge>
  }

  if (status === "successful") {
    return <Badge colorScheme="green">Successful</Badge>
  }

  if (status === "failed" || (status === "pending" && pendingFailed())) {
    return <Badge colorScheme="red">Failed</Badge>
  }

  return <Badge colorScheme="gray">Unknown</Badge>
}

export default OrderStatusBadge
