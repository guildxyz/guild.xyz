import { Text } from "@chakra-ui/react"

type Props = {
  wrap?: boolean
}

const DotDelimiter = ({ wrap = false }: Props): JSX.Element => {
  return (
    <>
      <Text
        as="span"
        display={{ base: wrap ? "none" : "inline", sm: "inline" }}
      >{` • `}</Text>
      <Text as="span" display={{ base: wrap ? "inline" : "none", sm: "none" }}>
        <br />
      </Text>
    </>
  )
}

export default DotDelimiter
