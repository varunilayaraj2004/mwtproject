import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null && !isLoading) setOpenDetailsDialog(true);
  }, [orderDetails, isLoading]);

  useEffect(() => {
    if (!isLoading && orderDetails === null) {
      console.log("Failed to load order details");
      // Optionally, show a toast or alert here if a toast library is available
    }
  }, [isLoading, orderDetails]);

  console.log(orderDetails, "orderDetails");

  function handleRefreshOrders() {
    dispatch(getAllOrdersByUserId(user?.id));
  }

  return (
    <>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-2xl">
          <CardTitle className="text-2xl font-bold flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Order History</span>
          </CardTitle>
          <Button onClick={handleRefreshOrders} variant="outline" className="bg-white text-purple-600 hover:bg-purple-50 border-white rounded-xl">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Orders
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100">
                  <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Order Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Order Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Order Price</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Quantity</TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList && orderList.length > 0
                  ? orderList.map((orderItem, index) => (
                      <TableRow key={orderItem?._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <TableCell className="font-mono text-sm text-gray-600">{orderItem?._id}</TableCell>
                        <TableCell className="font-medium">{orderItem?.orderDate.split("T")[0]}</TableCell>
                        <TableCell>
                          <Badge
                            className={`py-1 px-3 font-medium ${
                              orderItem?.orderStatus === "confirmed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : orderItem?.orderStatus === "rejected"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }`}
                          >
                            {orderItem?.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-lg text-green-600">${orderItem?.totalAmount}</TableCell>
                        <TableCell className="font-medium">{orderItem?.cartItems?.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-gray-500 text-lg">No orders found</p>
                          <p className="text-gray-400">Your order history will appear here once you make a purchase.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <ShoppingOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </>
  );
}

export default ShoppingOrders;
