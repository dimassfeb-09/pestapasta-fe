import { Add, Close, Edit, Remove, Star } from "@mui/icons-material";
import { formatToRupiah } from "../../../utills/toRupiah";
import { useState } from "react";

interface CardMenuCheckoutProps {
  id: number;
  title: string;
  rating: number;
  price: number;
  total_item: number;
  image_url: string;
  onNoteChange: (note: string) => void;
}

export default function CardMenuCheckout({
  id,
  title,
  rating,
  price,
  image_url,
  total_item,
  onNoteChange,
}: CardMenuCheckoutProps) {
  const [isNoteEditActive, setIsNoteEditActive] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const handleNoteChange = (e: any) => {
    const newNote = e.target.value;
    setNote(newNote);
    onNoteChange(newNote);
  };

  return (
    <div
      key={id}
      className={`rounded-md flex items-center justify-between py-2 px-5 border card_makanan`}
    >
      <div className="flex flex-col gap-2">
        <div className="font-bold text-md">{title}</div>
        <div className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-black border rounded-lg w-max">
          <div>{rating}</div>
          <Star className="text-yellow-500" fontSize="small" />
        </div>

        <div
          className={`flex items-center px-1 py-1 space-x-2 ${
            isNoteEditActive ? "" : "bg-gray-100"
          } border border-gray-300 rounded-lg`}
        >
          {/* Input Field */}
          <input
            id="note"
            type="text"
            value={note}
            onChange={handleNoteChange}
            placeholder="Tambahkan catatan"
            className="flex-1 px-4 py-1 text-gray-700 placeholder-gray-500 transition-all border-none rounded-md focus:outline-none focus:ring-0"
            disabled={!isNoteEditActive} // Disable input if edit is not active
          />

          {/* Edit Icon (Visible when isNoteEditActive is false) */}
          {!isNoteEditActive && (
            <Edit
              onClick={() => setIsNoteEditActive(true)} // Enable edit mode when clicked
              className="text-gray-600 transition-all cursor-pointer hover:text-blue-500"
            />
          )}

          {/* Close Icon (Visible when isNoteEditActive is true) */}
          {isNoteEditActive && (
            <Close
              onClick={() => setIsNoteEditActive(false)} // Disable edit mode when clicked
              className="text-gray-600 transition-all cursor-pointer hover:text-red-500"
            />
          )}
        </div>

        <div>{formatToRupiah(price)}</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <img
          src={image_url}
          className="rounded-lg max-h-32 max-w-3max-h-32"
          alt={title}
          draggable={false}
        />
        <div className="flex items-center justify-center gap-3 px-1 mt-2 border border-black rounded-md text-whitebg-black">
          <Remove />
          <div>{total_item}</div>
          <Add />
        </div>
      </div>
    </div>
  );
}
