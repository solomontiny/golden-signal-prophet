import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Clock, ArrowRight, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

const jobs = [
  { id: 1, title: "ICU Staff Nurse", country: "Qatar", city: "Doha", type: "Full-time", salary: "QAR 8,000 – 10,500", exp: "2+ years", tags: ["Critical Care", "DataFlow ready"] },
  { id: 2, title: "Emergency Room Nurse", country: "UAE", city: "Dubai", type: "Full-time", salary: "AED 9,000 – 12,000", exp: "3+ years", tags: ["ER", "DHA licensed"] },
  { id: 3, title: "Paediatric Nurse", country: "Saudi Arabia", city: "Riyadh", type: "Full-time", salary: "SAR 8,500 – 11,000", exp: "2+ years", tags: ["Paediatrics", "SCFHS"] },
  { id: 4, title: "Operating Theatre Nurse", country: "Kuwait", city: "Kuwait City", type: "Full-time", salary: "KWD 550 – 750", exp: "3+ years", tags: ["OT", "Scrub & Circulate"] },
  { id: 5, title: "Dialysis Nurse", country: "Bahrain", city: "Manama", type: "Full-time", salary: "BHD 550 – 700", exp: "2+ years", tags: ["Dialysis"] },
  { id: 6, title: "Home Care Nurse", country: "Oman", city: "Muscat", type: "Contract", salary: "OMR 450 – 600", exp: "1+ year", tags: ["Home Care"] },
  { id: 7, title: "Neonatal ICU Nurse", country: "Qatar", city: "Doha", type: "Full-time", salary: "QAR 9,500 – 12,000", exp: "3+ years", tags: ["NICU"] },
  { id: 8, title: "Oncology Nurse", country: "UAE", city: "Abu Dhabi", type: "Full-time", salary: "AED 10,000 – 13,000", exp: "3+ years", tags: ["Oncology", "HAAD"] },
];

const Jobs = () => {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const countries = ["All", ...Array.from(new Set(jobs.map((j) => j.country)))];

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (country === "All" || j.country === country) &&
          (q === "" || (j.title + j.city + j.tags.join(" ")).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, country],
  );

  return (
    <>
      <PageHeader
        eyebrow="Job Vacancies"
        title="Current openings across the GCC"
        subtitle="Fresh opportunities are added weekly. Don't see your specialty? Submit your profile and we'll match you when a role opens."
      />
      <section className="container py-10">
        <div className="flex flex-col md:flex-row gap-3 p-4 bg-card border border-border rounded-2xl shadow-soft">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by role, city or specialty..." className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                  country === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {filtered.map((j) => (
            <article key={j.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-card transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-semibold">{j.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {j.city}, {j.country}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold">{j.type}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-foreground/80">
                <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-primary" /> {j.salary}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-primary" /> {j.exp}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {j.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{t}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> Posted this week</span>
                <Button asChild size="sm" className="bg-hero text-primary-foreground">
                  <Link to="/apply">Apply <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">No vacancies match your search — try a different keyword.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Jobs;
