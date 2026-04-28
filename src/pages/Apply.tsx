import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Apply = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Application submitted! Our team will get back to you within 48 hours.");
    }, 900);
  };

  return (
    <>
      <PageHeader
        eyebrow="Apply Now"
        title="Start your GCC nursing career in minutes"
        subtitle="Fill in your details below and one of our advisors will reach out within 48 hours with roles that match your experience."
      />
      <section className="container py-14 grid lg:grid-cols-[1.3fr_1fr] gap-10">
        <form onSubmit={onSubmit} className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-soft space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="first">First name *</Label><Input id="first" required className="mt-1.5" /></div>
            <div><Label htmlFor="last">Last name *</Label><Input id="last" required className="mt-1.5" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" required className="mt-1.5" /></div>
            <div><Label htmlFor="phone">Phone / WhatsApp *</Label><Input id="phone" required className="mt-1.5" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="nationality">Nationality</Label><Input id="nationality" className="mt-1.5" /></div>
            <div><Label htmlFor="country">Preferred GCC country</Label><Input id="country" placeholder="Qatar, UAE, KSA..." className="mt-1.5" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="specialty">Specialty *</Label><Input id="specialty" placeholder="ICU, ER, Paediatrics..." required className="mt-1.5" /></div>
            <div><Label htmlFor="exp">Years of experience *</Label><Input id="exp" type="number" min={0} required className="mt-1.5" /></div>
          </div>
          <div>
            <Label htmlFor="license">Licenses held</Label>
            <Input id="license" placeholder="DHA / HAAD / MOH / Prometric / NCLEX..." className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Tell us about yourself</Label>
            <Textarea id="message" rows={4} className="mt-1.5" placeholder="Current role, achievements, and what you're looking for..." />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="bg-hero text-primary-foreground w-full md:w-auto">
            {loading ? "Submitting..." : <>Submit Application <Send className="h-4 w-4" /></>}
          </Button>
          <p className="text-xs text-muted-foreground">By submitting, you agree to our <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.</p>
        </form>

        <aside className="space-y-5">
          <div className="bg-hero text-primary-foreground rounded-3xl p-8 shadow-glow">
            <h3 className="font-serif text-2xl font-bold">What happens next?</h3>
            <ol className="mt-5 space-y-4 text-sm">
              {[
                "Our advisor reviews your profile within 48 hours.",
                "We match you with suitable openings across the GCC.",
                "We guide you through interviews, licensing and visa.",
                "You land ready for your first shift abroad.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary-foreground/20 grid place-items-center font-bold shrink-0">{i + 1}</span>
                  <span className="text-primary-foreground/95">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-card rounded-3xl p-8 border border-border">
            <h4 className="font-serif text-lg font-semibold">Prefer to email?</h4>
            <p className="mt-2 text-sm text-muted-foreground">Send your CV directly to <a href="mailto:careers@serenitynursing.qa" className="text-primary font-medium">careers@serenitynursing.qa</a> — we respond to every application.</p>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Apply;
