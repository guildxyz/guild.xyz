import { Box } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import { useCreateGuildContext } from "../CreateGuildContext"
import Pagination from "../Pagination"
import LayoutCard, { Layout } from "./components/LayoutCard"

const LAYOUTS: Layout[] = [
  {
    id: "BASIC",
    name: "Basic",
    description: "Simple guild setup, choose this if you're just testing Guild.xyz",
    requirements: [
      {
        type: "FREE",
      },
    ],
  },
  {
    id: "GROWTH",
    name: "Growth",
    description: "Basic anti-bot member verification",
    requirements: [
      {
        type: "COIN",
        chain: "ETHEREUM",
        data: {
          minAmount: 0.001,
        },
      },
      {
        type: "TWITTER_FOLLOWER_COUNT",
        data: {
          minAmount: 50,
        },
      },
      {
        type: "DISCORD_JOIN_FROM_NOW",
        data: {
          memberSince: 31536000000,
        },
      },
    ],
  },
]

const ChooseLayout = (): JSX.Element => {
  const { layout: layoutInContext, setLayout } = useCreateGuildContext()
  const { control, setValue } = useFormContext<GuildFormType>()

  const requirements = useWatch({ control, name: "roles.0.requirements" })

  return (
    <>
      <Box sx={{ columnCount: [1, 1, 2], columnGap: [4, 4, 6] }}>
        {LAYOUTS.map((layout, index) => (
          <LayoutCard
            key={index}
            {...layout}
            selected={layout.id === layoutInContext}
            onClick={(newLayoutId) => {
              setValue("roles.0", {
                name: "First role",
                imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
                requirements: LAYOUTS.find((l) => l.id === newLayoutId).requirements,
              })
              setLayout(newLayoutId)
            }}
          />
        ))}
      </Box>
      <Pagination nextButtonDisabled={!requirements?.length} />
    </>
  )
}

export default ChooseLayout
