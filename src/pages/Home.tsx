import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Stethoscope, Plane, FileCheck2, GraduationCap, ShieldCheck, Globe2, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hero from "@/assets/nurses-training.jpg"; // corridor of nurses
import visaImg from "@/assets/hero-nurse.jpg"; // passport/visa flatlay
import trainingImg from "@/assets/nurses-team.jpg"; // classroom

const services = [
  { icon: Stethoscope, title: "Nursing Recruitment", desc: "Matching qualified nurses with top hospitals and clinics across the GCC." },
  { icon: Plane, title: "Visa Services", desc: "End-to-end visa processing and relocation support for you and your family." },
  { icon: FileCheck2, title: "Documentation", desc: "Credentialing, licensure, Prometric & DataFlow — we handle the paperwork." },
  { icon: GraduationCap, title: "Training Services", desc: "Exam prep, language coaching, and continuing education for nurses." },
];

const stats = [
  { n: "3+", l: "Years in the GCC" },
  { n: "1,200+", l: "Nurses Placed" },
  { n: "60+", l: "Partner Hospitals" },
  { n: "6", l: "GCC Countries" },
];

const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-soft">
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 w-[26rem] h-[26rem] rounded-full bg-accent/15 blur-3xl" />
        <div className="container relative grid lg:grid-cols-2 gap-8 lg:gap-16 py-10 sm:py-14 lg:py-24 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-secondary-foreground text-[11px] sm:text-xs font-medium shadow-soft">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Licensed Recruitment Agency · Qatar
            </span>
            <h1 className="mt-4 sm:mt-5 font-serif font-bold leading-[1.05] tracking-tight">
              Your trusted bridge to a <span className="text-gradient">nursing career in the GCC</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              We recruit qualified nurses for hospitals across Qatar, UAE, Saudi Arabia, Kuwait, Bahrain and Oman — and provide training, documentation and visa support every step of the way.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Button asChild size="lg" className="bg-hero text-primary-foreground shadow-glow hover:opacity-90 rounded-full w-full sm:w-auto h-12">
                <Link to="/apply">Apply Now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full w-full sm:w-auto h-12 border-primary/20 hover:bg-secondary/60">
                <Link to="/jobs">View Open Positions</Link>
              </Button>
            </div>
            <div className="mt-7 sm:mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {["Free consultation", "Fast-track processing", "Ongoing career support"].map((f) => (
                <span key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-accent" /> {f}
                </span>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="absolute -inset-4 bg-hero rounded-[2rem] opacity-20 blur-2xl" />
            <img
              src={hero}
              alt="Nurses walking through a hospital corridor"
              width={1200}
              height={800}
              className="relative rounded-3xl shadow-card w-full h-auto object-cover"
            />
            <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 glass rounded-2xl shadow-pillow p-3 sm:p-4 flex gap-3 items-center animate-float">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent grid place-items-center shrink-0">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold">1,200+ placements</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Across the GCC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-primary">{s.n}</div>
              <div className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">What we do</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold">End-to-end support for your nursing journey</h2>
          <p className="mt-4 text-muted-foreground">From the first application to your first shift abroad — we're with you.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <Card key={s.title} className="group border-border hover:-translate-y-1 hover:shadow-card transition-all animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-secondary grid place-items-center group-hover:bg-hero transition-colors">
                  <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <Link to="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Two-column feature */}
      <section className="bg-soft">
        <div className="container py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <img src={trainingImg} alt="Nursing training session" width={1200} height={800} loading="lazy" className="rounded-3xl shadow-card w-full h-auto object-cover" />
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Training Academy</span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold">Prepare. Pass. Practice.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our training programs help nurses clear Prometric, DHA, HAAD, MOH, and NCLEX exams — plus IELTS / OET coaching and clinical refreshers so you arrive confident and ready.
            </p>
            <ul className="mt-6 space-y-3">
              {["Prometric & DataFlow prep", "IELTS / OET language coaching", "Clinical skills refreshers", "1-on-1 mentoring"].map((f) => (
                <li key={f} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 bg-hero text-primary-foreground">
              <Link to="/services">Explore Training <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { icon: Globe2, title: "GCC-wide reach", desc: "Active placements across Qatar, UAE, Saudi Arabia, Kuwait, Bahrain and Oman." },
            { icon: Users, title: "Human-first approach", desc: "Dedicated advisors who know each candidate by name — not just a file number." },
            { icon: ShieldCheck, title: "Fully compliant", desc: "Licensed, vetted and aligned with ministry regulations in every country we serve." },
          ].map((f) => (
            <Card key={f.title} className="border-border">
              <CardContent className="p-8">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-5 font-serif text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16 lg:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-hero text-primary-foreground p-7 sm:p-10 md:p-14 shadow-glow">
          <div className="relative z-10 grid md:grid-cols-[1.5fr_auto] gap-5 sm:gap-6 items-center">
            <div>
              <h2 className="font-serif font-bold">Ready to launch your career abroad?</h2>
              <p className="mt-3 text-primary-foreground/90 max-w-xl text-sm sm:text-base">
                Submit your profile today — our team will reach out within 48 hours with opportunities that match your experience.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="justify-self-start md:justify-self-end rounded-full w-full sm:w-auto h-12">
              <Link to="/apply">Start Application <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <img src={visaImg} alt="" aria-hidden className="absolute -right-16 -bottom-16 w-80 rounded-full opacity-20 blur-sm" />
        </div>
      </section>
    </>
  );
};

export default Home;
