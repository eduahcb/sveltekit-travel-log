import type * as v from "valibot";

export function formatValibotIssues(issues: v.BaseIssue<unknown>[]) {
  const error: { [key: string]: string } = {};

  for (const issue of issues) {
    const key = issue.path?.[0]?.key as string || "";

    error[key] = issue.message;
  }

  return error;
}
