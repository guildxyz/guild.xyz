import { ErrorInfo } from "components/common/Error"

const EMAIL_RESTRICTION = "You will be able to perform this action at: "

const HUMAN_READABLE_MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const processEmailError = (paramError: any): ErrorInfo => {
  const error = paramError?.error ?? paramError
  if (typeof error === "string") {
    if (error.includes(EMAIL_RESTRICTION)) {
      const [, isoString] = error.split(EMAIL_RESTRICTION)
      const date = new Date(isoString)
      return {
        title: "Timed out",
        description: `You are timed out from email verification until ${
          HUMAN_READABLE_MONTH[date.getMonth()]
        }  ${date.getDate()}. ${date.getHours()}:${date.getMinutes()}`,
      }
    }

    return {
      title: "Email verification failed",
      description: error?.replace("Error: ", ""),
    }
  }

  return {
    title: "Email verification failed",
    description:
      error?.errors?.[0]?.msg?.replace("Error: ", "") ?? "Something went wrong",
  }
}

export default processEmailError
