import { Spinner, Text } from "@chakra-ui/react"
import useBalancy from "../hooks/useBalancy"

const BalancyFooter = ({ baseFieldPath }) => {
  const { holders, isLoading } = useBalancy(baseFieldPath)

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
          holders > 1 ? "satisfy" : "satisfies"
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
