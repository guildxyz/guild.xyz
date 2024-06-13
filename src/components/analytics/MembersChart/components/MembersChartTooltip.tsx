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
import { Tooltip, TooltipDatum } from "@visx/xychart"
import useGuild from "components/[guild]/hooks/useGuild"
import Card, { useCardBg } from "components/common/Card"
import { Users } from "phosphor-react"
import { PropsWithChildren } from "react"
import { MemberCountData, MembersChartAccessors } from "../MembersChart"
import SimpleRoleTag from "./SimpleRoleTag"

type Props = {
  accessors: MembersChartAccessors
  roleColors: Record<number, string>
}

const MembersChartTooltip = ({ accessors, roleColors }: Props) => {
  const cardBg = useCardBg()
  const { roles } = useGuild()

  return (
    <Tooltip
      snapTooltipToDatumY
      showSeriesGlyphs
      glyphStyle={{
        stroke: "var(--chakra-colors-chakra-border-color)",
        fill: cardBg,
      }}
      unstyled
      className={"noPointerEvents"}
      applyPositionStyle
      renderTooltip={({ tooltipData }) => (
        <Card py="2.5" px="4" boxShadow="md" borderRadius="lg" borderWidth="1px">
          <Text fontSize={"sm"} fontWeight={"semibold"} colorScheme="gray" mb="3">
            {new Date(
              // @ts-expect-error TODO: fix this error originating from strictNullChecks
              accessors.xAccessor(tooltipData.nearestDatum.datum as MemberCountData)
            ).toLocaleString()}
          </Text>
          <Stack spacing={1}>
            {(() => {
              const { key, datum } =
                // @ts-expect-error TODO: fix this error originating from strictNullChecks
                tooltipData.nearestDatum as TooltipDatum<MemberCountData>

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
                    // @ts-expect-error TODO: fix this error originating from strictNullChecks
                    roleData={roles.find((role) => role.id.toString() === key)}
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

const LineSeriesData = ({
  color,
  count,
  children,
}: PropsWithChildren<{ color: string; count: number }>) => (
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
