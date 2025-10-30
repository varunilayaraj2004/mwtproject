import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

import { useState } from "react";

import PropTypes from "prop-types";

function ShoppingProductTile({
  product,
  handleAddtoCart,
}) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="w-full rounded-3xl max-w-sm mx-auto hover:shadow-2xl group">
      <div onClick={() => navigate(`/shop/product/${product?._id}`)} className="cursor-pointer">
        <div className="relative">
          <img
            src={imgError ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23ccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E" : product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-2xl transform transition-transform duration-300 hover:scale-110 hover:shadow-xl"
            onError={() => setImgError(true)}
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          {(product?.size || product?.fit || product?.material) && (
            <div className="text-xs text-gray-500 mb-3 space-y-1">
              {product?.size && product.size.length > 0 && (
                <div>Sizes: {product.size.join(', ')}</div>
              )}
              {product?.fit && (
                <div>Fit: {product.fit}</div>
              )}
              {product?.material && (
                <div>Material: {product.material}</div>
              )}
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-primary">
              ₹
              {product?.salePrice > 0 ? product.salePrice : product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold text-muted-foreground line-through">
                ₹{product?.price}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-6 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed bg-gray-400 text-white font-semibold py-3 rounded-xl">
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

ShoppingProductTile.propTypes = {
  product: PropTypes.object.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
};

export default ShoppingProductTile;
