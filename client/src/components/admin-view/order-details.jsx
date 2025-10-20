import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetailsorderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl border-0 shadow-2xl">
      <div className="grid gap-8 p-6">
        {/* Order Summary Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h2>
          <p className="text-gray-600">Complete information about your order</p>
        </div>

        {/* Order Information Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Order Information</span>
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50">Order ID</td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-600">{orderDetails?._id}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50">Order Date</td>
                  <td className="py-3 px-4 text-gray-600">{orderDetails?.orderDate.split("T")[0]}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50">Order Price</td>
                  <td className="py-3 px-4 font-bold text-lg text-green-600">₹{orderDetails?.totalAmount}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50">Payment Method</td>
                  <td className="py-3 px-4 text-gray-600">{orderDetails?.paymentMethod}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50">Payment Status</td>
                  <td className="py-3 px-4 text-gray-600">{orderDetails?.paymentStatus}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50">Order Status</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={`py-2 px-4 font-medium text-sm ${
                        orderDetails?.orderStatus === "confirmed"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : orderDetails?.orderStatus === "rejected"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {orderDetails?.orderStatus}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Order Items</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? (() => {
                    const groupedItems = orderDetails.cartItems.reduce((acc, item) => {
                      if (!acc[item.productId]) {
                        acc[item.productId] = { ...item };
                      } else {
                        acc[item.productId].quantity += item.quantity;
                      }
                      return acc;
                    }, {});
                    const groupedArray = Object.values(groupedItems);
                    return groupedArray.map((item, index) => (
                      <div key={item.productId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-20 h-20 object-cover rounded-lg shadow-md"
                            />
                            <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">{item.title}</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                              <p>Price per item: <span className="font-medium text-green-600">₹{item.price}</span></p>
                              <p>Total: <span className="font-bold text-green-600">₹{item.price * item.quantity}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()
                : null}
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Shipping Information</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-600">{user.userName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Address:</span>
                  <span className="text-gray-600 text-right">{orderDetails?.addressInfo?.address}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">City:</span>
                  <span className="text-gray-600">{orderDetails?.addressInfo?.city}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Pincode:</span>
                  <span className="text-gray-600">{orderDetails?.addressInfo?.pincode}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Phone:</span>
                  <span className="text-gray-600">{orderDetails?.addressInfo?.phone}</span>
                </div>
                {orderDetails?.addressInfo?.notes && (
                  <div className="flex justify-between items-start py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Notes:</span>
                    <span className="text-gray-600 text-right ml-4">{orderDetails?.addressInfo?.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Update Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Update Order Status</span>
            </h3>
          </div>
          <div className="p-6">
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
