import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SelectItem } from "@/components/ui/select";
import { formatAmount } from "@/helpers/formatAmount";

import Typography from "@/components/ui/typography";
import { TableSelect } from "@/components/shared/table/TableSelect";
import { OrderBadgeVariants } from "@/constants/badge";
import { OrderStatus } from "@/services/orders/types";
import { CustomerOrder } from "@/services/customers/types";

import { changeOrderStatus } from "@/actions/orders/changeOrderStatus";
import { HasPermission } from "@/hooks/use-authorization";

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<CustomerOrder>[] = [
    {
      header: "order id",
      cell: ({ row }) => row.original.id,
    },
    {
      header: "created at",
      cell: ({ row }) =>
        row.original.created_at
          ? `${format(row.original.created_at, "PP")} ${format(
              row.original.created_at,
              "p"
            )}`
          : "—",
    },
    {
      header: "shipping address",
      cell: ({ row }) => (
        <span className="block max-w-72 truncate">
          {row.original.profiles?.address}
        </span>
      ),
    },
    {
      header: "phone",
      cell: ({ row }) => (
        <Typography className={cn(!row.original.profiles?.phone && "pl-6")}>
          {row.original.profiles?.phone || "—"}
        </Typography>
      ),
    },
    {
      header: "method",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.payment_method}</span>
      ),
    },
    {
      header: "amount",
      cell: ({ row }) => formatAmount(row.original.total_amount),
    },
    {
      header: "status",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Badge
            variant={OrderBadgeVariants[status]}
            className="flex-shrink-0 text-xs capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  if (hasPermission("orders", "canChangeStatus"))
    [
      columns.push({
        header: "action",
        cell: ({ row }) => {
          return (
            <TableSelect
              value={row.original.status}
              toastSuccessMessage="Order status updated successfully."
              queryKey="orders"
              onValueChange={(value) =>
                changeOrderStatus(row.original.id, value as OrderStatus)
              }
            >
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </TableSelect>
          );
        },
      }),
    ];

  return columns;
};
