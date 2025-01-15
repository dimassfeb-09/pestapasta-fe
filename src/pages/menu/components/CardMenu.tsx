import { Add, Remove, Star } from "@mui/icons-material";
import { formatToRupiah } from "../../../utills/toRupiah";
import { Product } from "../../../models/Product";
import { useState } from "react";

interface CardMenuProps {
  total_item: number;
  product: Product;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
  color: string;
}

export default function CardMenu({
  product,
  total_item = 0,
  onAdd,
  onRemove,
  color,
}: CardMenuProps) {
  const [onImageClick, setOnImageClick] = useState<boolean>(false);

  return (
    <>
      {/* Main Card */}
      <div
        key={product.id}
        className={`rounded-md flex items-center justify-between gap-3 p-5 bg-[${color}] border-2 card_makanan relative`}
      >
        {/* Overlay for Out of Stock */}
        {!product.is_available && (
          <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 rounded-md">
            <div className="text-lg font-bold text-white">Out of Stock</div>
          </div>
        )}

        <div className="flex flex-col gap-2 ">
          <div className="font-bold text-md">{product.name}</div>
          <div className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-black border rounded-lg w-max">
            <div>{product.rating}</div>
            <Star fontSize="small" className="text-yellow-500" />
          </div>
          <div className="text-sm">{product.description}</div>
          <div>{formatToRupiah(product.price)}</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div>
            <img
              src={product.image_url}
              className="rounded-lg max-w-28"
              alt={product.name}
              draggable={false}
              onClick={() => setOnImageClick(!onImageClick)}
            />
          </div>

          <div className="z-0 flex w-full mt-1 justify-evenly">
            <div
              onClick={() => onRemove(product)}
              className="z-50 px-1 text-xs text-white transform bg-black rounded-md cursor-pointer"
            >
              <Remove />
            </div>
            <div className="px-1 text-center bg-white">{total_item}</div>
            <div
              onClick={() => onAdd(product)}
              className="z-50 px-1 text-xs text-white transform bg-black rounded-md cursor-pointer"
            >
              <Add />
            </div>
          </div>
        </div>
      </div>

      {/* Image Click Overlay */}
      {onImageClick && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50"
          onClick={() => setOnImageClick(false)}
        >
          <div className="relative w-[28rem] h-[40em] bg-secondary rounded-lg shadow-lg overflow-hidden">
            {/* Content */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-2/5 object-cover"
            />

            {/* Product Details */}
            <div className="p-5 h-3/5 flex flex-col justify-between">
              {/* Name and Rating */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-lg">{product.name}</div>
                  <div className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-black border rounded-lg">
                    <span>{product.rating}</span>
                    <Star fontSize="small" className="text-yellow-500" />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3 text-gray-700">{product.description}</div>

                {/* Price */}
                <div className="text-lg font-semibold">
                  {formatToRupiah(product.price)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setOnImageClick(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onAdd(product);
                    setOnImageClick(false);
                  }}
                  className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
