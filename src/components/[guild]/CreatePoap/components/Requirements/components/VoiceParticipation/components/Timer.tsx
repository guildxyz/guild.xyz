import { HStack, Icon, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Play, Stop } from "phosphor-react"
import { useEffect, useState } from "react"

const Timer = (): JSX.Element => {
  const [isActive, setIsActive] = useState(false)

  // Time in seconds
  const [time, setTime] = useState(0)

  // TODO: start the event on the backend
  const handleStart = () => {
    setIsActive(true)
  }

  // TODO: stop the event on the backend
  const handleStop = () => {
    setIsActive(false)
  }

  useEffect(() => {
    let interval

    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isActive])

  const formattedTime = new Date(time * 1000).toISOString().slice(11, 19)

  return (
    <HStack spacing={4}>
      <Button
        onClick={isActive ? handleStop : handleStart}
        leftIcon={<Icon as={isActive ? Stop : Play} />}
        colorScheme={isActive ? "red" : "indigo"}
      >
        {isActive ? "End event" : "Start event"}
      </Button>

      <Text as="span" fontFamily="display" fontSize="2xl" fontWeight="black">
        {formattedTime}
      </Text>
    </HStack>
  )
}

export default Timer
