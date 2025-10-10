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
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <Button onClick={handleRefreshOrders} variant="outline">
            Refresh Orders
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>Total Quantity</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id}>
                      <TableCell>{orderItem?._id}</TableCell>
                      <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-blue-400 text-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>${orderItem?.totalAmount}</TableCell>
                      <TableCell>{orderItem?.cartItems?.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
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
