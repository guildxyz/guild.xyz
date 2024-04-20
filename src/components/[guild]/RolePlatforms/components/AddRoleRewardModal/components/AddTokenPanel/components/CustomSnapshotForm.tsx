import { Alert, AlertIcon, Box, Icon, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import Papa from "papaparse"
import { Upload } from "phosphor-react"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useFormContext } from "react-hook-form"

const CustomSnapshotForm = () => {
  const { setValue } = useFormContext()
  const [uploadedSnapshot, setUploadedSnapshot] = useState(null)
  const showErrorToast = useShowErrorToast()
  const toast = useToast()

  const setRequirement = (req: any) => setValue("requirements", [req])

  useEffect(() => {
    if (!uploadedSnapshot) {
      setRequirement(null)
      return
    }
    setValue("data.guildPlatformId", null)

    setRequirement({
      type: "GUILD_SNAPSHOT",
      data: {
        snapshot: uploadedSnapshot,
        isHidden: false,
      },
    })
  }, [uploadedSnapshot])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/*": [".csv", ".txt"] },
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        const reader = new FileReader()
        reader.onload = function (e) {
          parseAndValidateCSV(e.target.result as string)
            .then((validatedData) => {
              setUploadedSnapshot(validatedData)
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
      {uploadedSnapshot ? (
        <Box padding={4}>
          <Alert status="success" alignItems={"center"}>
            <AlertIcon mt={0} /> Snapshot uploaded!{" "}
            <Button
              ml={"auto"}
              variant="link"
              fontWeight="bold"
              fontSize="small"
              onClick={() => setUploadedSnapshot(null)}
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

    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true, // Let PapaParse help with type conversion
      skipEmptyLines: true,
      step: function (row, parser) {
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
        resolve(validatedData as ValidCSVRow[])
      },
      error: (error) => {
        reject(
          new Error(
            "Data type mismatch: 'key' should be a string and 'value' should be a number."
          )
        )
      },
    })
  })
}
