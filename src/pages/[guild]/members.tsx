import { Checkbox, HStack, Text } from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import CrmTableWrapper from "components/[guild]/crm/CRMTable/CrmTableWrapper"
import CrmTbody from "components/[guild]/crm/CRMTable/CrmTbody"
import CrmThead from "components/[guild]/crm/CRMTable/CrmThead"
import ExportMembers from "components/[guild]/crm/ExportMembers"
import FilterByRoles from "components/[guild]/crm/FilterByRoles"
import Identities from "components/[guild]/crm/Identities"
import IdentitiesExpansionToggle from "components/[guild]/crm/IdentitiesExpansionToggle"
import IdentitiesSearch from "components/[guild]/crm/IdentitiesSearch"
import OrderByColumn from "components/[guild]/crm/OrderByColumn"
import RoleTags from "components/[guild]/crm/RoleTags"
import {
  buildQueryStringFromState,
  parseFiltersFromQuery,
  parseSortingFromQuery,
} from "components/[guild]/crm/transformTableStateToAndFromQuery"
import useMembers, { Member } from "components/[guild]/crm/useMembers"
import useGuild from "components/[guild]/hooks/useGuild"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import Head from "next/head"
import { useRouter } from "next/router"
import ErrorPage from "pages/_error"
import { useEffect, useMemo, useState } from "react"
import { Visibility } from "types"

const columnHelper = createColumnHelper<Member>()
const getRowId = (row: Member) => `user_${row.userId}`

const GuildPage = (): JSX.Element => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { name, roles, imageUrl } = useGuild()
  const hasHiddenRoles = roles?.some((role) => role.visibility === Visibility.HIDDEN)

  const router = useRouter()
  const [columnFilters, setColumnFilters] = useState(() =>
    parseFiltersFromQuery(router.query)
  )
  const [sorting, setSorting] = useState(() => parseSortingFromQuery(router.query))
  const [rowSelection, setRowSelection] = useState({})

  const queryString = useMemo(
    () => buildQueryStringFromState(columnFilters, sorting),
    [columnFilters, sorting]
  )

  useEffect(() => {
    /**
     * Using native browser api, so it doesn't cause a rerender & trigger the general
     * loading bar set up in _app.tsx. The downside is, if we filter for something,
     * navigate to another page then click the back button, it won't work. We could
     * add some logic to the _app.tsx effect to filter out query-only changes
     * (https://stackoverflow.com/questions/62368109/update-router-query-without-firing-page-change-event-in-next-js),
     * but I'm not sure the performance cost would worth handling this edge case, so
     * left it this way for now
     */
    window.history.pushState("", "", `?${queryString}`)
  }, [queryString])
  const { data, error, isLoading, isValidating, setSize } = useMembers(queryString)

  const columns = useMemo(
    () => [
      {
        id: "select",
        size: 30,
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
        size: 210,
        cell: (info) => <Identities member={info.getValue()} />,
        header: ({ column }) => (
          <HStack spacing="0">
            <IdentitiesSearch column={column} />
            <IdentitiesExpansionToggle />
          </HStack>
        ),
      }),
      {
        accessorKey: "roles",
        size: "auto" as any,
        header: ({ column }) => (
          <HStack w="full" justifyContent={"space-between"}>
            <Text>{`Roles ${hasHiddenRoles ? "(hidden, public)" : ""}`}</Text>
            <HStack spacing="0">
              <FilterByRoles column={column} />
              <OrderByColumn label="Number of roles" column={column} />
            </HStack>
          </HStack>
        ),
        columns: [
          ...(hasHiddenRoles
            ? [
                {
                  id: "hiddenRoles",
                  accessorFn: (row) => row.roles.hidden,
                  cell: (info) => <RoleTags roles={info.getValue()} />,
                },
              ]
            : []),
          {
            id: "publicRoles",
            accessorFn: (row) => row.roles.public,
            cell: (info) => <RoleTags roles={info.getValue()} />,
          },
        ],
      },
      columnHelper.accessor("joinedAt", {
        size: 140,
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

  // TODO: keep row selection when the data changes. Right now we just reset the selection
  const handleSetColumnFilters = (props) => {
    setRowSelection({})
    setColumnFilters(props)
  }
  const handleSetSorting = (props) => {
    setRowSelection({})
    setSorting(props)
  }

  const table = useReactTable({
    data: useMemo(() => data ?? [], [data]),
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
    initialState: {
      columnFilters,
      sorting,
      rowSelection,
    },
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: true,
    onColumnFiltersChange: handleSetColumnFilters,
    onSortingChange: handleSetSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
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
        <GuildTabs
          activeTab="MEMBERS"
          rightElement={<ExportMembers table={table} />}
        />
        {/* for debugging */}
        {/* {JSON.stringify(table.getState(), null, 2)} */}
        <CrmTableWrapper {...{ isValidating, setSize }}>
          <CrmThead {...{ table, isLoading }} />
          <CrmTbody {...{ table, isValidating, data, error }} />
        </CrmTableWrapper>
      </Layout>
    </>
  )
}

const GuildPageWrapper = (): JSX.Element => {
  const { featureFlags, name, error } = useGuild()
  const router = useRouter()

  if (error) return <ErrorPage statusCode={404} />

  if (featureFlags && !featureFlags?.includes("CRM"))
    return <ErrorPage statusCode={404} />

  return (
    <>
      <Head>
        <title>{`${name} members`}</title>
        <meta property="og:title" content={`${name} members`} />
      </Head>
      <ThemeProvider>{router.isReady && <GuildPage />}</ThemeProvider>
    </>
  )
}

export default GuildPageWrapper
