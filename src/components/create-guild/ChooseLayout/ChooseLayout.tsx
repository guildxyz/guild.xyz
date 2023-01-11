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
    roles: [
      {
        name: "Basic role",
        logic: "AND",
        imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
        requirements: [
          {
            type: "FREE",
          },
        ],
      },
    ],
  },
  {
    id: "GROWTH",
    name: "Growth",
    description: "Basic anti-bot member verification",
    roles: [
      {
        name: "Growth role #1",
        logic: "AND",
        imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
        requirements: [
          {
            type: "COIN",
            chain: "ETHEREUM",
            address: "0x0000000000000000000000000000000000000000",
            data: {
              minAmount: 0.001,
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
      {
        name: "Growth role #2",
        logic: "AND",
        imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
        requirements: [
          {
            type: "TWITTER_FOLLOW",
            data: {
              id: "{your_twitter_handle}",
            },
          },
          {
            type: "TWITTER_FOLLOWER_COUNT",
            data: {
              minAmount: 50,
            },
          },
        ],
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
              setValue("roles", LAYOUTS.find((l) => l.id === newLayoutId).roles)
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
