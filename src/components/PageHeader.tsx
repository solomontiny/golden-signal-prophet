interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

const PageHeader = ({ eyebrow, title, subtitle }: Props) => (
  <section className="bg-soft border-b border-border">
    <div className="container py-14 lg:py-20 max-w-3xl">
      {eyebrow && <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">{eyebrow}</span>}
      <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  </section>
);

export default PageHeader;
