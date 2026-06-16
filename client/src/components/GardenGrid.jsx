import FlowerCard from './FlowerCard';

function GardenGrid({ flowers }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {flowers.map((flower) => (
        <FlowerCard key={flower.id} {...flower} />
      ))}
    </div>
  );
}

export default GardenGrid;
