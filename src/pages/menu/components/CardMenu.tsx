import { Add, Star } from "@mui/icons-material";
import { formatToRupiah } from "../../../utills/toRupiah";

interface CardMenuProps {
  id: number;
  title: string;
  description: string;
  rating: number;
  price: number;
  image_url: string;
  category: string;
  color_menu: string;
}

export default function CardMenu({
  id,
  title,
  description,
  rating,
  price,
  image_url,
  color_menu,
}: CardMenuProps) {
  return (
    <div
      key={id}
      className={`rounded-md flex items-center justify-between p-5 bg-[${color_menu}] border card_makanan`}
    >
      <div className="flex flex-col gap-2">
        <div className="font-bold text-md">{title}</div>
        <div className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-black border rounded-lg w-max">
          <div>{rating}</div>
          <Star fontSize="small" className="text-yellow-500" />
        </div>
        <div className="text-sm">{description}</div>
        <div>{formatToRupiah(price)}</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <img
          src={image_url}
          className="rounded-lg max-h-32 max-w-3max-h-32"
          alt={title}
          draggable={false}
        />
        <div className="px-1 text-xs text-white -translate-y-3 bg-black rounded-md round">
          <Add />
        </div>
      </div>
    </div>
  );
}
