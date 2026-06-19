import FlowerCard from './FlowerCard';

function GardenGrid({ flowers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {flowers.map((flower) => (
        <FlowerCard key={flower.id} {...flower} />
      ))}
    </div>
  );
}

export default GardenGrid;
