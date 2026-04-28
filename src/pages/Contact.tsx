import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent! We'll reply within one business day.");
    }, 800);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="We'd love to hear from you"
        subtitle="Questions about a role, your application, or how we can help? Reach out — a real human will reply."
      />
      <section className="container py-14 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-5">
          {[
            { icon: MapPin, label: "Office", value: "Doha, Qatar — serving all GCC countries" },
            { icon: Phone, label: "Phone", value: "+974 0000 0000" },
            { icon: Mail, label: "Email", value: "info@gulfnurses.qa" },
            { icon: Clock, label: "Hours", value: "Sun – Thu · 9:00 AM – 6:00 PM (GST)" },
          ].map((i) => (
            <div key={i.label} className="flex gap-4 bg-card rounded-2xl p-5 border border-border">
              <div className="w-11 h-11 rounded-xl bg-secondary grid place-items-center shrink-0">
                <i.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{i.label}</div>
                <div className="font-medium">{i.value}</div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl overflow-hidden border border-border shadow-soft h-64">
            <iframe
              title="Doha map"
              className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=51.45%2C25.25%2C51.60%2C25.35&layer=mapnik"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft space-y-5 h-fit">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="cname">Full name *</Label><Input id="cname" required className="mt-1.5" /></div>
            <div><Label htmlFor="cemail">Email *</Label><Input id="cemail" type="email" required className="mt-1.5" /></div>
          </div>
          <div><Label htmlFor="csubject">Subject</Label><Input id="csubject" className="mt-1.5" /></div>
          <div><Label htmlFor="cmsg">Message *</Label><Textarea id="cmsg" rows={6} required className="mt-1.5" /></div>
          <Button type="submit" disabled={loading} size="lg" className="bg-hero text-primary-foreground">
            {loading ? "Sending..." : <>Send Message <Send className="h-4 w-4" /></>}
          </Button>
        </form>
      </section>
    </>
  );
};

export default Contact;
