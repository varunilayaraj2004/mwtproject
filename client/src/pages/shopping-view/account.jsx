import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">My Account</h1>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-xl bg-white/90 backdrop-blur-sm p-8 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="profile" className="rounded-md transition-all duration-200 hover:bg-white hover:shadow-sm">Profile</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-md transition-all duration-200 hover:bg-white hover:shadow-sm">Orders</TabsTrigger>
              <TabsTrigger value="address" className="rounded-md transition-all duration-200 hover:bg-white hover:shadow-sm">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="space-y-6">
                <div className="flex items-center space-x-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {user?.userName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{user?.userName}</h2>
                    <p className="text-lg text-gray-600">{user?.email}</p>
                    <p className="text-sm text-indigo-600 font-medium capitalize">{user?.role} Account</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">User Name</h3>
                    <p className="text-gray-900 text-lg">{user?.userName}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">Email Address</h3>
                    <p className="text-gray-900 text-lg">{user?.email}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-800 mb-2">Account Type</h3>
                    <p className="text-gray-900 text-lg capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
