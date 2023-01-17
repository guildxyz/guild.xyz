import { Spinner, Text } from "@chakra-ui/react"
import { useWatch } from "react-hook-form"
import useBalancy from "../hooks/useBalancy"

const BalancyFooter = ({ baseFieldPath }) => {
  const { holders, isLoading } = useBalancy(baseFieldPath)
  const requirement = useWatch({ name: baseFieldPath })

  if (typeof holders === "number")
    return (
      <Text color="gray" fontSize="sm">
        {isLoading ? (
          <Spinner color="gray" size="xs" mx={1} />
        ) : (
          <Text as="span" fontWeight={"medium"}>
            {holders}
          </Text>
        )}{" "}
        {`${holders > 1 ? "addresses" : "address"} ${
          /**
           * "excluded by" isn't displayed right now normally because negated
           * requirements get filtered in useBalancy, but will be in the future
           */
          requirement.isNegated
            ? "excluded by"
            : holders > 1
            ? "satisfy"
            : "satisfies"
        } this requirement`}
      </Text>
    )

  return (
    isLoading && (
      <Text color={"gray"} fontSize="sm">
        <Spinner size="xs" mr="2" mb="-1px" />
        <span>loading eligible addresses</span>
      </Text>
    )
  )
}

export default BalancyFooter
