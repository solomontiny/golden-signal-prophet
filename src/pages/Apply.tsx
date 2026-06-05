import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { z } from "zod";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_WHATSAPP = "97472021636";

const schema = z.object({
  first_name: z.string().trim().min(1).max(80),
  last_name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(40),
  nationality: z.string().trim().max(80).optional().or(z.literal("")),
  preferred_country: z.string().trim().max(80).optional().or(z.literal("")),
  specialty: z.string().trim().min(1).max(120),
  experience_years: z.coerce.number().int().min(0).max(70),
  licenses: z.string().trim().max(255).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const Apply = () => {
  const [loading, setLoading] = useState(false);
  const [cv, setCv] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const raw = Object.fromEntries(fd.entries());
      const parsed = schema.safeParse(raw);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        toast.error(first?.message || "Please check the form fields.");
        setLoading(false);
        return;
      }
      const data = parsed.data;

      let cv_path: string | null = null;
      if (cv) {
        if (cv.size > 8 * 1024 * 1024) {
          toast.error("CV must be under 8MB.");
          setLoading(false);
          return;
        }
        const ext = cv.name.split(".").pop()?.toLowerCase() || "pdf";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("cvs").upload(path, cv, {
          contentType: cv.type || "application/octet-stream",
          upsert: false,
        });
        if (upErr) throw upErr;
        cv_path = path;
      }

      const { error } = await supabase.from("applications").insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        nationality: data.nationality || null,
        preferred_country: data.preferred_country || null,
        specialty: data.specialty,
        experience_years: data.experience_years,
        licenses: data.licenses || null,
        message: data.message || null,
        cv_path,
      });
      if (error) throw error;

      // WhatsApp notification — opens prefilled message to admin number
      const lines = [
        "*New Application — Serenity ECDEM Global Limited*",
        `*Name:* ${data.first_name} ${data.last_name}`,
        `*Email:* ${data.email}`,
        `*Phone:* ${data.phone}`,
        data.nationality && `*Nationality:* ${data.nationality}`,
        data.preferred_country && `*Preferred:* ${data.preferred_country}`,
        `*Specialty:* ${data.specialty}`,
        `*Experience:* ${data.experience_years} yrs`,
        data.licenses && `*Licenses:* ${data.licenses}`,
        data.message && `*Message:* ${data.message}`,
      ].filter(Boolean).join("\n");
      const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(lines)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      (e.target as HTMLFormElement).reset();
      setCv(null);
      toast.success("Application submitted! We'll be in touch within 48 hours.");
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Please try again or contact us via WhatsApp.");
    } finally {
      setLoading(false);
    }
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
            <div><Label htmlFor="first_name">First name *</Label><Input id="first_name" name="first_name" required className="mt-1.5" /></div>
            <div><Label htmlFor="last_name">Last name *</Label><Input id="last_name" name="last_name" required className="mt-1.5" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required className="mt-1.5" /></div>
            <div><Label htmlFor="phone">Phone / WhatsApp *</Label><Input id="phone" name="phone" required className="mt-1.5" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="nationality">Nationality</Label><Input id="nationality" name="nationality" className="mt-1.5" /></div>
            <div><Label htmlFor="preferred_country">Preferred GCC country</Label><Input id="preferred_country" name="preferred_country" placeholder="Qatar, UAE, KSA..." className="mt-1.5" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="specialty">Specialty *</Label><Input id="specialty" name="specialty" placeholder="ICU, ER, Paediatrics..." required className="mt-1.5" /></div>
            <div><Label htmlFor="experience_years">Years of experience *</Label><Input id="experience_years" name="experience_years" type="number" min={0} required className="mt-1.5" /></div>
          </div>
          <div>
            <Label htmlFor="licenses">Licenses held</Label>
            <Input id="licenses" name="licenses" placeholder="DHA / HAAD / MOH / Prometric / NCLEX..." className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="cv">Upload CV (PDF/DOC, max 8MB)</Label>
            <Input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files?.[0] || null)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Tell us about yourself</Label>
            <Textarea id="message" name="message" rows={4} className="mt-1.5" placeholder="Current role, achievements, and what you're looking for..." />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="bg-hero text-primary-foreground w-full md:w-auto">
            {loading ? "Submitting..." : <>Submit Application <Send className="h-4 w-4" /></>}
          </Button>
          <p className="text-xs text-muted-foreground">A WhatsApp window will open to notify our recruiter. By submitting, you agree to our <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.</p>
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
            <p className="mt-2 text-sm text-muted-foreground">Send your CV directly to <a href="mailto:serenityecdemltd@gmail.com" className="text-primary font-medium">serenityecdemltd@gmail.com</a> — we respond to every application.</p>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Apply;
