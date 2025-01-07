import { Add, Check, Edit, Remove, Star } from "@mui/icons-material";
import { formatToRupiah } from "../../../utills/toRupiah";
import { Product } from "../../../models/Product";
import { useState } from "react";

interface CardMenuCheckoutProps {
  product: Product;
  total_item: number;
  note?: string;
  onNote: (note: string) => void;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
}

export default function CardMenuCheckout({
  product,
  total_item,
  note,
  onNote,
  onAdd,
  onRemove,
}: CardMenuCheckoutProps) {
  const [isNoteEditActive, setIsNoteEditActive] = useState<boolean>(false);

  return (
    <div
      key={product.id}
      className={`relative flex items-center justify-between px-3 py-2 border rounded-md card_makanan ${
        !product.is_available ? "opacity-50" : ""
      }`}
    >
      {/* Overlay for Out of Stock */}
      {!product.is_available && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 rounded-md">
          <div className="text-lg font-bold text-white">Out of Stock</div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="font-bold text-md">{product.name}</div>
        <div className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-black border rounded-lg w-max">
          <div>{product.rating}</div>
          <Star className="text-yellow-500" fontSize="small" />
        </div>

        <div
          className={`flex items-center p-1 border rounded-md w-min ${
            isNoteEditActive ? "bg-white" : "bg-gray-200"
          } w-full`}
        >
          <input
            type="text"
            value={note}
            onChange={(e) => onNote(e.target.value)}
            placeholder="Tambahkan catatan"
            className={`px-2 py-1 text-xs text-gray-700 placeholder-gray-500 transition-all border-none rounded-md focus:outline-none ${
              isNoteEditActive ? "bg-white" : "bg-transparent"
            }`}
            style={{
              width: isNoteEditActive ? "100%" : "60%", // Lebar lebih besar saat aktif
              minWidth: "150px", // Memberikan batas minimum lebar
            }}
            disabled={!isNoteEditActive}
          />

          {!isNoteEditActive ? (
            <Edit
              onClick={() => setIsNoteEditActive(true)}
              className="ml-2 text-gray-600 transition-all cursor-pointer hover:text-blue-500"
            />
          ) : (
            <Check
              onClick={() => setIsNoteEditActive(false)}
              className="ml-2 text-gray-600 transition-all cursor-pointer hover:text-green-500"
            />
          )}
        </div>

        <div>{formatToRupiah(product.price)}</div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <img
          src={product.image_url}
          className="rounded-lg min-w-28 min-h-28 max-w-28 max-h-28"
          alt={product.name}
          draggable={false}
        />
        <div className="flex items-center justify-center gap-3 px-1 mt-2 border border-black rounded-md text-whitebg-black">
          <Remove
            onClick={() => product.is_available && onRemove(product)}
            className={`cursor-pointer ${
              !product.is_available ? "pointer-events-none" : ""
            }`}
          />
          <div>{total_item}</div>
          <Add
            onClick={() => product.is_available && onAdd(product)}
            className={`cursor-pointer ${
              !product.is_available ? "pointer-events-none" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
