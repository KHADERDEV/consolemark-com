import Link from "next/link";

type PagePaginationProps = {
  basePath: string;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchParams: Record<string, string | undefined>;
  ariaLabel: string;
  alwaysShow?: boolean;
};

function getPageHref({
  basePath,
  page,
  searchParams,
}: {
  basePath: string;
  page: number;
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== "page" && value) {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `${basePath}?${query}` : basePath;
}

function getVisiblePages({
  currentPage,
  hasNextPage,
}: {
  currentPage: number;
  hasNextPage: boolean;
}) {
  const pages = new Set<number>();

  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }

  pages.add(currentPage);

  if (hasNextPage) {
    pages.add(currentPage + 1);
  }

  return Array.from(pages).sort((first, second) => first - second);
}

export function PagePagination({
  basePath,
  currentPage,
  hasNextPage,
  hasPreviousPage,
  searchParams,
  ariaLabel,
  alwaysShow = false,
}: PagePaginationProps) {
  if (!alwaysShow && !hasPreviousPage && !hasNextPage) {
    return null;
  }

  const visiblePages = getVisiblePages({ currentPage, hasNextPage });

  return (
    <nav
      aria-label={ariaLabel}
      className="flex w-full flex-wrap items-center justify-center gap-2 pt-4"
    >
      {hasPreviousPage ? (
        <Link
          href={getPageHref({
            basePath,
            page: currentPage - 1,
            searchParams,
          })}
          className="inline-flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-sm text-black transition hover:border-black hover:bg-neutral-50"
          aria-label="Previous page"
        >
          Prev
        </Link>
      ) : null}

      {visiblePages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="inline-flex size-11 items-center justify-center rounded-full bg-black text-sm text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={getPageHref({ basePath, page, searchParams })}
            className="inline-flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-sm text-black transition hover:border-black hover:bg-[#55d3e8]"
          >
            {page}
          </Link>
        ),
      )}

      {hasNextPage ? (
        <Link
          href={getPageHref({
            basePath,
            page: currentPage + 1,
            searchParams,
          })}
          className="inline-flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-sm text-black transition hover:border-black hover:bg-[#55d3e8]"
          aria-label="Next page"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
