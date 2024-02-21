import { HStack, Spinner, Tbody, Text, Tr } from "@chakra-ui/react"
import { Table, flexRender } from "@tanstack/react-table"
import {
  CrmInfoRow,
  CrmInteractiveTd,
  CrmSkeletonRow,
} from "components/[guild]/crm/CRMTable/CrmTbody"
import { FormSubmission } from "platforms/Forms/hooks/useFormSubmissions"
import { useState } from "react"
import ResponseModal from "./ResponseModal"

type Props = {
  table: Table<FormSubmission>
  data: FormSubmission[]
  error: any
  isValidating: boolean
}

const FormResponsesTbody = ({ table, data, error, isValidating }: Props) => {
  const rows = table.getRowModel().rows
  const [openResponseModalIndex, setOpenResponseModalIndex] = useState(null)

  const closeModal = () => setOpenResponseModalIndex(null)

  return (
    <Tbody>
      {!data && isValidating ? (
        [...Array(20)].map((_, i) => (
          <CrmSkeletonRow
            key={`loading_skeleton_${i}`}
            columns={table.getAllLeafColumns()}
          />
        ))
      ) : data ? (
        rows.length ? (
          rows
            .map((row, i) => (
              <ResponseRow
                key={row.id}
                row={row}
                onOpen={() => setOpenResponseModalIndex(i)}
              />
            ))
            .concat(
              isValidating ? (
                <CrmInfoRow key="loading">
                  <HStack>
                    <Spinner size="sm" />
                    <Text>Loading more responses</Text>
                  </HStack>
                </CrmInfoRow>
              ) : (
                <CrmInfoRow key="end_of_results">
                  <Text
                    colorScheme="gray"
                    fontSize={"xs"}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                  >
                    End of results
                  </Text>
                </CrmInfoRow>
              )
            )
        ) : (
          <CrmInfoRow py="10">
            {`No responses ${
              !!table.getState().columnFilters.length
                ? "satisfy the filters you've set"
                : "yet"
            }`}
          </CrmInfoRow>
        )
      ) : (
        <CrmInfoRow py="10">
          {error?.message || "Couldn't fetch responses"}
        </CrmInfoRow>
      )}
      <ResponseModal
        row={rows[openResponseModalIndex]}
        isOpen={openResponseModalIndex !== null}
        onClose={closeModal}
        onPrev={
          openResponseModalIndex > 0
            ? () => setOpenResponseModalIndex((curr) => curr - 1)
            : null
        }
        onNext={
          openResponseModalIndex < rows.length - 1
            ? () => setOpenResponseModalIndex((curr) => curr + 1)
            : null
        }
      />
    </Tbody>
  )
}

const ResponseRow = ({ row, onOpen }) => (
  <Tr role="group">
    {row.getVisibleCells().map((cell) => (
      <CrmInteractiveTd
        key={cell.id}
        onClick={cell.column.id !== "select" ? onOpen : undefined}
        transition="background .2s"
        {...(cell.column.id === "identity" && {
          position: "sticky",
          left: "0",
          width: "0px",
          maxWidth: "350px",
          transition: "max-width .2s",
          zIndex: 3,
          className: "identityTd",
        })}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </CrmInteractiveTd>
    ))}
  </Tr>
)

export default FormResponsesTbody
