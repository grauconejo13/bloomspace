import FlowerCard from "./FlowerCard";

function GardenGrid({ flowers, onSelect }) {
  return (
    <div className="grid justify-items-center gap-5 sm:gap-4 w-full">
      {flowers.map((flower) => (
        <div
          key={`${flower.id}-${flower.expiresAt}`}
          className="w-[92%] max-w-[420px] sm:w-full sm:max-w-none"
        >
          <FlowerCard {...flower} onSelect={() => onSelect(flower)} />
        </div>
      ))}
    </div>
  );
}

export default GardenGrid;
