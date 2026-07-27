import { getPageSeoForMetadata } from "@/actions/page-seo-action";
import { Scale, Shield, Users, Award, ArrowRight, CheckCircle2, BookOpen, Gavel } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoForMetadata("/about");

  return {
    title: seo?.metaTitle ?? "About Us",
    description: seo?.metaDescription ?? "",
    openGraph: {
      title: seo?.ogTitle ?? seo?.metaTitle ?? "About Us",
      description: seo?.ogDescription ?? seo?.metaDescription ?? "",
      images: seo?.ogImageKey ? [{ url: seo.ogImageKey }] : [],
    },
  };
}

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "5000+", label: "Cases Handled" },
  { value: "98%", label: "Success Rate" },
  { value: "50+", label: "Expert Lawyers" },
];

const practiceAreas = [
  { icon: Scale, title: "Corporate Law", description: "Business formation, mergers & acquisitions, corporate governance, and compliance advisory." },
  { icon: Shield, title: "Criminal Defense", description: "Expert representation in criminal cases, bail applications, and appellate litigation." },
  { icon: BookOpen, title: "Family Law", description: "Divorce, child custody, adoption, and domestic violence protection services." },
  { icon: Gavel, title: "Civil Litigation", description: "Property disputes, contract conflicts, tort claims, and alternative dispute resolution." },
];

const values = [
  "Client-centered approach with personalized attention",
  "Transparent communication and ethical practice",
  "Aggressive advocacy with strategic thinking",
  "Proven track record of successful outcomes",
  "Affordable and flexible fee structures",
  "24/7 availability for urgent legal matters",
];

const team = [
  { name: "Adv. Ram Prasad Sharma", role: "Senior Partner", initials: "RS", specialization: "Corporate Law" },
  { name: "Adv. Sita Devi Thapa", role: "Managing Partner", initials: "ST", specialization: "Family Law" },
  { name: "Adv. Krishna Bahadur Magar", role: "Senior Advocate", initials: "KM", specialization: "Criminal Defense" },
  { name: "Adv. Lakshmi Gurung", role: "Partner", initials: "LG", specialization: "Civil Litigation" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/70 backdrop-blur-sm">
              <Scale className="h-4 w-4" />
              About Law Sagar
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trusted Legal Partners Since{" "}
              <span className="text-primary">2009</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
              Law Sagar is a premier law firm dedicated to providing exceptional legal services
              with integrity, professionalism, and a deep commitment to justice. We combine
              decades of experience with modern legal strategies to deliver results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Our Story
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A Legacy of Legal Excellence
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  Founded in 2009, Law Sagar began with a vision to make quality legal services
                  accessible to everyone. What started as a small practice has grown into one of
                  Nepal&apos;s most respected law firms.
                </p>
                <p>
                  Our name, &quot;Law Sagar&quot; (Ocean of Law), reflects our deep knowledge and
                  vast experience in the legal field. We believe in not just practicing law, but
                  educating and empowering our clients to make informed decisions.
                </p>
                <p>
                  Over the years, we have successfully represented individuals, families, and
                  corporations in complex legal matters, earning a reputation for excellence,
                  integrity, and results.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <Scale className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Law Sagar Office</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl bg-primary/5 border border-primary/10 -z-10" />
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-2xl bg-primary/5 border border-primary/10 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="border-t bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Gavel className="h-4 w-4" />
              Practice Areas
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comprehensive Legal Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We cover a wide range of legal practice areas to serve all your needs.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {practiceAreas.map((area) => (
              <div
                key={area.title}
                className="group rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <area.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Award className="h-4 w-4" />
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                The Law Sagar Difference
              </h2>
              <p className="mt-4 text-muted-foreground">
                We don&apos;t just represent cases — we build relationships. Our commitment to
                excellence and client satisfaction sets us apart.
              </p>
              <ul className="mt-8 space-y-4">
                {values.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <Shield className="h-20 w-20 text-primary/20 mx-auto mb-4" />
                  <p className="text-sm font-medium text-primary/50">15+ Years of Trust</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Users className="h-4 w-4" />
              Our Team
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet Our Expert Lawyers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experienced legal professionals dedicated to your success.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-2xl font-bold text-white transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                  {member.initials}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-1 text-xs text-muted-foreground">{member.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 text-center shadow-xl sm:px-16">
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <Scale className="mx-auto h-12 w-12 text-white/60 mb-6" />
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Need Legal Assistance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
              Schedule a free consultation with our expert team. We&apos;re here to help
              you navigate your legal challenges.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Schedule Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="tel:+977-9800000000"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Call Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
