import { ZodError } from "zod";

export type ActionResult<T = undefined> =
  | ({ success: true } & (T extends undefined ? object : { data: T }))
  | { success: false; error: string };

/** Turns any thrown error (Zod validation, Firestore, etc.) into a
 * user-displayable message without leaking stack traces to the client. */
export function actionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    return first ? first.message : fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
