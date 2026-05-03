/**
 * Express 5 types dynamic route params as `string | string[] | undefined`.
 * Single-segment routes still return one string at runtime; normalize for callers that expect `string`.
 */
export function stringParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
