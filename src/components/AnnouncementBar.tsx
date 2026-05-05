import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

export type AnnouncementMessage = {
  text: string;
  cta?: { label: string; to: string; external?: boolean };
};

interface AnnouncementBarProps {
  messages?: AnnouncementMessage[];
  speed?: number; // seconds for one full loop on desktop
}

const defaultMessages: AnnouncementMessage[] = [
  { text: "🚀 New ICU & ER vacancies open in Qatar, UAE & Saudi Arabia", cta: { label: "Apply Now", to: "/apply" } },
  { text: "🩺 Free DataFlow & Prometric guidance for registered nurses" },
  { text: "📚 Enroll in our Nurses Training & Upskilling program", cta: { label: "Learn More", to: "/services" } },
  { text: "✈️ End-to-end visa & documentation support across the GCC" },
  { text: "💬 Talk to a recruiter on WhatsApp: +974 7202 1636", cta: { label: "Chat Now", to: "https://wa.me/97472021636", external: true } },
];

const AnnouncementBar = ({ messages = defaultMessages, speed = 40 }: AnnouncementBarProps) => {
  // Duplicate the list so the marquee loops seamlessly
  const items = [...messages, ...messages];

  return (
    <div
      role="region"
      aria-label="Site announcements"
      className="sticky top-0 z-[60] bg-hero text-primary-foreground border-b border-primary-foreground/10 shadow-soft"
    >
      <div className="relative flex items-center overflow-hidden h-9 md:h-10">
        <div className="hidden sm:flex items-center gap-1.5 px-3 h-full bg-primary/40 backdrop-blur-sm shrink-0 border-r border-primary-foreground/10">
          <Megaphone className="h-3.5 w-3.5" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Updates</span>
        </div>

        <div className="marquee group flex-1 overflow-hidden">
          <div
            className="marquee-track flex items-center gap-12 whitespace-nowrap will-change-transform"
            style={{ animationDuration: `${speed}s` }}
          >
            {items.map((m, i) => (
              <span key={i} className="flex items-center gap-2 text-xs md:text-sm">
                <span className="opacity-95">{m.text}</span>
                {m.cta && (
                  m.cta.external ? (
                    <a
                      href={m.cta.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 font-semibold hover:text-accent transition-colors"
                    >
                      {m.cta.label} →
                    </a>
                  ) : (
                    <Link
                      to={m.cta.to}
                      className="underline underline-offset-4 font-semibold hover:text-accent transition-colors"
                    >
                      {m.cta.label} →
                    </Link>
                  )
                )}
                <span className="text-primary-foreground/40" aria-hidden>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-track {
          animation: marquee linear infinite;
        }
        .marquee:hover .marquee-track,
        .marquee:focus-within .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .marquee-track {
            animation-duration: 60s !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;
