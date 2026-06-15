import hero from "../assets/hero.png";
import wallpaper from "../assets/wallpaper-bloom.png";

const steps = [
  {
    number: "01",
    emoji: "✏️",
    title: "Draw a Flower",
    desc: "Use our simple canvas to sketch your own unique bloom — no artistic skill required.",
    accent: {
      bg: "rgba(196, 181, 212, 0.18)",
      border: "rgba(196, 181, 212, 0.42)",
      glow: "rgba(196, 181, 212, 0.22)",
      icon: "rgba(196, 181, 212, 0.26)",
    },
  },
  {
    number: "02",
    emoji: "💌",
    title: "Write a Message",
    desc: "Attach a kind word, wish, or intention to your flower before you plant it.",
    accent: {
      bg: "rgba(184, 216, 232, 0.18)",
      border: "rgba(184, 216, 232, 0.42)",
      glow: "rgba(184, 216, 232, 0.22)",
      icon: "rgba(184, 216, 232, 0.26)",
    },
  },
  {
    number: "03",
    emoji: "🌱",
    title: "Plant It in the Garden",
    desc: "Your flower joins the shared garden, where anyone in the world can discover it.",
    accent: {
      bg: "rgba(122, 171, 120, 0.13)",
      border: "rgba(122, 171, 120, 0.36)",
      glow: "rgba(122, 171, 120, 0.16)",
      icon: "rgba(122, 171, 120, 0.22)",
    },
  },
];

