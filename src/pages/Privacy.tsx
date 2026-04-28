import PageHeader from "@/components/PageHeader";

const sections = [
  {
    h: "1. Who we are",
    p: "Serenity International is a licensed nursing recruitment and training agency based in Doha, Qatar, serving hospitals and candidates across the GCC region.",
  },
  {
    h: "2. Information we collect",
    p: "We collect information you provide directly — name, contact details, nationality, professional credentials, CV, licensing documents and any information shared during consultations or in application forms.",
  },
  {
    h: "3. How we use your information",
    p: "Your information is used to evaluate your eligibility, match you with suitable vacancies, process documentation and visa applications, provide training services, and communicate opportunities and updates.",
  },
  {
    h: "4. Sharing with third parties",
    p: "We share information only with prospective employers you consent to apply with, licensing authorities (DataFlow, Prometric, DHA, HAAD, MOH, SCFHS), and government bodies required for visa and work-permit processing.",
  },
  {
    h: "5. Data retention",
    p: "We retain your information for as long as your candidacy is active and for a reasonable period afterwards to support re-engagement or for legal compliance. You may request deletion at any time.",
  },
  {
    h: "6. Your rights",
    p: "You have the right to access, correct, update or delete your personal information, and to withdraw consent to further processing. To exercise these rights, email info@serenitynursing.qa.",
  },
  {
    h: "7. Security",
    p: "We use reasonable administrative, technical and physical safeguards to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    h: "8. Cookies",
    p: "Our website uses cookies to remember your preferences and measure site performance. You can disable cookies in your browser, but some site features may not work as intended.",
  },
  {
    h: "9. Changes to this policy",
    p: "We may update this Privacy Policy from time to time. Material changes will be communicated via our website or email.",
  },
  {
    h: "10. Contact",
    p: "Questions about this policy? Email info@serenitynursing.qa or write to our Doha office.",
  },
];

const Privacy = () => (
  <>
    <PageHeader
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Last updated: 28 April 2026. This policy explains how Serenity International collects, uses and protects your information."
    />
    <section className="container py-14 max-w-3xl">
      <div className="prose prose-neutral max-w-none">
        {sections.map((s) => (
          <div key={s.h} className="mb-8">
            <h2 className="font-serif text-2xl font-bold">{s.h}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{s.p}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default Privacy;
