import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getReviews, addReview } from "@/store/shop/review-slice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // AI Try-On states
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [personImageFile, setPersonImageFile] = useState(null);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [tryOnError, setTryOnError] = useState("");

  // Fetch product details
  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [id, dispatch]);

  // When product details load
  useEffect(() => {
    if (productDetails) {
      setSelectedImage(productDetails.image);
      dispatch(getReviews(productDetails._id));

      // Related products
      dispatch(
        fetchAllFilteredProducts({
          filterParams: {
            brand: productDetails.brand,
            category: productDetails.category,
          },
          sortParams: "price-lowtohigh",
        })
      ).then((res) => {
        if (res?.payload?.data) {
          const filtered = res.payload.data.filter(
            (prod) => prod._id !== productDetails._id
          );
          setRelatedProducts(filtered);
        }
      });
    }
  }, [productDetails, dispatch]);

  // Star Rating Component
  function StarRating({ rating = 0, onStarClick }) {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => onStarClick && onStarClick(index + 1)}
            className={`text-2xl cursor-pointer transition-colors ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  function handleAddToCart() {
    if (!productDetails) return;

    const items = cartItems.items || [];
    const found = items.find((item) => item.productId === productDetails._id);
    if (found && found.quantity + 1 > productDetails.totalStock) {
      toast({
        title: `Only ${found.quantity} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails._id,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddReview() {
    if (!productDetails || isSubmittingReview) return;
    if (!user?.id) {
      toast({ title: "Please login to submit a review", variant: "destructive" });
      return;
    }

    setIsSubmittingReview(true);

    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user.id,
        userName: user.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    )
      .then((data) => {
        if (data.payload?.success) {
          setRating(0);
          setReviewMsg("");
          dispatch(getReviews(productDetails._id));
          toast({ title: "Review added successfully!" });
        }
      })
      .catch((error) => {
        toast({
          title: error?.response?.data?.message || "Failed to add review",
          variant: "destructive",
        });
      })
      .finally(() => setIsSubmittingReview(false));
  }

  // AI Try-On handler (fixed)
    async function handleTryOn() {
      if (!personImageFile) {
        toast({ title: "Please upload a person image file", variant: "destructive" });
        return;
      }
      if (!productDetails?.image) {
        toast({ title: "Product image is not loaded yet", variant: "destructive" });
        return;
      }

      setIsTryingOn(true);
      setTryOnError("");
      setTryOnResult(null);

      try {
        const formData = new FormData();
        formData.append("person", personImageFile);

        // Convert product image URL to File
        const productResponse = await fetch(productDetails.image);
        const productBlob = await productResponse.blob();
        formData.append("garment", new File([productBlob], "garment.png", { type: productBlob.type }));

        const ngrokUrl = "https://pentadactyl-avianna-limicolous.ngrok-free.dev/tryon";

        const response = await fetch(ngrokUrl, {
          method: "POST",
          body: formData,
          headers: {
            "User-Agent": "my-app" // any non-standard string
          },
        });
        const data = await response.json();

        if (response.ok) {
          setTryOnResult(data.image || data.result || data);
          toast({ title: "Try-on completed!" });
        } else {
          setTryOnError(data.error || "Try-on failed");
          toast({ title: data.error || "Try-on failed", variant: "destructive" });
        }
      } catch (error) {
        setTryOnError("Failed to try on");
        toast({ title: "Failed to try on", variant: "destructive" });
      } finally {
        setIsTryingOn(false);
      }
    }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Left / Images Section */}
      <div className="col-span-1">
        <img
          src={selectedImage || productDetails.image}
          alt={productDetails?.title}
          className="w-full h-96 lg:h-[500px] rounded-2xl object-cover shadow-xl border-4 border-white"
        />
        <div className="flex gap-4 mt-8 overflow-x-auto pb-2">
          {[productDetails.image, ...(productDetails.additionalImages || [])].map(
            (img, idx) =>
              img && (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={`w-20 h-20 rounded-xl cursor-pointer object-cover border-4 transition-all duration-300 hover:scale-110 shadow-md ${
                    selectedImage === img ? "border-blue-500 shadow-lg ring-2 ring-blue-300" : "border-gray-200 hover:border-blue-400"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              )
          )}
        </div>

        {/* AI Try-On Section */}
        <div className="mt-10 border-t border-gray-200 pt-8 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">AI Try-On Feature</h3>
          <Label htmlFor="personImage" className="block mb-4 text-gray-700 font-semibold text-lg">
            Upload Person Image
          </Label>
          <input
            id="personImage"
            type="file"
            accept="image/*"
            onChange={(e) => setPersonImageFile(e.target.files[0])}
            className="mb-6 rounded-xl py-3 px-4 text-lg border border-gray-300"
          />
          <Button
            onClick={handleTryOn}
            disabled={isTryingOn}
            className="w-full mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isTryingOn ? "Trying On..." : "Try On"}
          </Button>
          {tryOnError && <p className="text-red-500 mb-4 font-medium text-center">{tryOnError}</p>}
          {tryOnResult && (
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Try-On Result</h4>
              <img
                src={tryOnResult.image || tryOnResult.result || tryOnResult}
                alt="Try-on result"
                className="w-full rounded-xl shadow-lg border-4 border-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right / Product Info Section */}
      <div className="col-span-2 flex flex-col space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          {productDetails?.title}
        </h1>
        <div className="flex items-center gap-4 mb-6">
          <StarRating rating={averageReview} />
          <span className="text-gray-600 font-medium">({averageReview.toFixed(2)})</span>
        </div>
        <p className="text-3xl font-bold text-green-600 mb-6">
          ₹
          {productDetails?.salePrice > 0 ? productDetails.salePrice : productDetails?.price}
          {productDetails?.salePrice > 0 && (
            <span className="line-through text-gray-500 ml-3 text-xl">₹{productDetails?.price}</span>
          )}
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">{productDetails?.description}</p>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <span className="text-gray-500 font-semibold">Brand:</span> {productDetails?.brand}
          </div>
          <div>
            <span className="text-gray-500 font-semibold">Category:</span> {productDetails?.category}
          </div>
          <div>
            <span className="text-gray-500 font-semibold">Stock:</span> {productDetails?.totalStock}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-1/2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
        >
          Add to Cart
        </Button>

        <Separator />

        {/* Reviews */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          {reviews && reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r._id} className="flex gap-4 items-start mb-4">
                <Avatar>
                  <AvatarFallback>{r.userName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{r.userName}</span>
                    <StarRating rating={r.reviewValue} />
                  </div>
                  <p className="text-gray-600">{r.reviewMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}

          {/* Add Review */}
          {user?.id && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold mb-2">Add Your Review</h3>
              <StarRating rating={rating} onStarClick={handleRatingChange} />
              <textarea
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write your review..."
                className="w-full mt-2 p-4 rounded-xl border border-gray-300"
              />
              <Button
                onClick={handleAddReview}
                disabled={isSubmittingReview}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl py-3 px-6 transition-all duration-300"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ShoppingProductTile key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsPage;
