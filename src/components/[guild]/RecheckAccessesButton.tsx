import {
  ButtonProps,
  Divider,
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { ArrowsClockwise, Check } from "phosphor-react"
import { useEffect, useState } from "react"
import GetRewardsJoinStep from "./JoinModal/components/progress/GetRewardsJoinStep"
import GetRolesJoinStep from "./JoinModal/components/progress/GetRolesJoinStep"
import SatisfyRequirementsJoinStep from "./JoinModal/components/progress/SatisfyRequirementsJoinStep"
import useMembershipUpdate from "./JoinModal/hooks/useMembershipUpdate"
import { useIsTabsStuck } from "./Tabs/Tabs"
import { useThemeContext } from "./ThemeContext"
import useGuild from "./hooks/useGuild"

const TIMEOUT = 60_000

type Props = {
  tooltipLabel?: string
} & ButtonProps

const latestResendDateAtom = atomWithStorage("latestResendDate", -Infinity)

const RecheckAccessesButton = ({
  tooltipLabel = "Re-check accesses",
  ...rest
}: Props): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { urlName } = useGuild()

  const [latestResendDate, setLatestResendDate] = useAtom(latestResendDateAtom)
  const [dateNow, setDateNow] = useState(Date.now())
  const canResend = dateNow - latestResendDate > TIMEOUT

  const { triggerMembershipUpdate, isLoading, isFinished, joinProgress } =
    useMembershipUpdate(
      () => {
        toast({
          status: "success",
          title: "Successfully updated accesses",
        })
        setLatestResendDate(Date.now())
      },
      (error) => {
        const errorMsg = "Couldn't update accesses"
        const correlationId = error.correlationId
        showErrorToast(
          correlationId
            ? {
                error: errorMsg,
                correlationId,
              }
            : errorMsg
        )
      }
    )

  useEffect(() => {
    const interval = setInterval(() => setDateNow(Date.now()), TIMEOUT)
    return () => clearInterval(interval)
  }, [])

  const onClick = () => {
    triggerMembershipUpdate()
    captureEvent("Click: ResendRewardButton", {
      guild: urlName,
    })
  }

  return (
    <Popover trigger="hover" placement="bottom" isLazy>
      <PopoverTrigger>
        <IconButton
          aria-label="Re-check accesses"
          icon={
            isFinished ? (
              <Check />
            ) : (
              <Icon
                as={ArrowsClockwise}
                animation={isLoading ? "rotate 1s infinite linear" : undefined}
              />
            )
          }
          onClick={!isFinished && canResend ? onClick : undefined}
          isDisabled={isLoading || !!isFinished || !canResend}
          sx={{
            "@-webkit-keyframes rotate": {
              from: {
                transform: "rotate(0)",
              },
              to: {
                transform: "rotate(360deg)",
              },
            },
            "@keyframes rotate": {
              from: {
                transform: "rotate(0)",
              },
              to: {
                transform: "rotate(360deg)",
              },
            },
          }}
          {...rest}
        />
      </PopoverTrigger>
      <PopoverContent {...(!isLoading ? { minW: "max-content", w: "unset" } : {})}>
        {/* causes problems in the RequirementAccessIndicator popover, so just uncommented for now */}
        {/* <PopoverArrow />  */}
        {isFinished ? (
          <PopoverHeader fontWeight={"medium"} border={0}>
            Successfully updated accesses
          </PopoverHeader>
        ) : isLoading ? (
          <PopoverBody>
            <VStack spacing={2.5} alignItems={"flex-start"} divider={<Divider />}>
              <SatisfyRequirementsJoinStep joinState={joinProgress} />

              <GetRolesJoinStep joinState={joinProgress} />

              <GetRewardsJoinStep joinState={joinProgress} />
            </VStack>
          </PopoverBody>
        ) : canResend ? (
          <PopoverHeader fontWeight={"medium"} border={0}>
            {tooltipLabel}
          </PopoverHeader>
        ) : (
          <PopoverHeader fontWeight={"medium"} border={0}>
            You can only use this function once per minute
          </PopoverHeader>
        )}
      </PopoverContent>
    </Popover>
  )
  // return (
  //   <Popover trigger="hover" /* isOpen={isLoading ? undefined : false} */>
  //     <Tooltip
  //       label={
  //         isFinished
  //           ? "Successfully updated accesses"
  //           : canResend
  //           ? tooltipLabel
  //           : "You can only use this function once per minute"
  //       }
  //       isDisabled={true}
  //       hasArrow
  //     >
  //       <Box>
  //         <PopoverTrigger>
  //           <IconButton
  //             aria-label="Re-check accesses"
  //             icon={
  //               isFinished ? (
  //                 <Check />
  //               ) : (
  //                 <Icon
  //                   as={ArrowsClockwise}
  //                   animation={isLoading ? "rotate 1s infinite linear" : undefined}
  //                 />
  //               )
  //             }
  //             onClick={!isFinished && canResend ? onClick : undefined}
  //             isDisabled={isLoading || !!isFinished || !canResend}
  //             sx={{
  //               "@-webkit-keyframes rotate": {
  //                 from: {
  //                   transform: "rotate(0)",
  //                 },
  //                 to: {
  //                   transform: "rotate(360deg)",
  //                 },
  //               },
  //               "@keyframes rotate": {
  //                 from: {
  //                   transform: "rotate(0)",
  //                 },
  //                 to: {
  //                   transform: "rotate(360deg)",
  //                 },
  //               },
  //             }}
  //             {...rest}
  //           />
  //         </PopoverTrigger>
  //       </Box>
  //     </Tooltip>
  //     <PopoverContent minW="max-content" w="unset">
  //       <PopoverArrow />
  //       <PopoverHeader border="0">
  //         {isFinished
  //           ? "Successfully updated accesses"
  //           : isLoading
  //           ? "Checking accesses"
  //           : canResend
  //           ? tooltipLabel
  //           : "You can only use this function once per minute"}
  //       </PopoverHeader>
  //       {isLoading && (
  //         <PopoverBody>
  //           <VStack spacing={2.5} alignItems={"flex-start"}>
  //             <SatisfyRequirementsJoinStep joinState={joinProgress} />

  //             <GetRolesJoinStep joinState={joinProgress} />

  //             <GetRewardsJoinStep joinState={joinProgress} />
  //           </VStack>
  //         </PopoverBody>
  //       )}
  //     </PopoverContent>
  //   </Popover>
  // )
}

const TopRecheckAccessesButton = () => {
  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <RecheckAccessesButton
      minW="44px"
      variant="ghost"
      rounded="full"
      tooltipLabel="Re-check accesses & send rewards"
      {...(!isStuck && {
        color: textColor,
        colorScheme: buttonColorScheme,
      })}
    />
  )
}

export default RecheckAccessesButton
export { TopRecheckAccessesButton }