function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-28 min-h-[85vh] overflow-hidden"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Warm vignette overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse at 50% 42%, transparent 20%, rgba(22, 18, 8, 0.26) 82%)",
              "linear-gradient(to bottom, rgba(18, 22, 10, 0.20) 0%, transparent 28%, transparent 60%, rgba(12, 22, 8, 0.38) 100%)",
            ].join(", "),
          }}
        />

        {/* Pollen sparkle details */}
        <div
          className="sparkle absolute top-16 left-[10%] w-2.5 h-2.5 rounded-full bg-lavender/50 blur-[1px]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="sparkle absolute top-44 right-[14%] w-1.5 h-1.5 rounded-full bg-petal/70"
          style={{ animationDelay: "1.3s" }}
        />
        <div
          className="sparkle absolute top-64 left-[22%] w-2 h-2 rounded-full bg-mist/55 blur-[1px]"
          style={{ animationDelay: "0.7s" }}
        />
        <div
          className="sparkle absolute bottom-28 right-[11%] w-3 h-3 rounded-full bg-sage-light/40 blur-[2px]"
          style={{ animationDelay: "1.9s" }}
        />
        <div
          className="sparkle absolute bottom-52 left-[16%] w-1.5 h-1.5 rounded-full bg-lavender/60"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="sparkle absolute top-1/3 right-[27%] w-1 h-1 rounded-full bg-bloom/75"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="sparkle absolute top-1/4 left-[42%] w-2 h-2 rounded-full bg-petal/45 blur-[1px]"
          style={{ animationDelay: "3.1s" }}
        />

        {/* Rising pollen particles */}
        <div
          className="pollen absolute top-[62%] left-[8%]  w-1.5 h-1.5 rounded-full bg-petal/55"
          style={{ animationDuration: "9s", animationDelay: "0s" }}
        />
        <div
          className="pollen absolute top-[68%] left-[26%] w-1   h-1   rounded-full bg-lavender/60"
          style={{ animationDuration: "11s", animationDelay: "2.2s" }}
        />
        <div
          className="pollen absolute top-[57%] right-[19%] w-2  h-2   rounded-full bg-cream/50 blur-[1px]"
          style={{ animationDuration: "8s", animationDelay: "1.1s" }}
        />
        <div
          className="pollen absolute top-[64%] right-[34%] w-1  h-1   rounded-full bg-bloom/65"
          style={{ animationDuration: "10s", animationDelay: "3.5s" }}
        />
        <div
          className="pollen absolute top-[45%] left-[36%]  w-1.5 h-1.5 rounded-full bg-mist/50"
          style={{ animationDuration: "12s", animationDelay: "5s" }}
        />

        {/* Soft meadow ground wave */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg
            viewBox="0 0 1440 72"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "72px" }}
          >
            <path
              d="M0,36 Q180,8 360,30 Q540,52 720,28 Q900,6 1080,32 Q1260,56 1440,24 L1440,72 L0,72 Z"
              fill="rgba(184, 222, 182, 0.22)"
            />
            <path
              d="M0,50 Q240,28 480,46 Q720,64 960,40 Q1200,18 1440,44 L1440,72 L0,72 Z"
              fill="rgba(122, 171, 120, 0.14)"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={hero}
            alt="Bloomspace flower illustration"
            className="w-36 mb-6"
            style={{
              filter:
                "drop-shadow(0 8px 32px rgba(196, 181, 212, 0.55)) drop-shadow(0 2px 8px rgba(122, 171, 120, 0.2))",
            }}
          />

          {/* Frosted cream text panel */}
          <div
            className="rounded-3xl px-8 py-7 mb-8 flex flex-col items-center gap-3 w-full max-w-lg"
            style={{
              background: "rgba(250, 246, 239, 0.58)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              border: "1px solid rgba(250, 246, 239, 0.38)",
              boxShadow: "0 4px 40px rgba(45, 74, 44, 0.06)",
            }}
          >
            <h1 className="font-heading text-5xl md:text-6xl leading-tight text-moss max-w-xl">
              Grow Something
              <br />
              Beautiful
            </h1>
            <p className="text-sage-dark text-lg max-w-md leading-relaxed">
              A community wellness garden built from small acts of kindness.
            </p>
            <p className="text-sage-dark/80 text-sm max-w-sm leading-relaxed">
              Draw a flower, write a positive message, and plant it for the
              world to see.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className="bg-sage text-cream px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer"
              style={{ boxShadow: "0 4px 18px rgba(122, 171, 120, 0.42)" }}
            >
              Plant a Flower
            </button>
            <button
              className="border border-sage-light/60 text-sage-dark px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-light/15 transition-all duration-300 cursor-pointer"
              style={{
                background: "rgba(255, 251, 245, 0.82)",
                backdropFilter: "blur(4px)",
              }}
            >
              Browse the Garden
            </button>
          </div>
        </div>
      </section>

      {/* Garden snapshot strip */}
      <section className="px-6 py-10" style={{ background: "#faf6ef" }}>
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Today's Bloom card */}
          <div
            className="flex flex-col gap-2 rounded-2xl p-5"
            style={{
              background: "rgba(255, 251, 245, 0.97)",
              border: "1px solid rgba(196, 181, 212, 0.38)",
              boxShadow:
                "0 6px 24px rgba(196, 181, 212, 0.16), 0 2px 6px rgba(45, 74, 44, 0.05)",
            }}
          >
            <p
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "rgba(196, 181, 212, 0.95)" }}
            >
              Today's Bloom
            </p>
            <div className="flex gap-1.5 text-lg">
              <span>🌸</span>
              <span>🌺</span>
              <span>🌼</span>
            </div>
            <p className="text-moss/80 text-sm leading-snug">
              128 flowers bloomed in the garden today
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "rgba(122, 171, 120, 0.7)" }}
              />
              <span className="text-sage-dark/65 text-xs">
                Garden is growing
              </span>
            </div>
          </div>

          {/* Garden Note card */}
          <div
            className="flex flex-col gap-2 rounded-2xl p-5"
            style={{
              background: "rgba(255, 251, 245, 0.97)",
              border: "1px solid rgba(184, 216, 232, 0.42)",
              boxShadow:
                "0 6px 24px rgba(184, 216, 232, 0.14), 0 2px 6px rgba(45, 74, 44, 0.05)",
            }}
          >
            <p
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "rgba(184, 216, 232, 0.95)" }}
            >
              Garden Note
            </p>
            <p className="text-moss/80 text-sm leading-relaxed">
              "Every kind word planted here blossoms for the whole world to
              see."
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm">🌿</span>
              <span className="text-sage-dark/60 text-xs italic">
                — a fellow gardener
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="py-24 px-6 relative"
        style={{ background: "linear-gradient(to bottom, #faf6ef, #f2e9d8)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-moss mb-3">
              How It Works
            </h2>
            <p className="text-sage-dark/65 text-sm">
              Three simple steps to join the garden.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {steps.map(({ number, emoji, title, desc, accent }) => (
              <div
                key={number}
                className="relative flex flex-col items-center text-center gap-4 rounded-3xl p-8"
                style={{
                  background: `linear-gradient(145deg, #fffbf5, ${accent.bg})`,
                  border: `1px solid ${accent.border}`,
                  boxShadow: `0 6px 28px ${accent.glow}, 0 1px 6px rgba(45, 74, 44, 0.05)`,
                }}
              >
                {/* Watermark step number */}
                <span
                  className="absolute top-5 right-6 font-heading text-5xl font-bold select-none pointer-events-none"
                  style={{ color: "rgba(45, 74, 44, 0.05)" }}
                >
                  {number}
                </span>

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: accent.icon,
                    border: `1px solid ${accent.border}`,
                  }}
                >
                  <span className="text-2xl">{emoji}</span>
                </div>

                <p
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "rgba(122, 171, 120, 0.72)" }}
                >
                  Step {number}
                </p>
                <h3 className="font-heading text-lg text-moss leading-snug">
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(74, 112, 72, 0.75)" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
