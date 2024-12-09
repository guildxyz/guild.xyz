export const promptRetryMessages = [
  "Please try refreshing or contact support if the issue persists.",
  "Please follow the instructions provided or contact support for assistance.",
] as const;

export type Either<Data, _ extends Error> = Data;

type Cause = {
  code: string;
  values: string;
};

type ConstructorProps<T = object> = [
  message?: string,
  options?: T & Partial<{ cause: Cause }>,
];

export class CustomError extends Error {
  public readonly cause: Cause;
  public readonly message: string;
  public readonly name: string;
  public readonly isExpected: boolean;

  constructor(
    ...[message, options, internalOptions]: [
      ...ConstructorProps,
      { isExpected: boolean },
    ]
  ) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.message = message || "An error occurred.";
    this.cause = { code: this.name, values: "", ...options?.cause };
    this.isExpected = internalOptions.isExpected;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      isExpected: this.isExpected,
    };
  }
}

export class NoSkeletonError extends CustomError {
  constructor(...[message, options]: ConstructorProps) {
    super(message || "Something went wrong while loading the page.", options, {
      isExpected: false,
    });
  }
}

export class ValidationError extends CustomError {
  constructor(...[message, options]: ConstructorProps) {
    super(message || "There are issues with the provided data.", options, {
      isExpected: true,
    });
  }
}

export class FetchError extends CustomError {
  public readonly status: number;
  public readonly statusText: string;
  public readonly headers: Headers;

  constructor(
    ...[message, options]: Required<ConstructorProps<{ response: Response }>>
  ) {
    super(message, options, { isExpected: true });
    this.status = options.response.status;
    this.statusText = options.response.statusText;
    this.headers = options.response.headers;
  }
}
