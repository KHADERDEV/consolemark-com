export type PagedResult<T> = {
  items: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
};

export function getPageValue(value: string | undefined) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function getPaginationQuery({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  return {
    limit: String(safePageSize + 1),
    offset: String((safePage - 1) * safePageSize),
  };
}

export function createPagedResult<T>({
  rows,
  page,
  pageSize,
}: {
  rows: T[];
  page: number;
  pageSize: number;
}): PagedResult<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);

  return {
    items: rows.slice(0, safePageSize),
    hasNextPage: rows.length > safePageSize,
    hasPreviousPage: safePage > 1,
    page: safePage,
  };
}

export function paginateItems<T>({
  items,
  page,
  pageSize,
}: {
  items: T[];
  page: number;
  pageSize: number;
}): PagedResult<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const offset = (safePage - 1) * safePageSize;
  const rows = items.slice(offset, offset + safePageSize + 1);

  return createPagedResult({ rows, page: safePage, pageSize: safePageSize });
}
