import { Center, Collapse, HStack, Stack, StackProps, Text } from "@chakra-ui/react"
import { PropsWithChildren, ReactNode } from "react"
import JoinStepIndicator from "../../JoinStepIndicator"

type Props = {
  title: string
  countLabel: string
  fallbackText: string | JSX.Element
  status: "INACTIVE" | "LOADING" | "NO_ACCESS" | "DONE"
  total?: number
  current?: number
  waitingPosition?: number
  RightComponent?: ReactNode
}

const ProgressJoinStep = ({
  title,
  countLabel,
  fallbackText,
  status,
  total,
  current,
  waitingPosition,
  RightComponent,
  ...stackProps
}: PropsWithChildren<Props> & StackProps) => (
  <HStack py="2.5" alignItems={"flex-start"} spacing={2.5} {...stackProps}>
    <Center h={status === "INACTIVE" ? 6 : "44px"}>
      <JoinStepIndicator
        status={status === "LOADING" && current && total ? "PROGRESS" : status}
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        progress={(current / total) * 100}
      />
    </Center>

    <Stack w="full" spacing={0}>
      <Text fontWeight={"bold"}>{title}</Text>

      {status !== "INACTIVE" &&
        (typeof total === "number" && typeof current === "number" ? (
          <Text>{`${current}/${total} ${countLabel}`}</Text>
        ) : (
          <Text colorScheme="gray">{fallbackText}</Text>
        ))}

      <Collapse in={status === "LOADING" && !!waitingPosition}>
        <Text colorScheme={"gray"}>
          {`There are a lot of users joining right now, so you have to wait a bit. There are ${waitingPosition} users ahead of you. Feel free to close the site and come back later!`}
        </Text>
      </Collapse>
    </Stack>
    {RightComponent}
  </HStack>
)

export default ProgressJoinStep
