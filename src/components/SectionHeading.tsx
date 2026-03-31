interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-10">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00D4FF]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-white/70">{subtitle}</p>}
    </div>
  );
}
