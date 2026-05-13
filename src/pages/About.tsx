import { CheckCircle2, Target, Heart, Compass } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import img from "@/assets/nurses-training.jpg";
import portrait from "@/assets/ceo-segun-aboaba.jpg";

const About = () => (
  <>
    <PageHeader
      eyebrow="About Us"
      title="Connecting skilled nurses with the Gulf's leading healthcare providers"
      subtitle="Based in Doha and serving the entire GCC, we've spent the last three years placing qualified nurses in meaningful roles while supporting their growth every step of the way."
    />
    <section className="container py-16 grid lg:grid-cols-2 gap-12 items-center">
      <img src={img} alt="Nurses in a GCC hospital" loading="lazy" className="rounded-3xl shadow-card w-full object-cover" />
      <div>
        <h2 className="font-serif text-3xl font-bold">Who we are</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Serenity ECDEM Global Limited is a licensed recruitment and training agency headquartered in Doha, Qatar. Since our founding, we have built
          strong relationships with hospitals, polyclinics and long-term care facilities across Qatar, the UAE, Saudi Arabia,
          Kuwait, Bahrain and Oman.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Beyond recruitment, we invest in the nurses we represent — offering exam preparation, language coaching,
          documentation and visa services so every candidate arrives ready to thrive.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            "Licensed in Qatar, active across all 6 GCC countries",
            "Transparent, candidate-first process — no hidden fees",
            "Partner network of 60+ hospitals and clinics",
            "Dedicated advisor from application through onboarding",
          ].map((f) => (
            <li key={f} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" /><span>{f}</span></li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-soft">
      <div className="container py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, title: "Our Mission", desc: "To empower nurses to build rewarding international careers while helping GCC healthcare providers find the talent they need." },
          { icon: Heart, title: "Our Values", desc: "Integrity, empathy and excellence guide every interaction — from the first call to long after placement." },
          { icon: Compass, title: "Our Vision", desc: "To be the most trusted nursing recruitment and training partner in the Gulf region." },
        ].map((v) => (
          <div key={v.title} className="bg-card rounded-2xl p-8 shadow-soft border border-border">
            <v.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-serif text-xl font-semibold">{v.title}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container py-16 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
      <img src={portrait} alt="Segun Aboaba, CEO of Serenity ECDEM Global Limited" loading="lazy" className="rounded-3xl shadow-card w-full object-cover aspect-[4/5]" />
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Leadership</span>
        <h2 className="mt-3 font-serif text-3xl font-bold">Segun Aboaba — Chief Executive Officer</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Under the leadership of CEO Segun Aboaba, Serenity ECDEM Global Limited has grown into a trusted partner for hospitals and
          nurses across the Gulf. His vision centres on candidate care, transparent processes, and long-term relationships with
          healthcare providers.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Our consultants include former senior nurses, HR specialists, and migration advisors. We understand both the clinical
          demands of your next role and the practical realities of relocating to a new country.
        </p>
      </div>
    </section>
  </>
);

export default About;
