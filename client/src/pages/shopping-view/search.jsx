import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  console.log(searchResults, "searchResults");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200 rounded-full opacity-25 animate-pulse"></div>
      </div>

      <div className="container mx-auto md:px-6 px-4 py-8 relative z-10">
        {/* Decorative Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4 font-serif">
            Explore Your Wardrobe
          </h1>
          <p className="text-xl text-gray-600 italic">
            Discover the perfect pieces for your style
          </p>
        </div>

        {/* Search Input with Decorative Styling */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur opacity-25"></div>
            <div className="relative bg-white rounded-full shadow-2xl p-2">
              <Input
                value={keyword}
                name="keyword"
                onChange={(event) => setKeyword(event.target.value)}
                className="py-6 px-8 text-lg border-0 focus:ring-0 focus:outline-none rounded-full bg-transparent"
                placeholder="Search for fashion treasures..."
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* No Results Message with Styling */}
        {!searchResults.length ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5M12 4.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-700 mb-4">No Fashion Finds Yet!</h1>
            <p className="text-lg text-gray-500">Try searching for dresses, shoes, or accessories to fill your wardrobe.</p>
          </div>
        ) : null}

        {/* Product Grid with Enhanced Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {searchResults.map((item) => (
            <div key={item.id} className="transform hover:scale-105 transition-transform duration-300">
              <ShoppingProductTile
                handleAddtoCart={handleAddtoCart}
                product={item}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchProducts;
