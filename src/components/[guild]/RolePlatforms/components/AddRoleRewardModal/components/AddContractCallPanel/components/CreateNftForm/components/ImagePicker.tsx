import {
  AspectRatio,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Img,
  Text,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { Image } from "phosphor-react"
import { useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { CreateNftFormType } from "../CreateNftForm"

const ImagePicker = () => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<CreateNftFormType>()

  useController({
    name: "image",
    rules: {
      required: "It is required to upload an image",
    },
  })

  const [preview, setPreview] = useState<string>()

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: false,
    maxSizeMb: 50,
    onDrop: (acceptedFiles) => {
      setPreview(URL.createObjectURL(acceptedFiles[0]))
      setValue("image", acceptedFiles[0], {
        shouldValidate: true,
      })
    },
  })

  return (
    <FormControl isInvalid={!!fileRejections?.[0] || !!errors?.image}>
      <FormLabel>Media</FormLabel>

      <AspectRatio ratio={1}>
        <Button p={0} borderWidth={1} variant="ghost" {...getRootProps()}>
          {preview ? (
            <Img aspectRatio={1} objectFit="cover" src={preview} alt="NFT image" />
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

      <FormHelperText display="flex" flexDir="column" gap={1.5} lineHeight={1.5}>
        Please upload an image (max 50MB) in jpg, png, or gif format; while a 1:1
        aspect ratio is preferred, any aspect ratio is accepted.
      </FormHelperText>

      <FormErrorMessage>
        {fileRejections?.[0]?.errors?.[0]?.message || errors?.image?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ImagePicker
