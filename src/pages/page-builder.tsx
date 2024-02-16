import { Container, Grid } from "@chakra-ui/react"
import Item from "components/page-builder/Item"

export type ItemType = {
  id: number
  desktop: {
    position: number
    width: 1 | 2 | 3 | "FULL"
    height: 1 | 2 | 3 | "AUTO"
  }
  // mobile: {
  //   position: number
  //   width: 1 | 2
  //   height: 1 | 2 | "AUTO"
  // }
  type: "REWARD" | "ROLE" | "PAGE" | "SECTION"
  data: any
}

const items: ItemType[] = [
  {
    id: 0,
    desktop: {
      position: 0,
      width: 1,
      height: 1,
    },
    type: "ROLE",
    data: {},
  },
  {
    id: 1,
    desktop: {
      position: 2,
      width: 1,
      height: 1,
    },

    type: "ROLE",
    data: {},
  },
  {
    id: 2,
    desktop: {
      position: 3,
      width: 2,
      height: 1,
    },
    type: "ROLE",
    data: {},
  },
  {
    id: 2,
    desktop: {
      position: 6,
      width: 2,
      height: 1,
    },
    type: "ROLE",
    data: {},
  },
]

const PageBuilder = () => {
  // const {} = usePositionReorder(items)

  return (
    <Container
      maxW="container.lg"
      py={{ base: 6, md: 9 }}
      px={{ base: 4, sm: 6, md: 8, lg: 10 }}
    >
      <Grid templateColumns="repeat(6, 1fr)" gridAutoRows="145px" gap="14px">
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </Grid>
    </Container>
  )
}

export default PageBuilder
