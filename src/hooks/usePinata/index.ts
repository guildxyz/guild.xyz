import usePinata from "./usePinata"
import { PinataPinFileResponse, PinToIPFSProps } from "./utils/pinataUpload"

export type OnUpload = (props: PinToIPFSProps) => Promise<PinataPinFileResponse>

export default usePinata
