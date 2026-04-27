import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Microscope,
  Activity,
  Phone,
  MapPin,
  Mail,
  Clock,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Award,
} from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import doc1 from "@/assets/doctor-1.jpg";
import doc2 from "@/assets/doctor-2.jpg";
import doc3 from "@/assets/doctor-3.jpg";

const services = [
  { icon: Stethoscope, title: "Family Medicine", desc: "Comprehensive primary care for every age, from routine check-ups to chronic disease management." },
  { icon: HeartPulse, title: "Cardiology", desc: "Advanced heart screening, ECG, and personalized cardiovascular care plans." },
  { icon: Baby, title: "Pediatrics", desc: "Gentle, expert care for infants, children, and adolescents with on-time vaccinations." },
  { icon: Brain, title: "Neurology", desc: "Diagnosis and treatment for headaches, stroke recovery, and neurological conditions." },
  { icon: Microscope, title: "Lab & Diagnostics", desc: "On-site lab work, imaging, and rapid testing — most results within 24 hours." },
  { icon: Activity, title: "Preventive Health", desc: "Annual wellness exams, screenings, and tailored prevention strategies." },
];

const doctors = [
  { name: "Dr. Amelia Chen", role: "Family Medicine · MD", img: doc1, bio: "12+ years caring for families with a focus on preventive wellness." },
  { name: "Dr. Marcus Reid", role: "Cardiologist · MD, FACC", img: doc2, bio: "Board-certified cardiologist specializing in non-invasive imaging." },
  { name: "Dr. Howard Klein", role: "Internal Medicine · MD", img: doc3, bio: "Senior physician with 25 years of experience in chronic-condition care." },
];

const stats = [
  { value: "20+", label: "Years of care" },
  { value: "35K+", label: "Patients served" },
  { value: "24/7", label: "Emergency line" },
  { value: "98%", label: "Patient satisfaction" },
];

