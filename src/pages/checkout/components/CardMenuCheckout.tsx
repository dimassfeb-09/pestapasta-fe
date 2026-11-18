import { Add, Check, Delete, Edit, Remove, Star } from "@mui/icons-material";
import { formatToRupiah } from "../../../utills/toRupiah";
import { Product } from "../../../models/Product";
import { useState } from "react";

interface CardMenuCheckoutProps {
  product: Product;
  total_item: number;
  note?: string;
  onNote: (note: string) => void;
  onIncrementItem: () => void;
  onDecrementItem: () => void;
  onRemoveProduct: () => void;
}

export default function CardMenuCheckout({
  product,
  total_item,
  note,
  onNote,
  onIncrementItem,
  onDecrementItem,
  onRemoveProduct,
}: CardMenuCheckoutProps) {
  const [isNoteEditActive, setIsNoteEditActive] = useState<boolean>(false);

  return (
    <div
      className={`relative flex gap-3 p-4 bg-white border border-gray-100 shadow-card rounded-2xl ${
        !product.is_available ? "opacity-60" : ""
      }`}
    >
      {!product.is_available && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50 rounded-2xl">
          <span className="px-3 py-1 text-sm font-semibold text-white bg-primary rounded-full">
            Habis
          </span>
        </div>
      )}

      <img
        src={product.image_url}
        className="object-cover w-20 h-20 rounded-xl shrink-0"
        alt={product.name}
        draggable={false}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-ink leading-tight">{product.name}</h3>
          <button
            type="button"
            onClick={onRemoveProduct}
            className="text-muted hover:text-primary transition shrink-0"
            aria-label="Hapus"
          >
            <Delete fontSize="small" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-primary">
            {formatToRupiah(product.price)}
          </span>
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-secondaryLight rounded-full">
            {product.rating}
            <Star fontSize="inherit" className="text-yellow-500" />
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <button
            type="button"
            onClick={() => product.is_available && onDecrementItem()}
            disabled={!product.is_available}
            className="flex items-center justify-center w-7 h-7 text-white bg-ink rounded-full hover:bg-black active:scale-95 transition disabled:opacity-40"
            aria-label="Kurangi"
          >
            <Remove fontSize="small" />
          </button>
          <span className="w-7 text-center font-semibold text-ink">
            {total_item}
          </span>
          <button
            type="button"
            onClick={() => product.is_available && onIncrementItem()}
            disabled={!product.is_available}
            className="flex items-center justify-center w-7 h-7 text-white bg-primary rounded-full hover:bg-primaryDark active:scale-95 transition disabled:opacity-40"
            aria-label="Tambah"
          >
            <Add fontSize="small" />
          </button>
        </div>

        <div
          className={`flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg border transition ${
            isNoteEditActive
              ? "bg-white border-primary"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <input
            type="text"
            value={note}
            onChange={(e) => onNote(e.target.value)}
            placeholder="Tambah catatan"
            className="flex-1 text-xs text-ink placeholder-muted bg-transparent border-none focus:outline-none"
            disabled={!isNoteEditActive}
          />
          {!isNoteEditActive ? (
            <Edit
              onClick={() => setIsNoteEditActive(true)}
              className="text-muted cursor-pointer hover:text-primary transition"
              fontSize="small"
            />
          ) : (
            <Check
              onClick={() => setIsNoteEditActive(false)}
              className="text-greenTeal cursor-pointer hover:text-greenTealDark transition"
              fontSize="small"
            />
          )}
        </div>
      </div>
    </div>
  );
}
