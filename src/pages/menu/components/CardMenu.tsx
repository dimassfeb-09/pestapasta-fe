import { Add, Remove, Star } from "@mui/icons-material";
import { formatToRupiah } from "../../../utills/toRupiah";
import { Product } from "../../../models/Product";
import { useState } from "react";

interface CardMenuProps {
  total_item: number;
  product: Product;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
}

export default function CardMenu({
  product,
  total_item = 0,
  onAdd,
  onRemove,
}: CardMenuProps) {
  const [onImageClick, setOnImageClick] = useState<boolean>(false);

  return (
    <>
      <div className="relative overflow-hidden bg-white border border-gray-100 shadow-card rounded-2xl">
        {!product.is_available && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/60 rounded-2xl">
            <span className="px-3 py-1 text-sm font-semibold text-white bg-primary rounded-full">
              Habis
            </span>
          </div>
        )}

        <div className="flex gap-3 p-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-ink leading-tight">
                {product.name}
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-ink bg-secondaryLight rounded-full shrink-0">
                {product.rating}
                <Star fontSize="inherit" className="text-yellow-500" />
              </span>
            </div>
            <p className="mt-1 text-sm text-muted line-clamp-2">
              {product.description}
            </p>
            <div className="mt-2 font-bold text-primary">
              {formatToRupiah(product.price)}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOnImageClick(true)}
              className="overflow-hidden rounded-xl"
            >
              <img
                src={product.image_url}
                className="object-cover w-24 h-24 rounded-xl"
                alt={product.name}
                draggable={false}
              />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRemove(product)}
                className="flex items-center justify-center w-8 h-8 text-white bg-ink rounded-full hover:bg-black active:scale-95 transition"
                aria-label="Kurangi"
              >
                <Remove fontSize="small" />
              </button>
              <span className="w-6 text-center font-semibold text-ink">
                {total_item}
              </span>
              <button
                type="button"
                onClick={() => onAdd(product)}
                className="flex items-center justify-center w-8 h-8 text-white bg-primary rounded-full hover:bg-primaryDark active:scale-95 transition"
                aria-label="Tambah"
              >
                <Add fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {onImageClick && (
        <div
          className="fixed inset-0 z-30 flex items-end sm:items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          onClick={() => setOnImageClick(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-soft overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-ink">{product.name}</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-ink bg-secondaryLight rounded-full">
                  {product.rating}
                  <Star fontSize="inherit" className="text-yellow-500" />
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{product.description}</p>
              <div className="mt-3 text-lg font-bold text-primary">
                {formatToRupiah(product.price)}
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setOnImageClick(false)}
                  className="flex-1 py-2.5 text-ink bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAdd(product);
                    setOnImageClick(false);
                  }}
                  className="flex-1 py-2.5 text-white bg-primary rounded-xl font-medium hover:bg-primaryDark transition active:scale-95"
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
