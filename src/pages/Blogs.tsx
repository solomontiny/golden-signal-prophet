import { Clock, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const posts = [
  { cat: "Career", read: "6 min", title: "How to pass Prometric on your first attempt", excerpt: "A step-by-step guide from nurses who scored top marks — study plans, resources and test-day tips." },
  { cat: "Relocation", read: "8 min", title: "Living in Qatar as an expat nurse: the real picture", excerpt: "Housing, cost of living, culture and day-to-day routines — what nurses who made the move want you to know." },
  { cat: "Licensing", read: "5 min", title: "DataFlow explained: documents you actually need", excerpt: "Skip the confusion — here's the exact checklist nurses need before starting their GCC application." },
  { cat: "Language", read: "7 min", title: "IELTS vs OET: which exam should a nurse take?", excerpt: "Pros, cons and which GCC employers accept which test. Plus study strategies that actually work." },
  { cat: "Interviews", read: "4 min", title: "7 questions GCC hospital interviewers ask — and how to answer", excerpt: "Real questions from real panels, with frameworks to structure your strongest answers." },
  { cat: "Career", read: "6 min", title: "From staff nurse to charge nurse: your 5-year roadmap", excerpt: "Skills to develop, certifications to collect, and ways to stand out for senior roles in the Gulf." },
];

const Blogs = () => (
  <>
    <PageHeader
      eyebrow="Blogs"
      title="Insights for nurses building a career abroad"
      subtitle="Practical guides, interviews and stories — written by recruiters, trainers and nurses who've been there."
    />
    <section className="container py-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((p, i) => (
        <article key={i} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-card transition-shadow group">
          <div className="h-44 bg-accent-gradient" />
          <div className="p-6">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">{p.cat}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {p.read} read</span>
            </div>
            <h3 className="mt-3 font-serif text-xl font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
            <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">Read article <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </article>
      ))}
    </section>
  </>
);

export default Blogs;
