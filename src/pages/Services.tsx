import { Stethoscope, Plane, FileCheck2, GraduationCap, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const services = [
  {
    icon: Stethoscope,
    title: "Nursing Recruitment",
    desc: "We connect qualified nurses with leading hospitals, polyclinics and long-term care facilities across the GCC.",
    items: [
      "Staff Nurse, ICU, ER, OT, Paediatric and Dialysis roles",
      "Permanent, contract, and locum placements",
      "Salary & benefit negotiation on your behalf",
      "Interview coaching and preparation",
    ],
  },
  {
    icon: Plane,
    title: "Visa Services",
    desc: "From initial work permit application to residency processing — we simplify every bureaucratic step.",
    items: [
      "Work permit & employment visa processing",
      "Family sponsorship & dependent visas",
      "Embassy attestation and legalisation",
      "Airport pick-up coordination",
    ],
  },
  {
    icon: FileCheck2,
    title: "Documentation",
    desc: "Credentialing can be overwhelming — our team handles it end-to-end so you can focus on the role.",
    items: [
      "DataFlow primary source verification",
      "Prometric / DHA / HAAD / MOH licensure",
      "Certificate attestation (MOFA, embassy)",
      "CV formatting & portfolio building",
    ],
  },
  {
    icon: GraduationCap,
    title: "Nurses Training Services",
    desc: "Equip yourself with the skills, certifications and language proficiency demanded by GCC employers.",
    items: [
      "Prometric & NCLEX exam preparation",
      "IELTS & OET English coaching",
      "BLS, ACLS and PALS certification prep",
      "Clinical skills refreshers & simulations",
    ],
  },
];

const Services = () => (
  <>
    <PageHeader
      eyebrow="Our Services"
      title="Four pillars, one goal — your successful nursing career abroad"
      subtitle="Whether you're starting your first international role or advancing your specialty, our services cover every stage of the journey."
    />
    <section className="container py-16 grid md:grid-cols-2 gap-6">
      {services.map((s) => (
        <article key={s.title} id={s.title.toLowerCase().replace(/[^a-z]/g, "-")} className="bg-card rounded-2xl p-8 border border-border shadow-soft hover:shadow-card transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-hero grid place-items-center shadow-glow">
            <s.icon className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-bold">{s.title}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">{s.desc}</p>
          <ul className="mt-5 space-y-2.5">
            {s.items.map((i) => (
              <li key={i} className="flex gap-2.5 text-sm"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />{i}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  </>
);

export default Services;
