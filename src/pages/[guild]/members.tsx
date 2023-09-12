import { Center, Checkbox, Heading, HStack, Spinner, Text } from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import CRMTable, { Member } from "components/[guild]/crm/CRMTable"
import ExportMembers from "components/[guild]/crm/ExportMembers"
import FilterByRoles, {
  roleFilter,
  roleSort,
} from "components/[guild]/crm/FilterByRoles"
import Identities from "components/[guild]/crm/Identities"
import IdentitiesSearch, {
  identitiesFilter,
} from "components/[guild]/crm/IdentitiesSearch"
import OrderByColumn from "components/[guild]/crm/OrderByColumn"
import RoleTags from "components/[guild]/crm/RoleTags"
import useMembers from "components/[guild]/crm/useMembers"
import useGuild from "components/[guild]/hooks/useGuild"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import Tabs from "components/[guild]/Tabs/Tabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import { useQueryState } from "hooks/useQueryState"
import dynamic from "next/dynamic"
import Head from "next/head"
import ErrorPage from "pages/_error"
import { useMemo } from "react"
import { Visibility } from "types"
import tryToParseJSON from "utils/tryToParseJSON"

const DynamicActiveStatusUpdates = dynamic(
  () => import("components/[guild]/ActiveStatusUpdates")
)

const columnHelper = createColumnHelper<Member>()

const GuildPage = (): JSX.Element => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { name, roles, urlName, description, imageUrl, socialLinks } = useGuild()
  const hasHiddenRoles = roles?.some((role) => role.visibility === Visibility.HIDDEN)

  const [columnFilters, setColumnFilters] = useQueryState("filters", undefined)

  const parsedColumnFilters = useMemo(
    () => tryToParseJSON(decodeURI(columnFilters)) || [],
    [columnFilters]
  )

  const handleSetColumnFilters = (newValue) => {
    if (!newValue()?.length) return setColumnFilters(null)
    return setColumnFilters(encodeURI(JSON.stringify(newValue())))
  }

  const { data } = useMembers()

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            {...{
              isChecked: table.getIsAllRowsSelected(),
              isIndeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
            colorScheme="primary"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              isChecked: row.getIsSelected(),
              isDisabled: !row.getCanSelect(),
              isIndeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
            colorScheme="primary"
            mt="2px"
          />
        ),
      },
      columnHelper.accessor((row) => row, {
        id: "identity",
        filterFn: identitiesFilter,
        cell: (info) => <Identities member={info.getValue()} />,
        header: ({ column }) => <IdentitiesSearch column={column} />,
      }),
      {
        id: "roles",
        header: ({ column }) => (
          <HStack w="full" justifyContent={"space-between"}>
            <Text>{`Roles ${hasHiddenRoles ? "(hidden, public)" : ""}`}</Text>
            <HStack spacing="0">
              <FilterByRoles column={column} />
              <OrderByColumn
                label="Number of roles"
                column={column
                  .getLeafColumns()
                  .find(({ id }) => id === "publicRoleIds")}
              />
            </HStack>
          </HStack>
        ),
        columns: hasHiddenRoles
          ? [
              columnHelper.accessor("hiddenRoleIds", {
                filterFn: roleFilter,
                cell: (info) => <RoleTags roleIds={info.getValue()} />,
              }),
              columnHelper.accessor("publicRoleIds", {
                filterFn: roleFilter,
                sortingFn: roleSort,
                cell: (info) => <RoleTags roleIds={info.getValue()} />,
              }),
            ]
          : [
              columnHelper.accessor("publicRoleIds", {
                filterFn: roleFilter,
                sortingFn: roleSort,
                cell: (info) => <RoleTags roleIds={info.getValue()} />,
              }),
            ],
      },
      columnHelper.accessor("joinedAt", {
        header: ({ column }) => (
          <HStack w="full" justifyContent={"space-between"}>
            <Text>Joined at</Text>
            <OrderByColumn label="Join date" column={column} />
          </HStack>
        ),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
    ],
    [hasHiddenRoles]
  )

  const table = useReactTable({
    data: useMemo(() => data ?? [], [data]),
    columns,
    state: {
      columnFilters: parsedColumnFilters,
    },
    initialState: {
      columnFilters: parsedColumnFilters,
    },
    onColumnFiltersChange: handleSetColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    enableRowSelection: true,
  })

  return (
    <>
      <Head>
        <meta name="theme-color" content={localThemeColor} />
      </Head>

      <Layout
        title={name}
        ogTitle={`Members - ${name}`}
        textColor={textColor}
        image={
          <GuildLogo
            imageUrl={imageUrl}
            size={{ base: "56px", lg: "72px" }}
            mt={{ base: 1, lg: 2 }}
            bgColor={textColor === "primary.800" ? "primary.800" : "transparent"}
          />
        }
        imageUrl={imageUrl}
        background={localThemeColor}
        backgroundImage={localBackgroundImage}
        backgroundOffset={112}
        showFooter={false}
      >
        <Tabs rightElement={<ExportMembers table={table} />}>
          <TabButton href={`/${urlName}`}>Home</TabButton>
          <TabButton href={`${urlName}/members`} isActive>
            Members
          </TabButton>
        </Tabs>
        {/* {JSON.stringify(table.getState(), null, 2)} */}
        <CRMTable table={table} />
      </Layout>
    </>
  )
}

const GuildPageWrapper = (): JSX.Element => {
  const guild = useGuild()

  if (guild.isLoading)
    return (
      <Center h="100vh" w="screen">
        <Spinner />
        <Heading fontFamily={"display"} size="md" ml="4" mb="1">
          Loading CRM...
        </Heading>
      </Center>
    )

  if (!guild?.featureFlags?.includes("CRM")) return <ErrorPage statusCode={404} />

  return (
    <>
      <Head>
        <title>{`${guild.name} members`}</title>
        <meta property="og:title" content={`${guild.name} members`} />
      </Head>
      <ThemeProvider>
        <GuildPage />
      </ThemeProvider>
    </>
  )
}

export default GuildPageWrapper

// for some reason the page errors without forcing SSR
export async function getServerSideProps() {
  return {
    props: {},
  }
}
