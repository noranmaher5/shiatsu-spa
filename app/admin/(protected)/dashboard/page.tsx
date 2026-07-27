import Link from "next/link";
import {
  Building2,
  Images,
  LayoutGrid,
  MessageSquareQuote,
  Sparkles,
  ArrowRight,
  Plus,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ADMIN_ROUTES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { getAllServicesAdmin } from "@/features/services/api";
import { getAllCategoriesAdmin } from "@/features/categories/api";
import { getAllBranchesAdmin } from "@/features/branches/api";
import { getAllGalleryItemsAdmin } from "@/features/gallery/api";
import { getAllTestimonialsAdmin } from "@/features/testimonials/api";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [services, categories, branches, gallery, testimonials] = await Promise.all([
    getAllServicesAdmin(),
    getAllCategoriesAdmin(),
    getAllBranchesAdmin(),
    getAllGalleryItemsAdmin(),
    getAllTestimonialsAdmin(),
  ]);

  const cards = [
    {
      href: ADMIN_ROUTES.services,
      label: "Services",
      icon: Sparkles,
      total: services.length,
      active: services.filter((item) => item.isActive).length,
      gradient: "from-emerald-500/20 to-emerald-700/5",
      iconBg: "bg-[#143725] text-[#d6ad62]",
      badgeColor: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
    },
    {
      href: ADMIN_ROUTES.categories,
      label: "Categories",
      icon: LayoutGrid,
      total: categories.length,
      active: categories.filter((item) => item.isActive).length,
      gradient: "from-amber-500/20 to-amber-700/5",
      iconBg: "bg-amber-900/20 text-amber-700",
      badgeColor: "bg-amber-500/10 text-amber-800 border-amber-500/20",
    },
    {
      href: ADMIN_ROUTES.branches,
      label: "Branches",
      icon: Building2,
      total: branches.length,
      active: branches.filter((item) => item.isActive).length,
      gradient: "from-teal-500/20 to-teal-700/5",
      iconBg: "bg-teal-900/20 text-teal-700",
      badgeColor: "bg-teal-500/10 text-teal-800 border-teal-500/20",
    },
    {
      href: ADMIN_ROUTES.gallery,
      label: "Gallery",
      icon: Images,
      total: gallery.length,
      active: gallery.filter((item) => item.isActive).length,
      gradient: "from-indigo-500/20 to-indigo-700/5",
      iconBg: "bg-indigo-900/20 text-indigo-700",
      badgeColor: "bg-indigo-500/10 text-indigo-800 border-indigo-500/20",
    },
    {
      href: ADMIN_ROUTES.testimonials,
      label: "Testimonials",
      icon: MessageSquareQuote,
      total: testimonials.length,
      active: testimonials.filter((item) => item.isActive).length,
      gradient: "from-rose-500/20 to-rose-700/5",
      iconBg: "bg-rose-900/20 text-rose-700",
      badgeColor: "bg-rose-500/10 text-rose-800 border-rose-500/20",
    },
  ];

  const quickActions = [
    { label: "Add New Service", href: `${ADMIN_ROUTES.services}/new`, icon: Plus, bg: "bg-[#143725] text-white hover:bg-[#0d1b12]" },
    { label: "Manage Gallery", href: ADMIN_ROUTES.gallery, icon: Images, bg: "bg-card border border-border text-foreground hover:bg-muted/50" },
    { label: "Website Settings", href: ADMIN_ROUTES.settings, icon: Settings, bg: "bg-card border border-border text-foreground hover:bg-muted/50" },
    { label: "Branches", href: ADMIN_ROUTES.branches, icon: Building2, bg: "bg-card border border-border text-foreground hover:bg-muted/50" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of your website content and management." />

      {/* Welcome Banner with Custom Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1b12] via-[#143725] to-[#1e4a34] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -end-10 -top-10 size-60 rounded-full bg-[#d6ad62]/10 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#d6ad62] backdrop-blur-md border border-white/15">
              <Sparkles className="size-3.5" />
              <span>حياكم الله 👋</span>
            </div>
            <h2 className="font-serif-heading text-2xl font-bold tracking-tight bg-gradient-to-r from-[#d6ad62] via-[#f5d78e] to-[#c89c47] bg-clip-text text-transparent sm:text-3xl drop-shadow-sm">
              Shiatsu Spa Kuwait — CMS Control Center
            </h2>
            <p className="max-w-xl text-xs text-white/80 sm:text-sm leading-relaxed">
              إدارة خدمات شياتسو سبا، المعرض، الفروع، والشهادات بسهولة وسرعة من مكان واحد.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-medium text-white backdrop-blur-md border border-white/15 shadow-inner">
              <ShieldCheck className="size-5 text-[#d6ad62]" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-heading text-lg font-bold text-foreground">Content Overview</h3>
          <span className="text-xs text-muted-foreground">Updated in real-time</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} prefetch={true} className="group">
              <Card className="relative h-full overflow-hidden transition-all duration-300 border-border/80 hover:-translate-y-1 hover:border-[#143725]/40 hover:shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                <CardContent className="relative flex flex-col justify-between p-6 h-full gap-4">
                  <div className="flex items-start justify-between">
                    <div className={`flex size-12 items-center justify-center rounded-2xl ${card.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      <card.icon className="size-6" />
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${card.badgeColor}`}>
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500"></span>
                      </span>
                      {card.active} active
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-sans text-3xl font-bold tracking-tight text-foreground">
                        {card.total}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                        {card.label}
                      </p>
                    </div>

                    <div className="flex size-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all duration-300 group-hover:bg-[#143725] group-hover:text-white">
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-foreground">
          <Zap className="size-4 text-[#c89c47]" />
          <h3 className="font-serif-heading text-base font-bold">Quick Management Actions</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 rounded-xl p-3.5 text-xs font-semibold transition-all shadow-xs ${action.bg}`}
            >
              <action.icon className="size-4 shrink-0" />
              <span className="truncate">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
