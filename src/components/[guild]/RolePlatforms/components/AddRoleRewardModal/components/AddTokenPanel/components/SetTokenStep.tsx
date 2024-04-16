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
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useFormContext, useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import TokenPicker from "requirements/common/TokenPicker"
import { AddTokenFormType } from "../AddTokenPanel"

const SetTokenStep = ({ onContinue }: { onContinue: () => void }) => {
  const chain = useWatch({ name: `chain` })
  const address = useWatch({ name: `tokenAddress` })
  const imageUrl = useWatch({ name: `imageUrl` })

  const isContinueDisabled = !address || !chain

  const {
    data: { logoURI: tokenLogo, symbol: tokenSymbol, name: tokenName },
  } = useTokenData(chain, address)

  useEffect(() => {
    setValue("name", `${tokenName} (${tokenSymbol})`)
    setValue("imageUrl", tokenLogo)
  }, [tokenSymbol, tokenName, tokenLogo])

  const [progress, setProgress] = useState<number>(0)

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { setValue } = useFormContext<AddTokenFormType>()

  const uploader = usePinata({
    onSuccess: ({ IpfsHash }) =>
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`),
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
          fieldName={`tokenAddress`}
          rules={{ required: "This field is required" }}
          customImage={imageUrl}
        />

        {!!address && !tokenLogo && (
          <>
            <HStack justifyContent={"space-between"}>
              {!imageUrl ? (
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
                    onClick={() => setValue("imageUrl", null)}
                    leftIcon={<X />}
                  >
                    Remove custom image
                  </Button>
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
