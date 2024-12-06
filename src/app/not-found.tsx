import "server-only";
import { ErrorPage } from "@/components/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      errorCode="404"
      title="Page not found"
      description="We couldn't find the page you were looking for"
    />
  );
}
