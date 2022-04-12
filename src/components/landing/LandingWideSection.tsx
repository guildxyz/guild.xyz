import { Heading, Stack } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  title: string
} & Rest

const LandingWideSection = ({
  title,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Stack mb={{ base: 16, md: 28 }} spacing={16} {...rest}>
    <Heading as="h3" fontFamily="display" fontSize="4xl" textAlign="center">
      {title}
    </Heading>
    {children}
  </Stack>
)

export default LandingWideSection
