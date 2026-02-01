import Image from "next/image";
import type { DrawingBlob } from "@/features/play/types";

interface DrawingGridProps {
  items: DrawingBlob[];
  onSelect: (item: DrawingBlob) => void;
  isLoading: boolean;
  activeDrawingId?: string;
}

export function DrawingGrid({
  items,
  onSelect,
  isLoading,
  activeDrawingId,
}: DrawingGridProps) {
  if (isLoading) {
    return (
      <section>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 4 }, (_, idx) => `skeleton-${idx}`).map(
            (id) => (
              <div
                key={id}
                className="shrink-0 h-20 w-20 rounded-lg bg-linear-to-br from-gray-200 to-gray-300 animate-pulse"
              />
            ),
          )}
        </div>
      </section>
    );
  }

  return (
    <section>
      {items.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-2">絵なし</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`group shrink-0 h-20 w-20 rounded-lg overflow-hidden border-3 bg-white shadow-md transition-transform hover:scale-110 active:scale-95 ${
                item.id === activeDrawingId
                  ? "border-blue-500 scale-110"
                  : "border-gray-700"
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={item.url}
                  alt="drawing"
                  fill
                  sizes="80px"
                  className="object-cover"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
