function FlowerCard({ emoji, bg, image, message, author, plantedAt }) {
  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255, 251, 245, 0.97)',
        border: '1px solid rgba(184, 212, 182, 0.28)',
        boxShadow: '0 4px 20px rgba(45, 74, 44, 0.07), 0 1px 4px rgba(45, 74, 44, 0.04)',
      }}
    >
      {/* Illustration area */}
      <div
        className="flex items-center justify-center h-36 overflow-hidden select-none"
        style={{ background: image ? '#fffbf5' : bg }}
      >
        {image ? (
          <img src={image} alt="drawn flower" className="w-full h-full object-contain" />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block">
            {emoji}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-moss/80 text-sm leading-relaxed line-clamp-3 italic">
          "{message}"
        </p>
        <div
          className="mt-auto pt-3 flex items-center justify-between gap-2 border-t"
          style={{ borderColor: 'rgba(184, 212, 182, 0.28)' }}
        >
          <span className="text-sage-dark/55 text-[10px]">— {author}</span>
          <span className="text-sage/45 text-[10px]">{plantedAt}</span>
        </div>
      </div>
    </div>
  );
}

export default FlowerCard;
