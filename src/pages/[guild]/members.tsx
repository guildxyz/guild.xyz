import { HStack, Text } from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import NoPermissionToPageFallback from "components/[guild]/NoPermissionToPageFallback"
import GuildTabs from "components/[guild]/Tabs/GuildTabs"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import CrmTableWrapper from "components/[guild]/crm/CRMTable/CrmTableWrapper"
import CrmTbody from "components/[guild]/crm/CRMTable/CrmTbody"
import CrmThead from "components/[guild]/crm/CRMTable/CrmThead"
import CrmMenu from "components/[guild]/crm/CrmMenu"
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
import { BackButton } from "components/common/Layout/components/BackButton"
import Head from "next/head"
import { useRouter } from "next/router"
import ErrorPage from "pages/_error"
import { useEffect, useMemo, useRef, useState } from "react"

const columnHelper = createColumnHelper<Member>()
const getRowId = (row: Member) => `user_${row.userId}`

const columns = [
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
    header: ({ column }) => {
      const [hiddenRolesSubColumn, publicRolesSubColumn] = column.columns

      return (
        <HStack w="full" justifyContent={"space-between"}>
          <Text>
            {!hiddenRolesSubColumn?.getIsVisible()
              ? "Roles"
              : `Roles (hidden${
                  publicRolesSubColumn.getIsVisible() ? ", public" : ""
                })`}
          </Text>
          <HStack spacing="0">
            <FilterByRoles
              getFilterValue={column.getFilterValue}
              setFilterValue={column.setFilterValue}
            />
            <OrderByColumn label="Number of roles" column={column} />
          </HStack>
        </HStack>
      )
    },
    columns: [
      {
        id: "hiddenRoles",
        accessorFn: (row) => row.roles.hidden,
        cell: (info) => (
          <RoleTags
            roles={info.getValue()}
            setFilterValue={info.column.parent.setFilterValue}
          />
        ),
      },
      {
        id: "publicRoles",
        accessorFn: (row) => row.roles.public,
        cell: (info) => (
          <RoleTags
            roles={info.getValue()}
            setFilterValue={info.column.parent.setFilterValue}
          />
        ),
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
]

const MembersPage = (): JSX.Element => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { name, roles, imageUrl } = useGuild()
  const scrollContainerRef = useRef(null)

  const { isReady, query, asPath, replace } = useRouter()
  const [columnFilters, setColumnFilters] = useState(() =>
    parseFiltersFromQuery(query)
  )
  const [sorting, setSorting] = useState(() => parseSortingFromQuery(query))

  const queryString = useMemo(
    () => buildQueryStringFromState(columnFilters, sorting),
    [columnFilters, sorting]
  )

  useEffect(() => {
    if (!isReady) return

    const path = asPath.split("?")[0]
    replace(`${path}?${queryString}`, null, { scroll: false })
    scrollContainerRef.current?.scrollTo({ top: 0 })
    // replace is intentionally left out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, queryString, asPath])

  const { data, error, isLoading, isValidating, setSize } = useMembers(queryString)

  const handleSetColumnFilters = (props) => {
    setSize(1)
    setColumnFilters(props)
  }

  const table = useReactTable({
    data: useMemo(() => data ?? [], [data]),
    columns,
    state: {
      columnFilters,
      sorting,
    },
    initialState: {
      columnFilters,
      sorting,
    },
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: true,
    onColumnFiltersChange: handleSetColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  })

  const hasHiddenRoles = roles?.some((role) => role.visibility === "HIDDEN")
  useEffect(() => {
    const hiddenRolesColumn = table
      .getAllLeafColumns()
      .find((col) => col.id === "hiddenRoles")

    if (hasHiddenRoles) {
      hiddenRolesColumn.columnDef.enableHiding = true
      hiddenRolesColumn.toggleVisibility(true)
    } else {
      hiddenRolesColumn.toggleVisibility(false)
      hiddenRolesColumn.columnDef.enableHiding = false
    }
  }, [table, hasHiddenRoles])

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
        backButton={<BackButton />}
      >
        <GuildTabs activeTab="MEMBERS" rightElement={<CrmMenu table={table} />} />
        {/* for debugging */}
        {/* {JSON.stringify(table.getState(), null, 2)} */}
        <NoPermissionToPageFallback>
          <CrmTableWrapper {...{ isValidating, setSize, scrollContainerRef }}>
            <CrmThead {...{ table, isLoading }} />
            <CrmTbody {...{ table, isValidating, data, error }} />
          </CrmTableWrapper>
        </NoPermissionToPageFallback>
      </Layout>
    </>
  )
}

const MembersPageWrapper = (): JSX.Element => {
  const { featureFlags, error } = useGuild()
  const router = useRouter()

  if (error) return <ErrorPage statusCode={404} />

  if (featureFlags && !featureFlags?.includes("CRM"))
    return <ErrorPage statusCode={404} />

  return (
    <>
      <Head>
        <title>Members</title>
        <meta property="og:title" content="Members" />
      </Head>
      <ThemeProvider>{router.isReady && <MembersPage />}</ThemeProvider>
    </>
  )
}

export default MembersPageWrapper
