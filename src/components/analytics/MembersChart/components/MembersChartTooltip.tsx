import {
  Box,
  HStack,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react"
import { Tooltip } from "@visx/xychart"
import useGuild from "components/[guild]/hooks/useGuild"
import Card, { useCardBg } from "components/common/Card"
import { Users } from "phosphor-react"
import SimpleRoleTag from "./SimpleRoleTag"

const MembersChartTooltip = ({ accessors, roleColors }) => {
  const cardBg = useCardBg()
  const { roles } = useGuild()

  return (
    <Tooltip
      snapTooltipToDatumX
      snapTooltipToDatumY
      showSeriesGlyphs
      glyphStyle={{
        stroke: "var(--chakra-colors-chakra-border-color)",
        fill: cardBg,
      }}
      unstyled
      applyPositionStyle
      detectBounds
      renderTooltip={({ tooltipData }) => (
        <Card
          py="2.5"
          px="4"
          pos="absolute"
          boxShadow="md"
          borderRadius="lg"
          pointerEvents={"none"}
          borderWidth="1px"
          minW="300px"
        >
          <Text fontSize={"sm"} fontWeight={"semibold"} colorScheme="gray" mb="3">
            {new Date(
              accessors.xAccessor(tooltipData.nearestDatum.datum)
            ).toLocaleString()}
          </Text>
          <Stack spacing={1}>
            {(() => {
              const { key, datum } = tooltipData.nearestDatum as any

              if (key === "total")
                return (
                  <LineSeriesData
                    key={key}
                    color={"currentColor"}
                    count={accessors.yAccessor(datum)}
                  >
                    <Text>Total</Text>
                  </LineSeriesData>
                )

              return (
                <LineSeriesData
                  key={key}
                  color={roleColors[key]}
                  count={accessors.yAccessor(datum)}
                >
                  <SimpleRoleTag
                    role={roles.find((role) => role.id === key) as any} // casting to any because there's a strange type error otherways that I couldn't solve
                    isTruncated
                  />
                </LineSeriesData>
              )
            })()}
          </Stack>
        </Card>
      )}
    />
  )
}

const LineSeriesData = ({ color, count, children }) => (
  <HStack>
    <Box bg={color} width="4" height="0.5" borderRadius="sm" flexShrink={0} />
    {children}
    <Spacer />
    <Tag bg="unset" color="gray" mt="3px !important" flexShrink={0}>
      <TagLeftIcon as={Users} boxSize={"16px"} />
      <TagLabel mb="-1px">
        {new Intl.NumberFormat("en", { notation: "compact" }).format(count)}
      </TagLabel>
    </Tag>
  </HStack>
)

export default MembersChartTooltip
