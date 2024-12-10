import type { PartialDeep, Primitive } from "type-fest";

//export const promptRetryMessages = [
//  "Please try refreshing or contact support if the issue persists.",
//  "Please follow the instructions provided or contact support for assistance.",
//] as const;

/**
 * Marker type for indicating if a function could throw an Error
 * Note: There is no type enforcement that confirms this type's claim.
 */
export type Either<Data, _ extends Error> = Data;

type Cause = [TemplateStringsArray, ...Primitive[]];

class CustomError extends Error {
  public readonly cause: ReturnType<typeof CustomError.expected>;
  public readonly name: string;
  public readonly displayMessage: string;

  public override get message() {
    return [this.displayMessage, this.cause].filter(Boolean).join("\n\n");
  }

  public static expected(...args: [TemplateStringsArray, ...Primitive[]]) {
    return args;
  }

  constructor(
    props?: PartialDeep<{
      message: string;
      cause: Cause;
    }>,
  ) {
    super(props?.message, { cause: props?.cause });

    this.name = this.constructor.name;
    this.displayMessage = props?.message || this.defaultDisplayMessage;
    this.cause = props?.cause ?? CustomError.expected``; // { code: this.name, values: {}, ...props?.cause };
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
    };
  }

  protected get defaultDisplayMessage() {
    return "An error occurred.";
  }
}

export class NoSkeletonError extends CustomError {
  protected override get defaultDisplayMessage() {
    return "Something went wrong while loading the page.";
  }
}

export class NotImplementedError extends CustomError {}

export class ValidationError extends CustomError {
  protected override get defaultDisplayMessage() {
    return "There are issues with the provided data.";
  }

  //constructor(...props: ConstructorParameters<typeof CustomError>) {
  //  super(...props);
  //}
}
