import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import ChatWidget from "@/components/ChatWidget";
import AnnouncementBar from "@/components/AnnouncementBar";
import UrgentBar from "@/components/UrgentBar";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/jobs", label: "Job Vacancies" },
  { to: "/apply", label: "Apply Now" },
  { to: "/news", label: "News & Events" },
  { to: "/blogs", label: "Blogs" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

const Layout = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Announcement ticker */}
      <AnnouncementBar />

      {/* Top info bar */}
      <div className="hidden md:block bg-secondary text-secondary-foreground text-xs border-b border-border">
        <div className="container flex justify-between items-center h-9">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +974 7202 1636</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> Infoserenityconsultancyagency@gmail.com</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> Doha, Qatar — Serving the GCC
          </div>
        </div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-11 md:top-12 z-50 transition-all ${
          scrolled ? "glass border-b border-border/60 shadow-soft" : "bg-background/70 backdrop-blur-sm"
        }`}
      >
        <div className="container flex items-center justify-between h-14 md:h-16 lg:h-20 gap-2">
          <Link to="/" className="flex items-center gap-2 md:gap-2.5 group min-w-0">
            <img src={logo} alt="Serenity International Nursing Recruitment logo" className="w-9 h-9 md:w-11 md:h-11 rounded-xl object-cover shadow-glow group-hover:scale-105 transition-transform bg-white shrink-0" />
            <div className="leading-tight min-w-0">
              <div className="font-serif text-sm md:text-lg font-bold tracking-tight truncate">Serenity International</div>
              <div className="hidden sm:block text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Nursing Recruitment</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "text-primary bg-secondary shadow-soft"
                      : "text-foreground/80 hover:text-primary hover:bg-secondary/60"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Button asChild className="hidden md:inline-flex bg-hero hover:opacity-90 text-primary-foreground shadow-glow rounded-full">
              <Link to="/apply">Apply Now</Link>
            </Button>
            <button
              aria-label="Toggle menu"
              className="lg:hidden p-2.5 rounded-full hover:bg-secondary active:scale-95 transition-transform"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/60 glass animate-fade-up">
            <div className="container py-3 flex flex-col max-h-[70vh] overflow-y-auto">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-xl text-[15px] font-medium ${
                      isActive ? "text-primary bg-secondary" : "text-foreground/85 hover:bg-secondary/60"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Button asChild className="mt-3 bg-hero text-primary-foreground rounded-full h-11">
                <Link to="/apply">Apply Now</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background/90 mt-16">
        <div className="container py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="Serenity International Nursing Recruitment logo" className="w-11 h-11 rounded-xl object-cover bg-white" />
              <div className="font-serif text-lg font-bold text-background leading-tight">Serenity International<br /><span className="text-xs font-normal text-background/70">Nursing Recruitment</span></div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Trusted nursing recruitment and training partner — placing qualified nurses across Qatar and the GCC for over 3 years.
            </p>
            <div className="flex gap-2 mt-4">
              <a href="#" aria-label="Facebook" className="w-9 h-9 grid place-items-center rounded-full bg-background/10 hover:bg-primary transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 grid place-items-center rounded-full bg-background/10 hover:bg-primary transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 grid place-items-center rounded-full bg-background/10 hover:bg-primary transition-colors"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-base text-background mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {nav.slice(0, 5).map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-background/70 hover:text-primary transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base text-background mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {nav.slice(5).map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-background/70 hover:text-primary transition-colors">{n.label}</Link>
                </li>
              ))}
              <li><Link to="/privacy" className="text-background/70 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base text-background mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> 448 Al Sarj Street, Fereej Al Murra, Zone 55, Doha, Qatar</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> +974 7202 1636</li>
              <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> Infoserenityconsultancyagency@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-background/60">
            <p>© {new Date().getFullYear()} Serenity International Nursing Recruitment. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-primary">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
      <UrgentBar />
      <div aria-hidden className="h-11 md:h-12" />
      <ChatWidget />
    </div>
  );
};

export default Layout;
