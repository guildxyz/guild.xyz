import { HStack, Text } from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import CrmTableWrapper from "components/[guild]/crm/CRMTable/CrmTableWrapper"
import CrmThead from "components/[guild]/crm/CRMTable/CrmThead"
import Identities from "components/[guild]/crm/Identities"
import { IDENTITIES_COLLAPSED_STYLE } from "components/[guild]/crm/IdentitiesExpansionToggle"
import IdentitiesSearch from "components/[guild]/crm/IdentitiesSearch"
import {
  buildQueryStringFromState,
  parseFiltersFromQuery,
  parseSortingFromQuery,
} from "components/[guild]/crm/transformTableStateToAndFromQuery"
import FormResponsesTbody from "components/[guild]/forms/responses/FormResponsesTbody"
import { useRouter } from "next/router"
import useFormSubmissions, {
  FormSubmission,
} from "platforms/Forms/hooks/useFormSubmissions"
import { useEffect, useMemo, useState } from "react"

const columnHelper = createColumnHelper<FormSubmission>()
const getRowId = (row: FormSubmission) => `response_${row.userId}`

const FormResponsesTable = ({ form }) => {
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
    if (!router.isReady || !queryString) return

    const asPath = router.asPath.split("?")[0]
    router.replace(`${asPath}?${queryString}`)
  }, [queryString, router])

  const { data, error, isLoading, isValidating, setSize } = useFormSubmissions(
    form.id,
    queryString
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

  const columns = useMemo(
    () => [
      // {
      //   id: "select",
      //   size: 30,
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         isChecked: table.getIsAllRowsSelected(),
      //         isIndeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler(),
      //       }}
      //       colorScheme="primary"
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         isChecked: row.getIsSelected(),
      //         isDisabled: !row.getCanSelect(),
      //         isIndeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler(),
      //       }}
      //       colorScheme="primary"
      //       mt="2px"
      //     />
      //   ),
      // },
      columnHelper.accessor((row) => row, {
        id: "identity",
        size: 210,
        cell: (info) => <Identities member={info.getValue()} />,
        header: ({ column }) => (
          <HStack spacing="0">
            <IdentitiesSearch column={column} />
            <style>{IDENTITIES_COLLAPSED_STYLE}</style>
          </HStack>
        ),
      }),
      ...form.fields.map((field) =>
        columnHelper.accessor("submissionAnswers", {
          id: `field_${field.id}`,
          header: () => (
            <HStack w="full" justifyContent={"space-between"}>
              <FormThText>{field.question}</FormThText>
              {/* field.type !== "MULTIPLE_CHOICE" && (
                <OrderByColumn label={field.question} column={column} />
              ) */}
            </HStack>
          ),
          cell: (info) => {
            const value = info.getValue().find((f) => f.fieldId === field.id)?.value

            return (
              <Text noOfLines={6} maxWidth={"400px"}>
                {Array.isArray(value) ? value.join(", ") : value || "-"}
              </Text>
            )
          },
        })
      ),
      columnHelper.accessor("submittedAt", {
        size: 140,
        header: () => (
          <HStack w="full" justifyContent={"space-between"}>
            <FormThText>Submitted at</FormThText>
            {/* <OrderByColumn label="Submission date" column={column} /> */}
          </HStack>
        ),
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
    ],
    [form]
  )

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
    <CrmTableWrapper {...{ isValidating, setSize }}>
      <CrmThead {...{ table, isLoading }} />
      <FormResponsesTbody {...{ table, data, error, isValidating }} />
    </CrmTableWrapper>
  )
}

const FormThText = ({ children }) => (
  <Text
    textTransform={"none"}
    letterSpacing={"normal"}
    fontWeight={"semibold"}
    fontSize={"sm"}
    noOfLines={2}
    title={children}
  >
    {children}
  </Text>
)

export default FormResponsesTable
