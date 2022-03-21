import {
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Link from "components/common/Link"
import { Question, Warning } from "phosphor-react"
import { useWatch } from "react-hook-form"
import useBalancy from "../hooks/useBalancy"

const BalancyCounter = () => {
  const { holders, isLoading, unsupportedTypes, isInaccurate, unsupportedChains } =
    useBalancy()

  const logic = useWatch({ name: "logic" })

  return (
    <HStack spacing={4}>
      {isLoading && <Spinner size="sm" color="gray" />}

      {typeof holders === "number" && (
        <HStack>
          {isInaccurate && (
            <Tooltip
              label={`Calculations may be inaccurate. We couldn't calculate eligible addresses for ${
                unsupportedTypes.length > 0
                  ? `${
                      unsupportedTypes.length > 1
                        ? "these requitement types"
                        : "this requirement type"
                    }: ${unsupportedTypes.join(", ")}${
                      unsupportedChains.length > 0 ? ", and " : ""
                    }`
                  : ""
              }${
                unsupportedChains.length > 0
                  ? `${
                      unsupportedChains.length > 1 ? "these chains" : "this chain"
                    }: ${unsupportedChains.join(", ")}`
                  : ""
              }.`}
            >
              <Warning color="gray" />
            </Tooltip>
          )}
          <Text size="sm" color="gray" fontWeight="semibold">
            {isInaccurate ? (logic === "OR" ? ">" : "<") : ""} {holders} eligible
            addresses
          </Text>
          <Popover trigger="hover" openDelay={0}>
            <PopoverTrigger>
              <Question color="gray" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Text>
                  Number of addresses meeting the requirements for your guild.
                </Text>
                <Text>
                  Powered by{" "}
                  <Link
                    href="https://twitter.com/balancy_io"
                    target="_blank"
                    fontWeight="semibold"
                    colorScheme="twitter"
                  >
                    <a>Balancy</a>
                  </Link>
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      )}
    </HStack>
  )
}

export default BalancyCounter
