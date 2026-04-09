export interface PaginationModel {
  readonly pages: readonly number[]
  readonly hasPrevious: boolean
  readonly hasNext: boolean
  readonly previousPage: number | null
  readonly nextPage: number | null
  readonly showFirstPage: boolean
  readonly showLastPage: boolean
  readonly hasLeadingEllipsis: boolean
  readonly hasTrailingEllipsis: boolean
}

interface BuildPaginationModelOptions {
  readonly currentPage: number
  readonly totalPages: number
  readonly maxVisible?: number
}

export function buildPaginationModel({
  currentPage,
  totalPages,
  maxVisible = 5,
}: BuildPaginationModelOptions): PaginationModel {
  const safeTotalPages = Math.max(totalPages, 1)
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const end = Math.min(safeTotalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index)

  return {
    pages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < safeTotalPages,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < safeTotalPages ? currentPage + 1 : null,
    showFirstPage: start > 1,
    showLastPage: end < safeTotalPages,
    hasLeadingEllipsis: start > 2,
    hasTrailingEllipsis: end < safeTotalPages - 1,
  }
}
