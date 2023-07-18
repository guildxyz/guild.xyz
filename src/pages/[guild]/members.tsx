import {
  Center,
  Checkbox,
  HStack,
  Heading,
  Link,
  Spinner,
  Text,
  Wrap,
} from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import SocialIcon from "components/[guild]/SocialIcon"
import Tabs from "components/[guild]/Tabs/Tabs"
import TabButton from "components/[guild]/Tabs/components/TabButton"
import { ThemeProvider, useThemeContext } from "components/[guild]/ThemeContext"
import CRMTable, { Member } from "components/[guild]/crm/CRMTable"
import ExportMembers from "components/[guild]/crm/ExportMembers"
import FilterByRoles, {
  roleFilter,
  roleSort,
} from "components/[guild]/crm/FilterByRoles"
import Identities from "components/[guild]/crm/Identities"
import IdentitiesSearch from "components/[guild]/crm/IdentitiesSearch"
import OrderByColumn from "components/[guild]/crm/OrderByColumn"
import RoleTags from "components/[guild]/crm/RoleTags"
import useMembers from "components/[guild]/crm/useMembers"
import useGuild from "components/[guild]/hooks/useGuild"
import GuildLogo from "components/common/GuildLogo"
import Layout from "components/common/Layout"
import dynamic from "next/dynamic"
import Head from "next/head"
import ErrorPage from "pages/_error"
import { useMemo } from "react"
import { SocialLinkKey, Visibility } from "types"
import parseDescription from "utils/parseDescription"

const DynamicActiveStatusUpdates = dynamic(
  () => import("components/[guild]/ActiveStatusUpdates")
)

const columnHelper = createColumnHelper<Member>()

const GuildPage = (): JSX.Element => {
  const { textColor, localThemeColor, localBackgroundImage } = useThemeContext()
  const { name, roles, urlName, description, imageUrl, socialLinks } = useGuild()
  const hasHiddenRoles = roles.some((role) => role.visibility === Visibility.HIDDEN)

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
        cell: (info) => <Identities member={info.getValue()} />,
        header: () => <IdentitiesSearch />,
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
    data: data ?? [],
    columns,
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
        textColor={textColor}
        ogDescription={description}
        description={
          <>
            {description && parseDescription(description)}
            {Object.keys(socialLinks ?? {}).length > 0 && (
              <Wrap w="full" spacing={3} mt="3">
                {Object.entries(socialLinks).map(([type, link]) => {
                  const prettyLink = link
                    .replace(/(http(s)?:\/\/)*(www\.)*/i, "")
                    .replace(/\/+$/, "")

                  return (
                    <HStack key={type} spacing={1.5}>
                      <SocialIcon type={type as SocialLinkKey} size="sm" />
                      <Link
                        href={link?.startsWith("http") ? link : `https://${link}`}
                        isExternal
                        fontSize="sm"
                        fontWeight="semibold"
                        color={textColor}
                      >
                        {prettyLink}
                      </Link>
                    </HStack>
                  )
                })}
              </Wrap>
            )}
          </>
        }
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
        backButton={{ href: "/explorer", text: "Go back to explorer" }}
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
          Loading guild...
        </Heading>
      </Center>
    )

  if (!guild.id) return <ErrorPage statusCode={404} />

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
