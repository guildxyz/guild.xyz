import {
  Box,
  Center,
  HStack,
  Select,
  Spinner,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react"
import { curveMonotoneX } from "@visx/curve"
import { Axis, Grid, LineSeries, XYChart, allColors } from "@visx/xychart"
import useGuild from "components/[guild]/hooks/useGuild"
import Card from "components/common/Card"
import ErrorAlert from "components/common/ErrorAlert"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useEffect, useMemo, useState } from "react"
import { Role } from "types"
import getRandomInt from "utils/getRandomInt"
import MembersChartLinesPanel from "./components/MembersChartLinesPanel"
import MembersChartTooltip from "./components/MembersChartTooltip"

export type MemberCountData = {
  count: number
  timestamp: string
}

export type MembersChartAccessors = {
  xAccessor: (d: MemberCountData) => any
  yAccessor: (d: MemberCountData) => any
}

type MemberCountByRole = { roleId: number; memberCounts: MemberCountData[] }

const accessors: MembersChartAccessors = {
  xAccessor: (d) => new Date(d?.timestamp),
  yAccessor: (d) => d.count,
}

const CHART_MARGIN_X = 18
const COLOR_PALETTES = Object.values(allColors)

const date = new Date()
const current = date.toISOString()
// we only have correct data since 26 october
const startDate = new Date("2023-10-26")
const prev = startDate.toISOString()

const MembersChart = () => {
  const { id, roles } = useGuild()
  const chartHeight = useBreakpointValue({ base: 250, md: 500 })
  const numberOfDateMarkers = useBreakpointValue({ base: 2, sm: 4 })

  const { data, isLoading, error } = useSWRWithOptionalAuth<{
    roles: MemberCountByRole[]
    total: MemberCountData[]
  }>(
    id
      ? `/v2/analytics/guilds/${id}/member-counts?fetchTotal=true&from=${prev}&to=${current}`
      : null
  )

  const sortedRoles: Role[] = useMemo(() => {
    const byMembers = roles?.sort(
      (role1, role2) => role2.memberCount - role1.memberCount
    )
    return byMembers
  }, [roles])

  const [shownLines, setShownLines] = useState(["total"])
  useEffect(() => {
    if (!roles) return
    setShownLines(["total", ...roles?.map((role) => role.id.toString())])
  }, [roles])

  const shownRoles = data?.roles?.filter((role) =>
    shownLines?.includes(role.roleId.toString())
  )

  const allShownValues = useMemo(() => {
    if (!data) return []
    return [
      ...(shownLines.includes("total")
        ? data.total.map((dataPoint) => dataPoint.count)
        : []),
      ...shownRoles?.flatMap((role) =>
        role.memberCounts.map((dataPoint) => dataPoint.count)
      ),
    ]
  }, [data, shownLines, shownRoles])

  const minValue = Math.min(...allShownValues)
  const maxValue = Math.max(...allShownValues)

  const roleColors: Record<number, string> = useMemo(
    () =>
      roles?.reduce((acc, curr) => {
        acc[curr.id] =
          /* curr.imageUrl
          ? await getColorByImage(curr.imageUrl)
          : */ COLOR_PALETTES[getRandomInt(COLOR_PALETTES.length - 1)][4]
        return acc
      }, {}),
    [roles]
  )

  return (
    <Card flexDirection={{ base: "column", md: "row" }}>
      <Box
        flex="1 1 auto"
        overflow={"hidden"}
        sx={{
          ".visx-axis-tick": { text: { fill: "currentColor" } },
        }}
      >
        <HStack p="4" justifyContent={"space-between"}>
          <Text fontWeight={"bold"} px="1">
            Member counts
          </Text>
          <Tooltip label="Soon" hasArrow>
            <Select size="sm" w="auto" isDisabled>
              <option>Since October 26</option>
            </Select>
          </Tooltip>
        </HStack>
        {error ? (
          <Center w="full" h={chartHeight}>
            <ErrorAlert
              label="Couldn't load chart"
              description={error?.error}
              maxW="300px"
            />
          </Center>
        ) : isLoading ? (
          <Center w="full" h={chartHeight}>
            <Spinner />
          </Center>
        ) : (
          <XYChart
            height={chartHeight}
            margin={{
              top: 35,
              bottom: 35,
              left: CHART_MARGIN_X,
              right: CHART_MARGIN_X,
            }}
            xScale={{ type: "time" }}
            yScale={
              maxValue > 100
                ? {
                    /**
                     * Using log would be even better, but in that case the yAxis
                     * gets cluttered with too much values in some guilds for some
                     * reason (regardless of the numTicks={4})
                     */
                    type: "sqrt",
                    domain: [minValue, maxValue],
                  }
                : { type: "linear" }
            }
          >
            <Grid
              columns={false}
              numTicks={4}
              lineStyle={{
                stroke: "var(--chakra-colors-chakra-border-color)",
                strokeLinecap: "round",
                strokeWidth: 1,
              }}
              strokeDasharray="2, 4"
            />
            <Axis
              hideAxisLine
              hideTicks
              orientation="bottom"
              labelProps={{ fill: "var(--chakra-colors-chakra-body-text)" }}
              tickLabelProps={(value, index, ticks) => ({
                textAnchor:
                  index === 0
                    ? "start"
                    : index === ticks[ticks.length - 1].index
                    ? "end"
                    : "middle",
              })}
              numTicks={numberOfDateMarkers}
            />
            <Axis
              hideAxisLine
              hideTicks
              hideZero
              orientation="left"
              numTicks={4}
              tickFormat={(value) =>
                new Intl.NumberFormat("en", { notation: "compact" }).format(value)
              }
              left={CHART_MARGIN_X}
              tickLabelProps={() => ({
                dy: 14,
                dx: 4,
                textAnchor: "start",
              })}
            />
            {/* temporarily removed until we get accurate member counts from BE */}
            {/* {data?.total && shownLines?.includes("total") && (
              <LineSeries
                stroke="currentColor"
                dataKey="total"
                data={data.total}
                curve={curveMonotoneX}
                {...accessors}
              />
            )} */}
            {shownRoles?.map(({ roleId, memberCounts }) => (
              <LineSeries
                key={roleId}
                dataKey={roleId.toString()}
                stroke={roleColors[roleId]}
                data={memberCounts}
                curve={curveMonotoneX}
                {...accessors}
              />
            ))}
            <MembersChartTooltip {...{ accessors, roleColors }} />
          </XYChart>
        )}
      </Box>
      <MembersChartLinesPanel
        {...{
          sortedRoles,
          roleColors,
          shownRoleIds: shownLines,
          setShownRoleIds: setShownLines,
        }}
      />
    </Card>
  )
}

export default MembersChart
