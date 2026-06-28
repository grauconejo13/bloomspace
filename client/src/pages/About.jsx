import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FAQS = [
  {
    emoji: "🌸",
    question: "What is Bloomspace?",
    answer:
      "Bloomspace is a quiet digital garden where anyone can draw or share a flower with a short message.",
  },
  {
    emoji: "🎨",
    question: "Do I need an account?",
    answer: "No. You can start planting blooms right away.",
  },
  {
    emoji: "🌱",
    question: "Why can I only plant three blooms per session?",
    answer:
      "To help keep the garden healthy and reduce spam while Bloomspace is still growing.",
  },
  {
    emoji: "📤",
    question: "Can I share my bloom?",
    answer:
      "Yes. After planting, you can share it directly or save a Bloomspace card as an image.",
  },
  {
    emoji: "🌼",
    question: "Why does Bloomspace sometimes take a few seconds to wake up?",
    answer:
      "Bloomspace is hosted on cloud infrastructure that can go to sleep during periods of inactivity. The first visitor after a quiet period may experience a short delay while the garden wakes up. Once awake, everything should respond normally.",
  },
  {
    emoji: "💚",
    question: 'What is "Support the Plants"?',
    answer:
      "Support the Plants is an optional way to help cover hosting, storage, and future improvements. Bloomspace will always have a free experience.",
  },
];

function FaqItem({ emoji, question, answer, isOpen, onToggle }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255, 251, 245, 0.95)",
        border: "1px solid rgba(184, 212, 182, 0.35)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 text-left px-5 py-4 cursor-pointer"
      >
        <span className="font-heading text-base sm:text-lg text-moss">
          {emoji} {question}
        </span>
        <span
          className="shrink-0 text-sage-dark/60 text-lg transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-4 text-sm text-sage-dark/75 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

function About() {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (location.hash === "#faq") {
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  function toggleFaq(index) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <main
      className="flex-1 py-16 px-6"
      style={{ background: "linear-gradient(to bottom, #faf6ef, #f2e9d8)" }}
    >
      {/* Page header */}
      <section className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-[10px] font-bold tracking-widest uppercase text-sage-dark/45 mb-4">
          About Bloomspace
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-moss mb-4">
          A community garden built from small acts of kindness.
        </h1>
      </section>

      {/* Project info cards */}
      <section className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2 mb-20">
        <article
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255, 251, 245, 0.95)",
            border: "1px solid rgba(184, 212, 182, 0.35)",
            boxShadow: "0 6px 24px rgba(45, 74, 44, 0.06)",
          }}
        >
          <h2 className="font-heading text-xl text-moss mb-3">Project Origin</h2>
          <p className="text-sage-dark/75 text-sm leading-relaxed">
            Add the nwHacks 2025 origin story here.
          </p>
        </article>

        <article
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255, 251, 245, 0.95)",
            border: "1px solid rgba(184, 212, 182, 0.35)",
            boxShadow: "0 6px 24px rgba(45, 74, 44, 0.06)",
          }}
        >
          <h2 className="font-heading text-xl text-moss mb-3">Original Hackathon Team</h2>
          <ul className="space-y-1.5 text-sage-dark/75 text-sm leading-relaxed">
            <li>Vanessa Victorino — Frontend Development</li>
            <li>[Name] — Concept &amp; Backend Development</li>
            <li>[Name] — Presentation</li>
            <li>[Name] — Project Setup &amp; Support</li>
          </ul>
        </article>

        <article
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255, 251, 245, 0.95)",
            border: "1px solid rgba(184, 212, 182, 0.35)",
            boxShadow: "0 6px 24px rgba(45, 74, 44, 0.06)",
          }}
        >
          <h2 className="font-heading text-xl text-moss mb-3">Original Prototype</h2>
          <p className="text-sage-dark/75 text-sm leading-relaxed">
            Add what the hackathon demo included here.
          </p>
        </article>

        <article
          className="rounded-3xl p-6"
          style={{
            background: "rgba(255, 251, 245, 0.95)",
            border: "1px solid rgba(184, 212, 182, 0.35)",
            boxShadow: "0 6px 24px rgba(45, 74, 44, 0.06)",
          }}
        >
          <h2 className="font-heading text-xl text-moss mb-3">Revival Version</h2>
          <p className="text-sage-dark/75 text-sm leading-relaxed">
            Add what this rebuild adds here.
          </p>
        </article>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold tracking-widest uppercase text-sage-dark/45 mb-3">
            Good to Know
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-moss">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.question}
              {...faq}
              isOpen={openIndex === index}
              onToggle={() => toggleFaq(index)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default About;
