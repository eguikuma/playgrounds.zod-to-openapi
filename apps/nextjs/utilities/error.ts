import { uniq } from "lodash";

import type { ZodError } from "zod";

type ErrorsFor<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? ErrorsFor<U>[]
    : T[K] extends object
      ? ErrorsFor<T[K]>
      : T[K] extends Array<infer U>
        ? ErrorsFor<U>[]
        : T[K] | undefined;
};

export const ErrorFormat = {
  RAW: "RAW",
  UNIQUE: "UNIQUE",
};
type ErrorFormat = (typeof ErrorFormat)[keyof typeof ErrorFormat];

type ErrorValue = string | string[] | ErrorResult;

type ErrorResult = {
  [key: string]: ErrorValue | null;
};

const raw = <T>(error: ZodError<T>): ErrorResult => {
  const result: ErrorResult = {};

  error.issues.forEach((issue) => {
    let current: ErrorResult = result;
    const path = issue.path;

    for (let i = 0; i < path.length; i++) {
      const key = String(path[i]);

      if (i === path.length - 1) {
        current[key] = issue.message;
      } else {
        if (typeof path[i + 1] === "number") {
          current[key] = current[key] ?? [];
        } else {
          current[key] = current[key] ?? {};
        }
        current = current[key] as ErrorResult;
      }
    }
  });

  return result;
};

const unique = <T>(error: ZodError<T>): ErrorResult => {
  const result: ErrorResult = {};

  error.issues.forEach((issue) => {
    let current: ErrorResult = result;
    const path = issue.path.filter((segment) => typeof segment !== "number");

    for (let i = 0; i < path.length - 1; i++) {
      const key = String(path[i]);
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key] as ErrorResult;
    }

    const lastKey = String(path[path.length - 1]);
    if (lastKey in current) {
      if (typeof current[lastKey] === "string") {
        current[lastKey] = uniq([current[lastKey] as string, issue.message]);
      } else if (Array.isArray(current[lastKey])) {
        if (!(current[lastKey] as string[]).includes(issue.message)) {
          (current[lastKey] as string[]).push(issue.message);
        }
      }
    } else {
      current[lastKey] = issue.message;
    }
  });

  const clean = (result: ErrorResult): ErrorResult => {
    const cleaned: ErrorResult = {};
    for (const [key, value] of Object.entries(result)) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const cleanedValue = clean(value as ErrorResult);
        if (Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          cleaned[key] = value;
        }
      } else if (value != null && value !== "") {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  return clean(result);
};

export const toErrors = <T>(
  error: ZodError<T>,
  format: ErrorFormat = ErrorFormat.RAW,
): ErrorsFor<T> => {
  let errors: ErrorResult;

  switch (format) {
    case ErrorFormat.RAW:
      errors = raw(error);
      break;
    case ErrorFormat.UNIQUE:
      errors = unique(error);
      break;
    default:
      errors = raw(error);
      break;
  }

  return errors as ErrorsFor<T>;
};
