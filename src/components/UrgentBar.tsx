import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export type UrgentMessage = {
  text: string;
  cta?: { label: string; to: string; external?: boolean };
};

interface UrgentBarProps {
  messages?: UrgentMessage[];
  speed?: number; // seconds for full loop on desktop (lower = faster)
}

const defaultMessages: UrgentMessage[] = [
  { text: "🚨 URGENT: ICU Nurses needed in Saudi Arabia — interviews this week", cta: { label: "Apply Now", to: "/apply" } },
  { text: "⏰ DEADLINE: Qatar MOPH license submissions close Friday" },
  { text: "🔥 HIRING NOW: ER, OR & NICU nurses for UAE hospitals", cta: { label: "View Jobs", to: "/jobs" } },
  { text: "📢 Limited slots: Free DataFlow & Prometric coaching this month", cta: { label: "Reserve Spot", to: "/services" } },
  { text: "✅ Fast-track placements — talk to a recruiter on WhatsApp +974 7202 1636", cta: { label: "Chat Now", to: "https://wa.me/97472021636", external: true } },
];

const UrgentBar = ({ messages = defaultMessages, speed = 18 }: UrgentBarProps) => {
  const items = [...messages, ...messages];

  return (
    <div
      role="alert"
      aria-label="Urgent updates"
      className="w-full bg-[hsl(0_84%_50%)] text-white border-y border-[hsl(0_84%_38%)] shadow-[0_4px_12px_-4px_hsl(0_84%_40%/0.5)]"
    >
      <div className="relative flex items-stretch overflow-hidden h-11 md:h-12">
        <div className="hidden sm:flex items-center gap-1.5 px-4 bg-[hsl(0_84%_42%)] shrink-0 border-r border-[hsl(0_84%_38%)]">
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider">Urgent</span>
        </div>

        <div className="urgent-marquee group relative flex-1 overflow-hidden flex items-center">
          <div
            className="urgent-track flex items-center gap-12 whitespace-nowrap will-change-transform"
            style={{ animationDuration: `${speed}s` }}
          >
            {items.map((m, i) => (
              <span key={i} className="flex items-center gap-2 text-sm md:text-[15px] leading-none font-bold">
                <span>{m.text}</span>
                {m.cta && (
                  m.cta.external ? (
                    <a
                      href={m.cta.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 font-extrabold hover:text-yellow-200 transition-colors"
                    >
                      {m.cta.label} →
                    </a>
                  ) : (
                    <Link
                      to={m.cta.to}
                      className="underline underline-offset-4 font-extrabold hover:text-yellow-200 transition-colors"
                    >
                      {m.cta.label} →
                    </Link>
                  )
                )}
                <span className="text-white/60" aria-hidden>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .urgent-track {
          animation: urgent-marquee linear infinite;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }
        .urgent-marquee:hover .urgent-track,
        .urgent-marquee:focus-within .urgent-track {
          animation-play-state: paused;
        }
        @keyframes urgent-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (max-width: 768px) {
          .urgent-track {
            animation-duration: 24s !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .urgent-track { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default UrgentBar;
