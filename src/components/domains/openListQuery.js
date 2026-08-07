export const hasOpenListQuery = (query) =>
  Object.prototype.hasOwnProperty.call(query, 'open')

export const parseOpenListIds = (query) => {
  if (!hasOpenListQuery(query)) {
    return []
  }

  const values = Array.isArray(query.open) ? query.open : [query.open]

  return [...new Set(
    values
      .flatMap((value) => String(value ?? '').split(','))
      .map((value) => value.trim())
      .filter((value) => /^\d+$/.test(value)),
  )]
}
