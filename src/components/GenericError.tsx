"use client";

import { type CustomError, NoSkeletonError } from "@/lib/error";
import { useErrorBoundary } from "react-error-boundary";
import type { Jsonify } from "type-fest";
import { ZodError } from "zod";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export const GenericError = ({ error }: { error: Jsonify<CustomError> }) => {
  const e = new NoSkeletonError();
  console.log(e.message);
  const { resetBoundary } = useErrorBoundary();
  const message =
    error instanceof ZodError ? error.issues.at(0)?.message : error.message;

  return (
    <Card role="alert" className="size-full bg-red-400/20 p-6 text-red-200">
      <div className="max-w-prose space-y-4">
        <h3 className="font-bold">Something went wrong on our side</h3>
        <p className="leading-relaxed">{message}</p>
        <Button
          onClick={resetBoundary}
          variant="subtle"
          colorScheme="destructive"
        >
          Try again
        </Button>
      </div>
    </Card>
  );
};
