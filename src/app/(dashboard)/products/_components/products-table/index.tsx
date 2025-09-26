"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import ProductsTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/components/shared/table/TableSkeleton";
import TableError from "@/components/shared/table/TableError";

import { getSearchParams } from "@/helpers/getSearchParams";
import { fetchProducts } from "@/services/products";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { RowSelectionProps } from "@/types/data-table";
import { useAuthorization } from "@/hooks/use-authorization";

export default function AllProducts({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });
  const { page, limit, search, category, price, date } =
    getSearchParams(useSearchParams());

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "products",
      page,
      limit,
      search,
      category,
      price,
      date,
    ],
    queryFn: () =>
      fetchProducts(getSupabaseBrowserClient(), {
        page,
        limit,
        search,
        category,
        priceSort: price,
        dateSort: date,
      }),
    placeholderData: keepPreviousData,
  });

  if (isLoading)
    return <TableSkeleton perPage={limit} columns={skeletonColumns} />;

  if (isError || !products)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch products."
        refetch={refetch}
      />
    );

  return (
    <ProductsTable
      columns={columns}
      data={products.data}
      pagination={products.pagination}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}