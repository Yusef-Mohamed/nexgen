import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { IOrder } from "@/types";
import { useTranslations } from "next-intl";
const formatDate = (date: Date) => {
  return format(date, "yyyy MM dd").split(" ").join("-");
};
const OrdersDialog = ({ orders }: { orders: IOrder[] }) => {
  const t = useTranslations("teamManagement");
  if (!orders?.length) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {t("noOrders")}
      </span>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
        {orders.length} {t("order")}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("orderDetails")}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>{t("course/service/path")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("paymentMethod")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("paidAt")}</TableHead>
              <TableHead>{t("isResale")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {order.course?.title ||
                    order.package?.title ||
                    order.coursePackage?.title}
                </TableCell>
                <TableCell>${order.totalOrderPrice.toLocaleString()}</TableCell>
                <TableCell>{order.paymentMethodType}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.isPaid ? t("paid") : t("unpaid")}
                  </span>
                </TableCell>
                <TableCell>
                  {order.paidAt ? formatDate(new Date(order.paidAt)) : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.isResale
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.isResale ? t("yes") : t("no")}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersDialog;
