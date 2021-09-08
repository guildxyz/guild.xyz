import { Box, Heading, Stack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
}

const Section = ({ title, children }: PropsWithChildren<Props>): JSX.Element => (
  <Stack width="full" spacing={5}>
    <Heading fontSize={{ base: "md", sm: "lg" }} as="h2">
      {title}
    </Heading>

    <Box>
      {children}
    </Box>
  </Stack>
)

export default Section