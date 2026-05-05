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

const AnnouncementBar = ({ messages = defaultMessages, speed = 22 }: AnnouncementBarProps) => {
  // Duplicate the list so the marquee loops seamlessly
  const items = [...messages, ...messages];

  return (
    <div
      role="region"
      aria-label="Site announcements"
      className="sticky top-0 z-[60] bg-primary text-primary-foreground border-b border-primary-foreground/15 shadow-md"
    >
      <div className="relative flex items-stretch overflow-hidden h-11 md:h-12">
        <div className="hidden sm:flex items-center gap-1.5 px-4 bg-primary-foreground/10 backdrop-blur-sm shrink-0 border-r border-primary-foreground/15">
          <Megaphone className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Updates</span>
        </div>

        <div className="marquee group relative flex-1 overflow-hidden flex items-center">
          <div
            className="marquee-track flex items-center gap-12 whitespace-nowrap will-change-transform"
            style={{ animationDuration: `${speed}s` }}
          >
            {items.map((m, i) => (
              <span key={i} className="flex items-center gap-2 text-sm md:text-[15px] leading-none font-semibold">
                <span>{m.text}</span>
                {m.cta && (
                  m.cta.external ? (
                    <a
                      href={m.cta.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 font-bold hover:text-accent transition-colors"
                    >
                      {m.cta.label} →
                    </a>
                  ) : (
                    <Link
                      to={m.cta.to}
                      className="underline underline-offset-4 font-bold hover:text-accent transition-colors"
                    >
                      {m.cta.label} →
                    </Link>
                  )
                )}
                <span className="text-primary-foreground/50" aria-hidden>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-track {
          animation: marquee linear infinite;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
        .marquee:hover .marquee-track,
        .marquee:focus-within .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (max-width: 768px) {
          .marquee-track {
            animation-duration: 30s !important;
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
