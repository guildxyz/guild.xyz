import fleekStorage from "@fleekhq/fleek-storage-js"
import multer from "multer"
import type { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const handler = nextConnect({
  onError(error, req, res: NextApiResponse) {
    res.status(501).json({ error: `${error.message}` })
  },
})
handler.use(upload.single("nftImage"))

const uploadImage = async (key: string, file: File) => {
  const uploadedFile = await fleekStorage.upload({
    apiKey: process.env.FLEEK_API_KEY,
    apiSecret: process.env.FLEEK_API_SECRET,
    key,
    data: file,
  })
  return uploadedFile.publicUrl
}

type Data = {
  publicUrl: string
}

handler.post(
  async (req: NextApiRequest & { file: any }, res: NextApiResponse<Data>) => {
    const publicUrl = await uploadImage(req.file.originalname, req.file.buffer)
    res.status(200).json({ publicUrl })
  }
)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
