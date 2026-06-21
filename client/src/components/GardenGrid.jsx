import FlowerCard from './FlowerCard';

function GardenGrid({ flowers, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
