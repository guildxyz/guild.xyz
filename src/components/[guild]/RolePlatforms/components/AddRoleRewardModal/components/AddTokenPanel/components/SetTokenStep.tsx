import {
  Button,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import usePinata from "hooks/usePinata"
import useShowErrorToast from "hooks/useShowErrorToast"
import useTokenData from "hooks/useTokenData"
import { Upload, X } from "phosphor-react"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import TokenPicker from "requirements/common/TokenPicker"

const SetTokenStep = ({ onContinue }: { onContinue: () => void }) => {
  const chain = useWatch({ name: `chain` })
  const address = useWatch({ name: `address` })

  const isContinueDisabled = !address || !chain

  const {
    data: { logoURI: tokenLogo },
  } = useTokenData(chain, address)

  const [customImage, setCustomImage] = useState(null)
  const [progress, setProgress] = useState<number>(0)

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const uploader = usePinata({
    onSuccess: ({ IpfsHash }) =>
      setCustomImage(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`),
    onError: () => showErrorToast("Couldn't upload image"),
  })

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        uploader.onUpload({ data: [accepted[0]], onProgress: setProgress })
      }
    },
    onError: (error) => toast({ status: "error", title: error.message }),
  })

  return (
    <Stack gap={5}>
      <Text colorScheme="gray">
        Set the token you want to distribute as a reward.
      </Text>
      <ChainPicker controlName="chain" showDivider={false} />

      <Stack gap={2}>
        <TokenPicker
          chain={chain}
          fieldName={`address`}
          rules={{ required: "This field is required" }}
          customImage={customImage}
        />

        {!!address && !tokenLogo && (
          <>
            <HStack justifyContent={"space-between"}>
              {!customImage ? (
                <>
                  {!uploader.isUploading ? (
                    <>
                      <Button
                        variant="link"
                        fontSize="small"
                        leftIcon={<Upload />}
                        {...getRootProps()}
                      >
                        Upload custom image
                      </Button>
                      <input {...getInputProps()} accept="image/*" hidden />
                    </>
                  ) : (
                    <HStack>
                      <Spinner size="sm" />
                      <Text fontSize={"sm"}>{(progress * 100).toFixed()}%</Text>
                    </HStack>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="link"
                    fontSize="small"
                    onClick={() => setCustomImage(null)}
                    leftIcon={<X />}
                  >
                    Remove custom image
                  </Button>
                  <Text
                    color={"GrayText"}
                    fontSize={"small"}
                    textDecor="underline"
                    onClick={() => {
                      setCustomImage(null)
                    }}
                  ></Text>
                </>
              )}
            </HStack>
          </>
        )}
      </Stack>

      <Flex justifyContent={"flex-end"} mt={4}>
        <Button
          isDisabled={isContinueDisabled}
          colorScheme="primary"
          onClick={onContinue}
        >
          Continue
        </Button>
      </Flex>
    </Stack>
  )
}

export default SetTokenStep
