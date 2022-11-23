import { Box, Heading, SimpleGrid, Stack, Text, Textarea } from "@chakra-ui/react"
import Header from "components/common/Layout/components/Header"
import { useMemo, useState } from "react"

const Page = (): JSX.Element => {
  const [json, setJson] = useState("")

  const parsedJson = useMemo(() => {
    if (!json) return null

    let newParsedJson
    try {
      newParsedJson = JSON.parse(json)
    } catch (_) {}

    return newParsedJson
  }, [json])

  console.log("parsedJson", parsedJson)

  return (
    <>
      <Header />
      <SimpleGrid columns={2}>
        <Box p={2} w="full" h="calc(100vh - var(--chakra-space-16))">
          <Textarea
            w="full"
            h="full"
            resize="none"
            placeholder="Paste layout JSON here"
            onChange={(e) => setJson(e.target.value)}
          />
        </Box>

        <Stack spacing={8} p={2}>
          <Stack spacing={4}>
            <Heading as="h2" fontSize={24} fontFamily="display">
              Requirement form
            </Heading>

            <Text>Todo</Text>
          </Stack>

          <Stack spacing={4}>
            <Heading as="h2" fontSize={24} fontFamily="display">
              Requirement list
            </Heading>

            <Text>Todo</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </>
  )
}

export default Page