const Index = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    toast.success("Appointment request received — we'll call you within 1 business hour.");
    setForm({ name: "", email: "", phone: "", reason: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="container flex h-16 items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-hero flex items-center justify-center shadow-glow">
              <HeartPulse className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Meridian Health</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#doctors" className="hover:text-foreground transition-colors">Doctors</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <Button asChild className="bg-hero hover:opacity-90 text-primary-foreground shadow-soft">
            <a href="#appointment">Book Visit</a>
          </Button>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative overflow-hidden bg-soft">
          <div className="container grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
            <div className="space-y-7 animate-fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Accredited & trusted since 2004
              </span>
              <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05]">
                Compassionate care for <span className="text-gradient">every stage of life.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Meridian Health brings together expert physicians, modern diagnostics, and genuinely warm
                service — so your family always feels heard, seen, and well cared for.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-hero hover:opacity-90 text-primary-foreground shadow-soft">
                  <a href="#appointment"><CalendarCheck className="mr-1" /> Book an appointment</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#services">Explore services</a>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Same-day visits</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Insurance accepted</div>
              </div>
            </div>

            <div className="relative animate-fade-up">
              <div className="absolute -inset-4 bg-hero opacity-20 blur-3xl rounded-full" />
              <img
                src={heroImg}
                alt="Welcoming Meridian Health clinic reception with friendly doctor"
                width={1536}
                height={1024}
                className="relative rounded-3xl shadow-card w-full h-auto object-cover"
              />
              <Card className="absolute -bottom-6 -left-6 shadow-card border-0 hidden sm:block animate-float">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Top-rated clinic</div>
                    <div className="text-xs text-muted-foreground">4.9 / 5 from 2,400 reviews</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-gradient">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Services</span>
              <h2 className="text-3xl md:text-5xl font-semibold mt-3">Care across every specialty you need</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                One clinic, one record, one team — coordinated care that grows with your family.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <Card key={s.title} className="group border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-hero transition-colors">
                      <s.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors */}
        <section id="doctors" className="py-20 md:py-28 bg-soft">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Meet The Team</span>
              <h2 className="text-3xl md:text-5xl font-semibold mt-3">Doctors who truly listen</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Board-certified, deeply experienced, and committed to relationship-based care.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {doctors.map((d) => (
                <Card key={d.name} className="overflow-hidden border-0 shadow-soft hover:shadow-card transition-all duration-300">
                  <div className="aspect-[4/5] overflow-hidden bg-secondary">
                    <img
                      src={d.img}
                      alt={`Portrait of ${d.name}, ${d.role}`}
                      width={768}
                      height={896}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold">{d.name}</h3>
                    <p className="text-sm text-primary font-medium mt-1">{d.role}</p>
                    <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{d.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 md:py-28">
          <div className="container grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Meridian</span>
              <h2 className="text-3xl md:text-5xl font-semibold mt-3 mb-6">Healthcare designed around you, not the system.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We built Meridian to feel different — unhurried visits, doctors who remember your name,
                and a clinic that respects your time. Modern medicine with a human heart.
              </p>
              <ul className="space-y-4">
                {[
                  "30-minute appointments — never rushed",
                  "Direct messaging with your care team",
                  "Most lab results in 24 hours, on-site",
                  "Transparent pricing, no surprise bills",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 shadow-soft p-6 mt-8">
                  <Clock className="w-8 h-8 text-primary mb-3" />
                  <div className="font-semibold">Open 7 days</div>
                  <div className="text-sm text-muted-foreground">Including evenings & weekends</div>
                </Card>
                <Card className="border-0 shadow-soft p-6">
                  <ShieldCheck className="w-8 h-8 text-accent mb-3" />
                  <div className="font-semibold">Joint Commission accredited</div>
                  <div className="text-sm text-muted-foreground">Highest safety standards</div>
                </Card>
                <Card className="border-0 shadow-soft p-6">
                  <HeartPulse className="w-8 h-8 text-primary mb-3" />
                  <div className="font-semibold">Whole-family care</div>
                  <div className="text-sm text-muted-foreground">From newborns to seniors</div>
                </Card>
                <Card className="border-0 shadow-soft p-6 mt-8">
                  <Award className="w-8 h-8 text-accent mb-3" />
                  <div className="font-semibold">Award-winning team</div>
                  <div className="text-sm text-muted-foreground">Recognized regional leaders</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Appointment + Contact */}
        <section id="appointment" className="py-20 md:py-28 bg-soft">
          <div className="container grid lg:grid-cols-2 gap-12">
            <div id="contact">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get in touch</span>
              <h2 className="text-3xl md:text-5xl font-semibold mt-3 mb-6">We're here when you need us.</h2>
              <p className="text-muted-foreground text-lg mb-10">
                Call us, drop by, or request a visit online — a real human will respond within the hour.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-card shadow-soft flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Call us</div>
                    <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors">+1 (555) 123-4567</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-card shadow-soft flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <a href="mailto:hello@meridianhealth.com" className="text-muted-foreground hover:text-primary transition-colors">hello@meridianhealth.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-card shadow-soft flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Visit</div>
                    <div className="text-muted-foreground">240 Lakeside Avenue, Suite 100<br />Portland, OR 97201</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-card shadow-soft flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Hours</div>
                    <div className="text-muted-foreground">Mon–Fri 7am–8pm · Sat–Sun 9am–5pm</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-1">Request an appointment</h3>
                <p className="text-sm text-muted-foreground mb-6">We'll get back to you within one business hour.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" className="mt-1.5" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" className="mt-1.5" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason for visit</Label>
                    <Textarea id="reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Annual check-up, follow-up, new symptoms..." className="mt-1.5 min-h-[110px]" />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-hero hover:opacity-90 text-primary-foreground shadow-soft">
                    <CalendarCheck className="mr-1" /> Request appointment
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    For medical emergencies, call 911 immediately.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container py-10 grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-hero flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Meridian Health</span>
            </div>
            <p className="text-sm text-muted-foreground">Compassionate, modern healthcare for every stage of life.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold text-foreground mb-2">Quick links</div>
            <div className="flex flex-col gap-1.5">
              <a href="#services" className="hover:text-primary">Services</a>
              <a href="#doctors" className="hover:text-primary">Our doctors</a>
              <a href="#contact" className="hover:text-primary">Contact</a>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold text-foreground mb-2">Emergency</div>
            <p>For life-threatening emergencies, dial <span className="text-destructive font-semibold">911</span>.</p>
            <p className="mt-1">24/7 nurse line: <a href="tel:+15551234567" className="text-primary">+1 (555) 123-4567</a></p>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container py-5 text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Meridian Health Clinic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
