import { Checkbox, HStack, Text } from "@chakra-ui/react"
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import CrmTableWrapper from "components/[guild]/crm/CRMTable/CrmTableWrapper"
import OrderByColumn from "components/[guild]/crm/OrderByColumn"
import {
  parseFiltersFromQuery,
  parseSortingFromQuery,
} from "components/[guild]/crm/transformTableStateToAndFromQuery"
import FormResponsesTbody from "components/[guild]/forms/responses/FormResponsesTbody"
import FormResponsesThead from "components/[guild]/forms/responses/FormResponsesThead"
import { useRouter } from "next/router"
import useFormSubmissions, {
  FormSubmission,
} from "platforms/Forms/hooks/useFormSubmissions"
import { useMemo, useState } from "react"

const columnHelper = createColumnHelper<FormSubmission>()
const getRowId = (row: FormSubmission) => `user_${row.userId}`

const FormResponsesTable = ({ form }) => {
  const router = useRouter()

  const [columnFilters, setColumnFilters] = useState(() =>
    parseFiltersFromQuery(router.query)
  )
  const [sorting, setSorting] = useState(() => parseSortingFromQuery(router.query))
  const [rowSelection, setRowSelection] = useState({})

  const { data, error, isLoading, isValidating /* setSize */ } = useFormSubmissions(
    form.id
  )

  const setSize = () => {}

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
      // columnHelper.accessor((row) => row, {
      //   id: "identity",
      //   size: 210,
      //   cell: (info) => <Identities member={info.getValue()} />,
      //   header: ({ column }) => (
      //     <HStack spacing="0">
      //       <IdentitiesSearch column={column} />
      //       <IdentitiesExpansionToggle />
      //     </HStack>
      //   ),
      // }),
      ...form.fields.map((field) =>
        columnHelper.accessor("submissionAnswers", {
          id: `field_${field.id}`,
          header: ({ column }) => (
            <HStack w="full" justifyContent={"space-between"}>
              <Text>{field.question}</Text>
              {field.type !== "MULTIPLE_CHOICE" && (
                <OrderByColumn label={field.question} column={column} />
              )}
            </HStack>
          ),
          cell: (info) => {
            const value = info.getValue().find((f) => f.fieldId === field.id).value
            if (Array.isArray(value)) return value.join(", ")
            return value
          },
        })
      ),
      columnHelper.accessor("createdAt", {
        size: 140,
        header: ({ column }) => (
          <HStack w="full" justifyContent={"space-between"}>
            <Text>Submitted at</Text>
            <OrderByColumn label="Submission date" column={column} />
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
      <FormResponsesThead {...{ table, isLoading }} />
      <FormResponsesTbody {...{ table, data, error, isValidating }} />
    </CrmTableWrapper>
  )
}

export default FormResponsesTable
