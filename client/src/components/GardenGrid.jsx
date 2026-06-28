import FlowerCard from './FlowerCard';

function GardenGrid({ flowers, onSelect }) {
  return (
    <div className="grid justify-center gap-3 sm:gap-4 [grid-template-columns:repeat(auto-fit,minmax(150px,180px))] sm:[grid-template-columns:repeat(auto-fit,minmax(180px,220px))] lg:[grid-template-columns:repeat(auto-fit,minmax(200px,240px))]">
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