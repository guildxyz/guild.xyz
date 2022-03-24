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
  const { holders, isLoading, inaccuracy, usedLogic } = useBalancy()

  const logic = useWatch({ name: "logic" })

  return (
    <HStack spacing={4}>
      {typeof holders === "number" ? (
        <HStack>
          {inaccuracy > 0 && (
            <Tooltip
              label={`We couldn't calculate holders for ${inaccuracy} requirement${
                inaccuracy > 1 ? "s" : ""
              }.`}
            >
              <Warning color="gray" />
            </Tooltip>
          )}
          <Text size="sm" color="gray" fontWeight="semibold">
            {inaccuracy > 0 ? (usedLogic === "OR" ? "at least" : "at most") : ""}{" "}
            {isLoading ? <Spinner size="sm" color="gray" mx={2} /> : holders}{" "}
            {["NAND", "NOR"].includes(logic)
              ? `excluded address${holders > 1 ? "es" : ""}`
              : `potential member${holders > 1 ? "s" : ""}`}
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
      ) : (
        isLoading && <Spinner size="sm" color="gray" />
      )}
    </HStack>
  )
}

export default BalancyCounter
