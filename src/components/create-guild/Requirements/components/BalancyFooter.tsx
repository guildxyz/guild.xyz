import { Spinner, Text } from "@chakra-ui/react"
import useBalancy from "../hooks/useBalancy"

const BalancyFooter = ({ index }) => {
  const { holders, isLoading } = useBalancy(index)

  if (typeof holders === "number")
    return (
      <Text color="gray" fontSize="sm" mr="auto">
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

  return isLoading && <Spinner color="gray" size="sm" mt={5} />
}

export default BalancyFooter
