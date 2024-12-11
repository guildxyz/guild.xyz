"use client";

import { ErrorPage } from "@/components/ErrorPage";

const ErrorBoundary = ({
  error,
}: {
  error: Error & { digest?: string; statusCode?: string };
}) => {
  if (error.cause) console.log(error.cause);

  return (
    <ErrorPage
      title="Something went wrong!"
      correlationId={crypto.randomUUID()}
      description={error.message}
      errorCode={error.statusCode || "ONO"}
    />
  );
};

export default ErrorBoundary;
