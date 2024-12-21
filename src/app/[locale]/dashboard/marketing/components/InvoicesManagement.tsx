// "use client";
// import React, { useState } from "react";
// import { useLocale, useTranslations } from "next-intl";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { useAuth } from "@/components/auth-provider";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import TrendBadge from "@/components/TrendBadge";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";

// const defaultData = {
//   status: "success",
//   marketLog: {
//     _id: "6621f90e5834a7385bbf4786",
//     role: "head",
//     marketer: {
//       _id: "65edd0c1024a12daed11854e",
//       name: "انا عبده يكتفها",
//       email: "admin@gmail.com",
//       profileImg:
//         "profileImg-5d0a00c1-c185-45f9-b51c-c1e80b4a8601-1714973393762.png",
//     },
//     totalSalesMoney: 14000,
//     invoices: [
//       {
//         totalSalesMoney: 2000,
//         mySales: 1,
//         profitPercentage: 40,
//         profits: 800,
//         desc: "Invoice for period : April 19 (Friday) to  November 16 (Saturday)",
//         paymentMethod: "paypal",
//         receiverAcc: "hello@example.com",
//         createdAt: "2024-11-16T12:21:05.534Z",
//         status: "unpaid",
//         _id: "67388e384c29ced3b4f2dbd0",
//       },
//       {
//         totalSalesMoney: 4000,
//         mySales: 1,
//         profitPercentage: 50,
//         profits: 2200,
//         desc: "Invoice for period : November 16 (Saturday) to  November 16 (Saturday)",
//         paymentMethod: "paypal",
//         receiverAcc: "hello@example.com",
//         createdAt: "2024-11-16T12:21:05.534Z",
//         status: "unpaid",
//         _id: "67388e9e4c29ced3b4f2dbea",
//       },
//       {
//         totalSalesMoney: 8000,
//         mySales: 2,
//         profitPercentage: 50,
//         profits: 4000,
//         desc: "Invoice for period : November 16 (Saturday) to  November 16 (Saturday)",
//         paymentMethod: "paypal",
//         receiverAcc: "hello@example.com",
//         createdAt: "2024-10-16T12:27:55.472Z",
//         status: "unpaid",
//         _id: "67388fd6a410a714f7b23f4d",
//       },
//     ],
//     walletInvoices: [],
//     transactionInvoices: [],
//     sales: [
//       {
//         purchaser: {
//           _id: "6621f8267d8a764871f78da1",
//           name: "m1",
//           email: "m1@gmail.com",
//         },
//         amount: 2000,
//         type: "package",
//         item: "node js course",
//         Date: "2024-11-16T11:58:23.089Z",
//         _id: "67388aa5b36d080569083d89",
//       },
//       {
//         purchaser: {
//           _id: "6621f8267d8a764871f78da1",
//           name: "m1",
//           email: "m1@gmail.com",
//         },
//         amount: 4000,
//         item: "node js course",
//         Date: "2024-11-16T12:21:05.534Z",
//         _id: "67388e8b4c29ced3b4f2dbd8",
//       },
//     ],
//     commissions: [
//       {
//         member: "6621f8267d8a764871f78da1",
//         profit: 8060,
//         lastUpdate: "2024-11-18T14:31:42.964Z",
//         _id: "673a4aa92b0cd000bf0101d8",
//       },
//     ],
//     profits: 7000,
//     withdrawals: 3000,
//     availableToWithdraw: 4000,
//     salesMoneyDifference: 6000,
//     profitsDifference: 3000,
//   },
// };

// const InvoicesManagement = () => {
//   const t = useTranslations("invoicesManagement");
//   const locale = useLocale();
//   const { token } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState(defaultData);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("ar-EG", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "paid":
//         return "bg-primary";
//       case "unpaid":
//         return "bg-destructive";
//       default:
//         return "bg-yellow-500 dark:bg-yellow-600";
//     }
//   };

//   const marketLog = data.marketLog;
//   const CommissionTab = ({ all }: { all?: boolean }) => (
//     <TabsContent value="commission">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>{t("commission.member")}</TableHead>
//             <TableHead>{t("commission.profit")}</TableHead>
//             <TableHead>{t("commission.lastUpdate")}</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {marketLog.commissions
//             .slice(0, all ? marketLog.commissions.length : 5)
//             .map((commission) => (
//               <TableRow key={commission._id}>
//                 <TableCell>{commission.member}</TableCell>
//                 <TableCell>${commission.profit.toLocaleString()}</TableCell>
//                 <TableCell>{formatDate(commission.lastUpdate)}</TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>
//     </TabsContent>
//   );
//   const SalesTab = ({ all }: { all?: boolean }) => (
//     <TabsContent value="sales">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>{t("sales.purchaser")}</TableHead>
//             <TableHead>{t("sales.item")}</TableHead>
//             <TableHead>{t("sales.amount")}</TableHead>
//             <TableHead>{t("sales.type")}</TableHead>
//             <TableHead>{t("sales.date")}</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {marketLog.sales
//             .slice(0, all ? marketLog.commissions.length : 5)
//             .map((sale) => (
//               <TableRow key={sale._id}>
//                 <TableCell>{sale.purchaser.name}</TableCell>
//                 <TableCell>{sale.item}</TableCell>
//                 <TableCell>${sale.amount.toLocaleString()}</TableCell>
//                 <TableCell>{sale.type || "-"}</TableCell>
//                 <TableCell>{formatDate(sale.Date)}</TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>
//     </TabsContent>
//   );
//   const InvoicesContent = ({ all }: { all?: boolean }) => (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>{t("invoices.period")}</TableHead>
//           <TableHead>{t("invoices.mySales")}</TableHead>
//           <TableHead>{t("invoices.totalSales")}</TableHead>
//           <TableHead>{t("invoices.profit")}</TableHead>
//           <TableHead>{t("invoices.status")}</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {marketLog.invoices
//           .slice(0, all ? marketLog.commissions.length : 5)
//           .map((invoice) => (
//             <TableRow key={invoice._id}>
//               <TableCell>{invoice.desc}</TableCell>
//               <TableCell>{invoice.mySales}</TableCell>
//               <TableCell>${invoice.totalSalesMoney}</TableCell>
//               <TableCell>${invoice.profits}</TableCell>
//               <TableCell>
//                 <Badge className={getStatusColor(invoice.status)}>
//                   {invoice.status}
//                 </Badge>
//               </TableCell>
//             </TableRow>
//           ))}
//       </TableBody>
//     </Table>
//   );

