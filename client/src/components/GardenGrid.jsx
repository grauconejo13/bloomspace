import FlowerCard from './FlowerCard';

function GardenGrid({ flowers, onSelect }) {
  return (
    // -mx-6 cancels the parent section's px-6 so the grid spans the true viewport
    // width on mobile — needed so min(92vw, 420px) below is computed against the
    // actual screen, not the already-padded content area (which made cards look
    // too narrow). sm:mx-0 restores normal flow once the multi-column layout kicks in.
    <div className="-mx-6 sm:mx-0">
      <div className="grid justify-center gap-3 sm:gap-4 grid-cols-[min(92vw,420px)] sm:grid-cols-[repeat(auto-fit,minmax(200px,240px))]">
        {flowers.map((flower) => (
          <FlowerCard
            key={`${flower.id}-${flower.expiresAt}`}
            {...flower}
            onSelect={() => onSelect(flower)}
          />
        ))}
      </div>
    </div>
  );
}

export default GardenGrid;