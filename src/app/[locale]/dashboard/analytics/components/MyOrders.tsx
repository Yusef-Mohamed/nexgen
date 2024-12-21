// import { createClientAxiosInstance } from "@/app/lib/utils";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useAnalyticsStore } from "@/stores/AnalyticsStore";
// import { IOrder } from "@/types";
// import { getCookie } from "cookies-next";
// import { useTranslations } from "next-intl";
// import { useEffect, useState } from "react";

// const MyOrders = () => {
//   const text = useTranslations("table");
//   const token = getCookie("token");
//   const thisAccount = JSON.parse(getCookie("user") || "{}");
//   const [orders, setOrders] = useState<IOrder[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { selectedUser } = useAnalyticsStore();
//   const getOrders = async () => {
//     try {
//       const axiosInstance = createClientAxiosInstance();

//       const res = await axiosInstance.get(
//         `/orders${
//           selectedUser === thisAccount._id ? "" : "?userId=" + selectedUser
//         }`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setOrders(res.data.data);
//     } catch (err) {
//       console.log("orders", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (selectedUser) getOrders();
//   }, [selectedUser]);
//   return (
//     <div className="p-4 bg-background rounded-xl">
//       <Table className="border">
//         <TableHeader>
//           <TableRow>
//             <TableHead>{text("totalPrice")}</TableHead>
//             <TableHead>{text("item")}</TableHead>
//             <TableHead>{text("paidAt")}</TableHead>
//             <TableHead>{text("paidWith")}</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {isLoading &&
//             Array.from({ length: 3 }).map((_, i) => (
//               <TableRow key={"skeleton" + i}>
//                 <TableCell className="text-center">
//                   <div className="w-full p-2 bg-muted animate-pulse rounded-xl" />
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <div className="w-full p-2 bg-muted animate-pulse rounded-xl" />
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <div className="w-full p-2 bg-muted animate-pulse rounded-xl" />
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <div className="w-full p-2 bg-muted animate-pulse rounded-xl" />
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <div className="w-full p-2 bg-muted animate-pulse rounded-xl" />
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <div className="w-full p-2 bg-muted animate-pulse rounded-xl" />
//                 </TableCell>
//               </TableRow>
//             ))}
//           {!isLoading &&
//             orders.map((order) => <OrderRow key={order._id} order={order} />)}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default MyOrders;
// const OrderRow: React.FC<{ order: IOrder }> = ({ order }) => {
//   return (
//     <>
//       <TableRow>
//         <TableCell>{order.totalOrderPrice}</TableCell>
//         <TableCell>
//           {order.course?.title}
//           {order.coursePackage?.title}
//           {order.package?.title}
//         </TableCell>
//         <TableCell>{new Date(order.paidAt).toDateString()}</TableCell>
//         <TableCell>{order.paymentMethodType}</TableCell>{" "}
//       </TableRow>
//     </>
//   );
// };
const Test = () => {
  return <></>;
};

export default Test;
