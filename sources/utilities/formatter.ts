export const DESCRIPTION_NEW_LINE = "<br>";

export const toDescription = (description: string) =>
  description.trim().replace(/\n/g, "\n" + DESCRIPTION_NEW_LINE);
