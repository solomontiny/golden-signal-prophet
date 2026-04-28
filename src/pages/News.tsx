import { Calendar, MapPin, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const items = [
  { date: "15 May 2026", city: "Doha, Qatar", title: "Serenity International Career Fair 2026", desc: "Meet recruiters from 20+ hospitals across the GCC. Free entry for licensed nurses.", tag: "Event" },
  { date: "02 May 2026", city: "Online", title: "DataFlow & Prometric Q&A Webinar", desc: "Everything you need to know about credential verification for GCC licensure.", tag: "Webinar" },
  { date: "20 Apr 2026", city: "Manila, PH", title: "Philippines Recruitment Drive", desc: "Face-to-face interviews for ICU and ER nurses headed to Qatar and UAE.", tag: "Recruitment" },
  { date: "08 Apr 2026", city: "Press", title: "Serenity International partners with Bahrain polyclinic network", desc: "A new partnership opens up 80+ nursing positions across Bahrain in 2026.", tag: "News" },
  { date: "25 Mar 2026", city: "Kochi, IN", title: "India Career Expo — South Region", desc: "Screening and counselling for Indian nurses interested in GCC placements.", tag: "Recruitment" },
  { date: "10 Mar 2026", city: "Online", title: "IELTS / OET Masterclass", desc: "Free 90-minute session covering top tips from our top language trainers.", tag: "Webinar" },
];

const News = () => (
  <>
    <PageHeader
      eyebrow="News & Events"
      title="What's happening at Serenity International"
      subtitle="Career fairs, webinars, partnership announcements and industry updates — stay in the loop."
    />
    <section className="container py-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((it, i) => (
        <article key={i} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card transition-shadow group">
          <div className="h-40 bg-hero relative grid place-items-center">
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-background text-foreground font-bold px-2.5 py-1 rounded-full">{it.tag}</span>
            <Calendar className="h-12 w-12 text-primary-foreground/40" />
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {it.date}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {it.city}</span>
            </div>
            <h3 className="mt-3 font-serif text-xl font-semibold group-hover:text-primary transition-colors">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">Read more <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </article>
      ))}
    </section>
  </>
);

export default News;
