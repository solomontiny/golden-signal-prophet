import { Quote, Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const reviews = [
  { name: "Maria Santos", role: "ICU Nurse · Doha, Qatar", text: "From Prometric coaching to visa processing, Serenity ECDEM Global Limited handled everything. I landed my dream ICU role in Doha within four months.", rating: 5 },
  { name: "Rajesh Kumar", role: "ER Nurse · Dubai, UAE", text: "Their team was honest about every step. No hidden fees, clear timelines, and an advisor who actually picked up the phone.", rating: 5 },
  { name: "Fatima Abdullah", role: "Paediatric Nurse · Riyadh, KSA", text: "The interview prep made a huge difference — I walked into my panel interview confident and got the offer the same week.", rating: 5 },
  { name: "Joy Okafor", role: "OT Nurse · Kuwait City", text: "I was overwhelmed by DataFlow. They organised every document and I got verified faster than colleagues who applied alone.", rating: 5 },
  { name: "Anna Petrova", role: "Dialysis Nurse · Manama", text: "Five years in the Gulf and I still recommend them to every nurse I meet. Truly candidate-first.", rating: 5 },
  { name: "Daniel Mensah", role: "Home Care Nurse · Muscat", text: "Beyond recruitment — they kept checking in after I arrived. That human touch is rare in this industry.", rating: 5 },
];

const Testimonials = () => (
  <>
    <PageHeader
      eyebrow="Testimonials"
      title="Stories from nurses we've placed"
      subtitle="We measure our success by the careers we help build. Here's what some of them have to say."
    />
    <section className="container py-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((r, i) => (
        <article key={i} className="bg-card rounded-2xl p-8 border border-border shadow-soft relative">
          <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
          <div className="flex gap-0.5">
            {Array.from({ length: r.rating }).map((_, k) => (
              <Star key={k} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </div>
          <p className="mt-4 text-foreground/90 leading-relaxed">"{r.text}"</p>
          <div className="mt-6 pt-5 border-t border-border">
            <div className="font-semibold">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.role}</div>
          </div>
        </article>
      ))}
    </section>
  </>
);

export default Testimonials;
