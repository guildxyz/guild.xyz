import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import CopyableAddress from "components/common/CopyableAddress"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import Papa from "papaparse"
import { Info, Upload } from "phosphor-react"
import { useDropzone } from "react-dropzone"
import { useFormContext, useWatch } from "react-hook-form"

const CustomSnapshotForm = () => {
  const { setValue } = useFormContext()
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const requirements = useWatch({ name: "requirements" })
  const { addresses } = useUser()

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/*": [".csv", ".txt"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        const reader = new FileReader()
        reader.onload = function (e) {
          parseAndValidateCSV(e.target.result as string)
            .then((validatedData) => {
              setValue("requirements", [
                {
                  type: "GUILD_SNAPSHOT",
                  data: {
                    snapshot: validatedData,
                    isHidden: false,
                  },
                },
              ])
            })
            .catch((error) => {
              showErrorToast(error)
            })
        }
        reader.readAsText(accepted[0])
      }
    },
    onError: (error) => toast({ status: "error", title: error.message }),
  })

  return (
    <>
      {requirements?.length > 0 ? (
        <Box padding={4}>
          <Alert status="success" alignItems={"center"}>
            <AlertIcon mt={0} /> Snapshot uploaded!{" "}
            <Button
              ml={"auto"}
              variant="link"
              fontWeight="bold"
              fontSize="small"
              onClick={() => setValue("requirements", [])}
            >
              Remove
            </Button>
          </Alert>
        </Box>
      ) : (
        <>
          <Box
            border={"1px"}
            borderStyle={"dashed"}
            borderColor={"whiteAlpha.300"}
            bg={"blackAlpha.200"}
            p={4}
            m={4}
            borderRadius={10}
            display={"flex"}
            gap={2}
            justifyContent={"center"}
            alignItems={"center"}
            _hover={{ cursor: "pointer", bg: "blackAlpha.300" }}
            transitionDuration={"0.2s"}
            {...getRootProps()}
          >
            <Icon as={Upload} boxSize={4} opacity={0.5} />
            <Text opacity={0.5}>Drag and drop file or browse from device</Text>

            <input {...getInputProps()} accept="csv" hidden />
          </Box>
          <Accordion allowToggle>
            <AccordionItem borderBottom="0">
              <AccordionButton>
                <Flex w="full" px={2} color={"GrayText"} alignItems={"center"}>
                  <Icon as={Info} mr={2} />
                  <Text mr="auto" fontWeight={"semibold"} fontSize={"sm"}>
                    Required format
                  </Text>
                  <AccordionIcon />
                </Flex>
              </AccordionButton>
              <AccordionPanel px={6}>
                <Text fontSize={"sm"} fontWeight={"normal"} color={"GrayText"}>
                  The uploaded file must adhere to the structure shown in the example
                  below, including matching column headers and data types.
                </Text>
                <TableContainer borderWidth={1} borderRadius="xl" mt={2}>
                  <Table variant="simple" size="sm" color="gray">
                    <Thead>
                      <Tr>
                        <Td>key</Td>
                        <Td>value</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          <CopyableAddress
                            address={addresses[0].address}
                            decimals={5}
                            fontSize="sm"
                          />
                        </Td>
                        <Td>1000</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      )}
    </>
  )
}

export default CustomSnapshotForm

interface ValidCSVRow {
  key: string
  value: number
}

function isValidCsvRow(row: any): row is ValidCSVRow {
  return typeof row.key === "string" && typeof row.value === "number"
}

function parseAndValidateCSV(csvData: string): Promise<ValidCSVRow[]> {
  return new Promise((resolve, reject) => {
    let headersValid = false
    const validatedData: ValidCSVRow[] = []
    const MAX_LINES = 50000
    let currentLine = 0

    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true, // Let PapaParse help with type conversion
      skipEmptyLines: true,
      step: function (row, parser) {
        if (++currentLine > MAX_LINES) {
          reject(
            new Error(
              "The selected CSV is too long. The maximum allowed line count is 50 000."
            )
          )
          parser.abort()
          return
        }

        if (!headersValid) {
          parser.pause()
          const rowData: any = row.data
          if ("key" in rowData && "value" in rowData) {
            headersValid = true
            parser.resume()
          } else {
            reject(
              new Error(
                "CSV headers are invalid. Required headers are exactly: ['key', 'value']."
              )
            )
            parser.abort()
            return
          }
        }

        if (!isValidCsvRow(row.data)) {
          reject(
            new Error(
              "Data type mismatch: 'key' should be a string and 'value' should be a number."
            )
          )
          parser.abort()
          return
        }
        validatedData.push(row.data)
      },
      complete: () => {
        if (validatedData.length < 1)
          reject(
            new Error(
              "Failed to parse file. Please ensure the selected file matches the required format."
            )
          )
        resolve(validatedData)
      },
      error: (error) => reject(error),
    })
  })
}
