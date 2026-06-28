import FlowerCard from './FlowerCard';

function GardenGrid({ flowers, onSelect }) {
  return (
    <div className="grid w-full justify-items-center gap-5 sm:gap-4 sm:grid-cols-[repeat(auto-fit,minmax(220px,260px))] sm:justify-center">
      {flowers.map((flower) => (
        <div
          key={`${flower.id}-${flower.expiresAt}`}
          className="w-[92%] max-w-[420px] sm:w-full sm:max-w-none"
        >
          <FlowerCard
            {...flower}
            onSelect={() => onSelect(flower)}
          />
        </div>
      ))}
    </div>
  );
}

export default GardenGrid;