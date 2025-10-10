import AdminOrdersView from "@/components/admin-view/orders";

function AdminOrders() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Orders</h1>
      <AdminOrdersView />
    </div>
  );
}

export default AdminOrders;
