import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getReviews, addReview } from "@/store/shop/review-slice";
import { Button } from "@/components/ui/button";
import StarRatingComponent from "@/components/common/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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

  const [selectedImage, setSelectedImage] = useState(null); // product image display
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [personImageUrl, setPersonImageUrl] = useState("");
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
        // No image upload logic here anymore
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

  async function handleTryOn() {
    if (!personImageUrl.trim()) {
      toast({ title: "Please provide a person image URL", variant: "destructive" });
      return;
    }

    setIsTryingOn(true);
    setTryOnError("");
    setTryOnResult(null);

    try {
      const response = await fetch('/api/ai/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentImage: productDetails.image,
          personImage: personImageUrl,
          seed: 42
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTryOnResult(data);
        toast({ title: "Try-on completed!" });
      } else {
        setTryOnError(data.error || "Try-on failed");
        toast({ title: data.error || "Try-on failed", variant: "destructive" });
      }
    } catch {
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
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Left / Images Section */}
      <div className="col-span-1">
        {/* Main product image/public view */}
        <img
          src={selectedImage || productDetails.image}
          alt={productDetails?.title}
          className="w-full h-96 lg:h-[500px] rounded-xl object-cover shadow-lg"
        />
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
          {[productDetails.image, ...(productDetails.additionalImages || [])].map(
            (img, idx) =>
              img && (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={`w-24 h-24 rounded-lg cursor-pointer object-cover border-2 transition-all duration-200 hover:scale-105 ${
                    selectedImage === img ? "border-blue-500 shadow-md" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => {
                    setSelectedImage(img);
                  }}
                />
              )
          )}
        </div>

        {/* AI Try-On Section */}
        <div className="mt-8 border-t border-gray-200 pt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-800">AI Try-On Feature</h3>
          <Label htmlFor="personImage" className="block mb-4 text-gray-700 font-medium">Person Image URL</Label>
          <Input
            id="personImage"
            type="url"
            value={personImageUrl}
            onChange={(e) => setPersonImageUrl(e.target.value)}
            placeholder="Enter URL of person image"
            className="mb-6 border-gray-300 focus:border-blue-500 rounded-lg"
          />
          <Button onClick={handleTryOn} disabled={isTryingOn} className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
            {isTryingOn ? "Trying On..." : "Try On"}
          </Button>
          {tryOnError && <p className="text-red-500 mb-4 font-medium">{tryOnError}</p>}
          {tryOnResult && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Try-On Result</h4>
              <img src={tryOnResult.image || tryOnResult.result || tryOnResult} alt="Try-on result" className="w-full rounded-lg shadow-md" />
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
          <StarRatingComponent rating={averageReview} />
          <span className="text-gray-600 font-medium">
            ({averageReview.toFixed(2)})
          </span>
        </div>
        <p className="text-3xl font-bold text-green-600 mb-6">
          ₹
          {productDetails?.salePrice > 0
            ? productDetails.salePrice
            : productDetails?.price}
          {productDetails?.salePrice > 0 && (
            <span className="line-through text-gray-500 ml-3 text-xl">
              ₹{productDetails?.price}
            </span>
          )}
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">{productDetails?.description}</p>

        <Button
          className={`w-56 mb-8 py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
            productDetails.totalStock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
          }`}
          disabled={productDetails.totalStock === 0}
          onClick={handleAddToCart}
        >
          {productDetails.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>

        <Separator />

        {/* Reviews Section */}
        <div className="mt-10 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 flex items-center justify-between">
            Reviews
            <span className="text-lg text-gray-600 font-medium">
              {reviews ? reviews.length : 0} review
              {reviews && reviews.length !== 1 ? "s" : ""}
            </span>
          </h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4 mb-10">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
                  role="article"
                  aria-label={`Review by ${rev.userName}`}
                >
                  <Avatar className="w-10 h-10 border-2 border-gray-300 flex-shrink-0">
                    <AvatarFallback className="text-sm font-semibold">
                      {rev.userName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-3 flex-grow">
                    <h3 className="font-semibold text-gray-800">{rev.userName}</h3>
                    <StarRatingComponent rating={rev.reviewValue} />
                    <p className="text-gray-700 flex-grow">{rev.reviewMessage}</p>
                    {rev.date && (
                      <time
                        dateTime={new Date(rev.date).toISOString()}
                        className="text-sm text-gray-500 font-medium whitespace-nowrap"
                      >
                        {new Date(rev.date).toLocaleDateString()}
                      </time>
                    )}
                  </div>
                  {rev.reviewImage && (
                    <img
                      src={rev.reviewImage}
                      alt="review pic"
                      className="w-16 h-16 rounded-lg shadow-sm object-cover flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-lg">
              No reviews yet. Be the first to review!
            </p>
          )}

          <div className="border-t border-gray-200 pt-8 mt-8">
            <Label htmlFor="reviewMsg" className="mb-4 block text-lg font-semibold text-gray-800">
              Write a review
            </Label>
            <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
            <Input
              id="reviewMsg"
              name="reviewMsg"
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Write a review..."
              className="mt-4 mb-6 border-gray-300 focus:border-blue-500 rounded-lg"
              aria-required="true"
            />

            <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400">
              Submit Review
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="col-span-3 mt-16 bg-white rounded-lg p-8 shadow-sm">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {relatedProducts.length ? (
            relatedProducts.map((relatedProduct) => (
              <ShoppingProductTile
                key={relatedProduct._id}
                product={relatedProduct}
                handleAddtoCart={(productId, totalStock) => {
                  const cartItem = cartItems.items?.find(
                    (item) => item.productId === productId
                  );
                  const currentQuantity = cartItem ? cartItem.quantity : 0;
                  if (currentQuantity + 1 > totalStock) {
                    toast({
                      title: `Only ${currentQuantity} quantity can be added for this item`,
                      variant: "destructive",
                    });
                    return;
                  }
                  dispatch(
                    addToCart({
                      userId: user?.id,
                      productId,
                      quantity: 1,
                    })
                  ).then((data) => {
                    if (data?.payload?.success) {
                      dispatch(fetchCartItems(user?.id));
                      toast({ title: "Product added to cart!" });
                    }
                  });
                }}
              />
            ))
          ) : (
            <p className="text-gray-500 italic text-lg">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
