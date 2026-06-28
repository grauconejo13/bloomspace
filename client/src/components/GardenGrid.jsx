import FlowerCard from './FlowerCard';

function GardenGrid({ flowers, onSelect }) {
  return (
    <div className="grid justify-center gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,240px))]">
      {flowers.map((flower) => (
        <FlowerCard
          key={`${flower.id}-${flower.expiresAt}`}
          {...flower}
          onSelect={() => onSelect(flower)}
        />
      ))}
    </div>
  );
}

export default GardenGrid;