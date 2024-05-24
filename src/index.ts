export function sql<T extends unknown[]>(
  strings: TemplateStringsArray,
  ...params: T
): { text: string; values: T } {
  const queryParts: string[] = [];
  const paramCount = params.length;

  for (let i = 0; i < paramCount; i++) {
    queryParts.push(strings[i], `$${i + 1}`);
  }

  // Add the last string from the template literals array
  queryParts.push(strings[paramCount]);

  return { text: queryParts.join(''), values: params };
}
