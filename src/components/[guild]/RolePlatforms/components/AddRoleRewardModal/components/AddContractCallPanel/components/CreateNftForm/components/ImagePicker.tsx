import {
  AspectRatio,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Img,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Image } from "@phosphor-icons/react"
import TiltCard from "components/[guild]/collect/components/TiltCard"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import usePinata from "hooks/usePinata"
import { Fragment, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { CreateNftFormType } from "./NftDataForm"

const ImagePicker = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateNftFormType>()

  const { field: imageField } = useController({
    name: "image",
    rules: {
      required: "It is required to upload an image",
    },
  })

  const { isUploading, onUpload } = usePinata({
    control,
    fieldToSetOnSuccess: "image",
  })
  const [progress, setProgress] = useState(0)
  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: false,
    maxSizeMb: 100,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles[0]) return
      onUpload({
        data: [acceptedFiles[0]],
        onProgress: setProgress,
      })
    },
  })

  const WrapperElement = imageField.value ? TiltCard : Fragment

  return (
    <FormControl isInvalid={!!fileRejections?.[0] || !!errors?.image}>
      <FormLabel>Media</FormLabel>

      <WrapperElement borderRadius="xl">
        <AspectRatio ratio={1}>
          <Button
            p={0}
            borderWidth={1}
            variant="ghost"
            w="full"
            {...getRootProps()}
            sx={
              !!imageField.value && {
                "> div": {
                  width: "100%",
                  height: "100%",
                },
              }
            }
          >
            {isUploading ? (
              <VStack p={4}>
                <Text colorScheme="gray" fontSize="sm" fontWeight="normal">
                  Uploading...
                </Text>
                <Progress
                  borderRadius="full"
                  w="full"
                  value={progress * 100}
                  colorScheme="gray"
                />
              </VStack>
            ) : imageField.value ? (
              <Img
                aspectRatio={1}
                objectFit="cover"
                boxSize="full"
                src={imageField.value}
                alt="NFT image"
              />
            ) : (
              <VStack p={4}>
                <Icon as={Image} weight="light" boxSize={16} color="gray" />
                <Text
                  display={{ base: "none", md: "inline" }}
                  colorScheme="gray"
                  fontSize="sm"
                  fontWeight="normal"
                >
                  {isDragActive ? "Drop" : "Choose or drop image here"}
                </Text>
              </VStack>
            )}
            <input {...getInputProps()} hidden />
          </Button>
        </AspectRatio>
      </WrapperElement>

      <FormHelperText>
        JPG / PNG / GIF format, max 100MB. A 1:1 aspect ratio is preferred, but any
        aspect ratio is accepted
      </FormHelperText>

      <FormErrorMessage>
        {fileRejections?.[0]?.errors?.[0]?.message || errors?.image?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ImagePicker
