import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeatureImage,
  getFeatureImages,
  getDashboardStats,
} from "@/store/common-slice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import ProductImageUpload from "@/components/admin-view/image-upload";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();

  const { featureImageList, dashboardStats, loading } = useSelector(
    (state) => state.commonFeature
  );

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 space-y-8">
      {/* Upload Section */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Upload Feature Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={() => {
              dispatch(addFeatureImage(uploadedImageUrl)).then(() => {
                dispatch(getFeatureImages());
                setImageFile(null);
                setUploadedImageUrl("");
              });
            }}
            className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload
          </Button>
        </CardContent>
      </Card>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 shadow-md">
          <CardTitle>Total Stock</CardTitle>
          <CardContent>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              {dashboardStats?.totalStock ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="p-4 shadow-md">
          <CardTitle>Items Sold</CardTitle>
          <CardContent>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {dashboardStats?.itemsSold ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="p-4 shadow-md">
          <CardTitle>Total Profit</CardTitle>
          <CardContent>
            <p className="text-3xl font-bold mt-2 text-yellow-600">
              ₹{dashboardStats?.profit ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Stock Chart */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Stock by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardStats?.stockData || []}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#36A2EB" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Chart */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Profit vs Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardStats?.profitData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(dashboardStats?.profitData || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
