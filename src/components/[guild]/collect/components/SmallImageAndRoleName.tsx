import { Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Role } from "types"
import CollectibleByRole from "./CollectibleByRole"

type Props = {
  imageElement: JSX.Element
  name: string
  role: Role
}

const SmallImageAndRoleName = ({ imageElement, name, role }: Props) => (
  <CardMotionWrapper animateOnMount>
    <SimpleGrid gridTemplateColumns="var(--chakra-sizes-24) auto" gap={4}>
      {imageElement}

      <Stack spacing={3} justifyContent={"center"}>
        <Heading as="h2" fontFamily="display" fontSize="2xl">
          {name}
        </Heading>

        <CollectibleByRole role={role} />
      </Stack>
    </SimpleGrid>
  </CardMotionWrapper>
)

export default SmallImageAndRoleName
