import hero from '../assets/hero.png';

const steps = [
  {
    number: '01',
    emoji: '✏️',
    title: 'Draw a Flower',
    desc: 'Use our simple canvas to sketch your own unique bloom — no artistic skill required.',
  },
  {
    number: '02',
    emoji: '💌',
    title: 'Write a Message',
    desc: 'Attach a kind word, wish, or intention to your flower before you plant it.',
  },
  {
    number: '03',
    emoji: '🌱',
    title: 'Plant It in the Garden',
    desc: 'Your flower joins the shared garden, where anyone in the world can discover it.',
  },
];

function Home() {
  return (
    <main className="flex-1">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28 min-h-[85vh]">
        <img
          src={hero}
          alt="Bloomspace flower illustration"
          className="w-36 mb-10 drop-shadow-sm"
        />

        <h1 className="font-heading text-5xl md:text-6xl leading-tight text-moss mb-5 max-w-xl">
          Grow Something<br />Beautiful
        </h1>

        <p className="text-sage text-lg max-w-md leading-relaxed mb-3">
          A community wellness garden built from small acts of kindness.
        </p>
        <p className="text-sage/70 text-sm max-w-sm leading-relaxed mb-12">
          Draw a flower, write a positive message, and plant it for the world to see.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button className="bg-sage text-cream px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-dark transition-colors duration-200 shadow-sm cursor-pointer">
            🌸 Plant a Flower
          </button>
          <button className="border border-sage text-sage px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage/10 transition-colors duration-200 cursor-pointer">
            Browse the Garden
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream-dark py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-moss text-center mb-2">
            How It Works
          </h2>
          <p className="text-sage text-center text-sm mb-16">
            Three simple steps to join the garden.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {steps.map(({ number, emoji, title, desc }) => (
              <div key={number} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cream border border-sage-light/50 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">{emoji}</span>
                </div>
                <p className="text-xs font-bold tracking-widest text-sage-light uppercase">
                  Step {number}
                </p>
                <h3 className="font-heading text-lg text-moss leading-snug">
                  {title}
                </h3>
                <p className="text-sage/80 text-sm leading-relaxed max-w-55">
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