//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardContent className="p-4">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 {t("stats.totalSales")}
//               </p>
//               <h3 className="mt-1 mb-2 font-semibold h1-5">
//                 ${marketLog.totalSalesMoney.toLocaleString()}
//               </h3>
//             </div>
//             <TrendBadge
//               percentage={Math.abs(
//                 (marketLog.salesMoneyDifference / marketLog.totalSalesMoney) *
//                   100
//               ).toFixed(1)}
//               positive={marketLog.salesMoneyDifference > 0}
//             />
//             <RenderFakeChart positive={marketLog.salesMoneyDifference > 0} />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 {t("stats.profit")}
//               </p>
//               <h3 className="mt-1 mb-2 font-semibold h1-5">
//                 ${marketLog.profits.toLocaleString()}
//               </h3>
//             </div>
//             <TrendBadge
//               percentage={Math.abs(
//                 (marketLog.profitsDifference / marketLog.profits) * 100
//               ).toFixed(1)}
//               positive={marketLog.profitsDifference > 0}
//             />
//             <RenderFakeChart positive={marketLog.profitsDifference > 0} />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 {t("stats.withdrawals")}
//               </p>
//               <h3 className="mt-1 mb-2 font-semibold h1-5">
//                 ${marketLog.withdrawals.toLocaleString()}
//               </h3>
//             </div>
//             <TrendBadge percentage={"55.5"} positive={false} />
//             <RenderFakeChart positive={false} />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex flex-col items-center justify-center h-full p-4">
//             <div className="relative">
//               <Image
//                 src={"/images/balance_card.svg"}
//                 alt="balance card"
//                 width={500}
//                 height={500}
//                 className="aspect-[340/176] w-full"
//               />
//               <div
//                 dir="ltr"
//                 className="absolute top-0 right-0 flex flex-col items-start justify-center w-full h-full px-4"
//               >
//                 <p className="text-sm text-gray-200">Current Balance</p>
//                 <h3 className="mt-1 mb-2 font-semibold text-white h1-5">
//                   ${marketLog.availableToWithdraw.toLocaleString()}
//                 </h3>
//               </div>
//             </div>
//             <Button className="w-full mt-4" variant={"outline"}>
//               {t("stats.withdraw")}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <Tabs
//           defaultValue="commission"
//           dir={locale === "ar" ? "rtl" : "ltr"}
//           className="w-full"
//         >
//           <TableWithModal
//             header={
//               <TabsList>
//                 <TabsTrigger value="commission">
//                   {t("tabs.commission")}
//                 </TabsTrigger>
//                 <TabsTrigger value="sales">{t("tabs.sales")}</TabsTrigger>
//               </TabsList>
//             }
//             modalContent={
//               <>
//                 <CommissionTab all />
//                 <SalesTab all />
//               </>
//             }
//           >
//             <CommissionTab />
//             <SalesTab />
//           </TableWithModal>
//         </Tabs>
//       </Card>

//       <Card>
//         <TableWithModal
//           header={<CardTitle>{t("invoices.title")}</CardTitle>}
//           modalContent={<InvoicesContent all />}
//         >
//           <InvoicesContent />
//         </TableWithModal>
//       </Card>
//     </div>
//   );
// };
// const TableWithModal = ({
//   header,
//   hideModal = false,
//   children,
//   modalContent,
// }: {
//   header: React.ReactNode;
//   hideModal?: boolean;
//   children: React.ReactNode;
//   modalContent: React.ReactNode;
// }) => {
//   const t = useTranslations("invoicesManagement");
//   const locale = useLocale();
//   return (
//     <>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>{header}</CardTitle>
//         {!hideModal && (
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="ghost" className="gap-2 text-text-3">
//                 {t("common.showAll")}
//                 <ArrowRight
//                   className={cn("w-4 h-4", {
//                     "rotate-180": locale === "ar",
//                   })}
//                 />
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>{header}</DialogTitle>
//               </DialogHeader>
//               {modalContent}
//             </DialogContent>
//           </Dialog>
//         )}
//       </CardHeader>
//       <CardContent>{children}</CardContent>
//     </>
//   );
// };
// // Fake chart component for statistics cards
// const RenderFakeChart = ({ positive }: { positive: boolean }) => (
//   <Image
//     src={`/images/invoices_${positive ? "up" : "down"}_chart.svg`}
//     alt="chart"
//     width={500}
//     height={500}
//     className="w-full aspect-[189/120] mt-4 object-cover"
//   />
// );

// export default InvoicesManagement;
const Test = () => {
  return <></>;
};

export default Test;
