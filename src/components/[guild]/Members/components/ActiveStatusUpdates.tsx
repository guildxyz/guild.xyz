import { Alert, AlertIcon, AlertTitle, Collapse, Progress } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useState } from "react"
import useSWR from "swr"

type RoleStatus = {
  status: "CREATED" | "STARTED" | "STOPPED" | "FINISHED" | "FAILED"
  progress: {
    total: number
    accessCheckDone: number
    actionsDone: number
    failed: number
  }
}

type Response = RoleStatus[]

const ActiveStatusUpdates = () => {
  const { id } = useGuild()
  const [isActive, setIsActive] = useState(false)

  const { data, isValidating } = useSWR<Response>(`/statusUpdate/guild/${id}`, {
    refreshInterval: isActive && 1000,
    onSuccess: (res) => {
      if (res[0].status === "CREATED" || res[0].status === "STARTED")
        setIsActive(true)
      else setIsActive(false)
    },
  })

  const d = data?.[0]
  const { accessCheckDone, total, failed } = d?.progress ?? {}

  return (
    <Collapse in={isActive}>
      <Alert status="info" pos="relative" pb="6">
        <AlertIcon mt="0" />
        <AlertTitle>{`Syncing ${accessCheckDone}/${total} members. Failed: ${failed}`}</AlertTitle>
        <Progress
          value={total / accessCheckDone}
          colorScheme="blue"
          pos="absolute"
          bottom="0"
          left="0"
          right="0"
          size="sm"
        />
      </Alert>
    </Collapse>
  )
}

export default ActiveStatusUpdates
