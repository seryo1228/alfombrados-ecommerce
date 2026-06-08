"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  List,
  Check,
  Infinity as InfinityIcon,
  MessageCircle,
} from "lucide-react";
import {
  useCurrencyStore,
  formatPrice,
} from "@/components/layout/currency-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { publicApi } from "@/lib/api";
import { toast } from "sonner";
import type { Course } from "@/types";

const BRAND = {
  blue:  "#1779c2",
  deep:  "#2354a2",
  sky:   "#369cdb",
  tint:  "#d1e1fb",
  wa:    "#25D366",
} as const;

function CourseCard({ course }: { course: Course }) {
  const t = useTranslations("courses");
  const locale = useLocale();
  const isEs = locale === "es";
  const { currency, exchangeRate } = useCurrencyStore();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const spotsLeft = course.maxParticipants
    ? course.maxParticipants - course.enrollmentCount
    : null;
  const isOnline = course.format === "online";

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image / format header */}
      <div
        className="aspect-video relative flex items-center justify-center"
        style={{ backgroundColor: isOnline ? BRAND.deep : BRAND.tint }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`course-dots-${course.id}`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="5" fill={isOnline ? "white" : BRAND.deep} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#course-dots-${course.id})`}/>
        </svg>
        {isOnline ? (
          <Video className="h-14 w-14 text-white/90 relative z-10" />
        ) : (
          <GraduationCap className="h-14 w-14 relative z-10" style={{ color: BRAND.deep }} />
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge
            className="text-white border-0"
            style={{ backgroundColor: isOnline ? BRAND.deep : BRAND.blue }}
          >
            {isOnline ? (
              <><Video className="h-3 w-3 mr-1" />{t("online")}</>
            ) : (
              <><MapPin className="h-3 w-3 mr-1" />{t("inPerson")}</>
            )}
          </Badge>
          {course.durationHours && (
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {t("duration", { hours: course.durationHours })}
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold text-lg mb-2">{course.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
          {course.description}
        </p>

        {/* Date & Location */}
        {course.courseDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            {new Date(course.courseDate + "T12:00:00").toLocaleDateString(isEs ? "es-VE" : "en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
        {course.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            {course.location}
          </div>
        )}

        {/* Spots */}
        {spotsLeft !== null && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className={spotsLeft > 0 ? "text-emerald-600" : "text-destructive"}>
              {spotsLeft > 0
                ? t("spots", { count: spotsLeft })
                : t("full")}
            </span>
          </div>
        )}

        {/* Price & Enroll */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-xs text-muted-foreground">{t("price")}</span>
            <p className="font-bold text-xl" style={{ color: BRAND.blue }}>
              {formatPrice(course.priceUsd, currency, exchangeRate)}
            </p>
          </div>
          <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={spotsLeft !== null && spotsLeft <= 0}
                style={{ backgroundColor: BRAND.blue }}
                className="text-white hover:opacity-90"
              >
                {t("enroll")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{course.name}</DialogTitle>
              </DialogHeader>
              <EnrollForm
                courseId={course.id}
                onSuccess={() => setEnrollOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function EnrollForm({
  courseId,
  onSuccess,
}: {
  courseId: string;
  onSuccess: () => void;
}) {
  const locale = useLocale();
  const isEs = locale === "es";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await publicApi.enrollCourse(courseId, {
        participantName: name,
        phone,
        email,
        paymentMethod: "efectivo",
      });
      toast.success(isEs ? "¡Inscripción exitosa!" : "Enrollment successful!");
      onSuccess();
    } catch {
      toast.error(isEs ? "Error al inscribirse. Intenta de nuevo." : "Error enrolling. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="enroll-name">{isEs ? "Nombre completo" : "Full Name"}</Label>
        <Input
          id="enroll-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="enroll-email">{isEs ? "Correo electrónico" : "Email"}</Label>
        <Input
          id="enroll-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="enroll-phone">{isEs ? "Teléfono / WhatsApp" : "Phone / WhatsApp"}</Label>
        <Input
          id="enroll-phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="w-full text-white"
        style={{ backgroundColor: BRAND.blue }}
        disabled={submitting}
      >
        {submitting
          ? (isEs ? "Procesando..." : "Processing...")
          : (isEs ? "Confirmar inscripción" : "Confirm Enrollment")}
      </Button>
    </form>
  );
}

/* ─── Format Benefit Card ─────────────────────────────────── */
function FormatHero({
  variant,
  title,
  description,
  benefits,
}: {
  variant: "in-person" | "digital";
  title: string;
  description: string;
  benefits: string[];
}) {
  const isDigital = variant === "digital";
  return (
    <div
      className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
      style={{
        backgroundColor: isDigital ? BRAND.deep : "white",
        color: isDigital ? "white" : "inherit",
        borderWidth: isDigital ? 0 : 1,
        borderColor: BRAND.tint,
      }}
    >
      {isDigital && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="format-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="5" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#format-dots)"/>
        </svg>
      )}
      <div className="relative z-10 flex items-start gap-4">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: isDigital ? "rgba(255,255,255,0.12)" : BRAND.tint,
          }}
        >
          {isDigital ? (
            <Video className="h-6 w-6" style={{ color: "white" }} />
          ) : (
            <MapPin className="h-6 w-6" style={{ color: BRAND.deep }} />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{
              color: isDigital ? "rgba(255,255,255,0.85)" : undefined,
              opacity: isDigital ? 1 : 0.85,
            }}
          >
            {description}
          </p>
          <ul className="space-y-1.5">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0" style={{ color: isDigital ? BRAND.sky : BRAND.blue }} />
                <span style={{ opacity: isDigital ? 0.9 : 0.85 }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Digital "Coming Soon" placeholder ─────────────────────── */
function DigitalComingSoon() {
  const t = useTranslations("courses");
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: BRAND.tint }}
          >
            <InfinityIcon className="h-8 w-8" style={{ color: BRAND.deep }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge style={{ backgroundColor: BRAND.blue }} className="text-white border-0">
                {t("digitalSection.newBadge")}
              </Badge>
              <h3 className="text-xl font-bold">{t("digitalSection.comingSoon")}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              {t("digitalSection.comingSoonDesc")}
            </p>
            <a
              href={`https://wa.me/584120993377?text=${encodeURIComponent(
                isEs
                  ? "Hola! Me interesa enterarme cuando salgan los cursos digitales de Alfombra2."
                  : "Hi! I'd like to be notified when Alfombra2's digital courses launch."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND.wa }}
            >
              <MessageCircle className="h-4 w-4" />
              {t("digitalSection.notifyMe")}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function CoursesPage() {
  const t = useTranslations("courses");
  const locale = useLocale();
  const isEs = locale === "es";
  const [view, setView] = useState<"list" | "calendar">("list");
  const [format, setFormat] = useState<"all" | "in_person" | "online">("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getCourses()
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];
        const upcoming = res.data.filter(
          (c: Course) => !c.courseDate || c.courseDate >= today
        );
        setCourses(upcoming);
      })
      .catch(() => toast.error(isEs ? "Error cargando cursos" : "Error loading courses"))
      .finally(() => setLoading(false));
  }, [isEs]);

  const filteredCourses = useMemo(() => {
    if (format === "all") return courses;
    if (format === "online") return courses.filter((c) => c.format === "online");
    return courses.filter((c) => c.format === "in_person" || c.format === "hybrid");
  }, [courses, format]);

  const hasDigitalCourses = courses.some((c) => c.format === "online");

  return (
    <div className="min-h-screen">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#f8faff" }}>
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide mb-4 flex items-center gap-2" style={{ color: BRAND.blue }}>
              <GraduationCap className="h-4 w-4" />
              {t("heroBadge")}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-5 leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FORMAT INTRO ═══════════════════ */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormatHero
            variant="in-person"
            title={t("inPersonSection.title")}
            description={t("inPersonSection.description")}
            benefits={[
              t("inPersonSection.benefit1"),
              t("inPersonSection.benefit2"),
              t("inPersonSection.benefit3"),
            ]}
          />
          <FormatHero
            variant="digital"
            title={t("digitalSection.title")}
            description={t("digitalSection.description")}
            benefits={[
              t("digitalSection.benefit1"),
              t("digitalSection.benefit2"),
              t("digitalSection.benefit3"),
            ]}
          />
        </div>
      </section>

      {/* ═══════════════════ FILTERS + GRID ═══════════════════ */}
      <section className="container mx-auto px-4 pb-20">
        {/* Filter tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Tabs value={format} onValueChange={(v) => setFormat(v as "all" | "in_person" | "online")}>
            <TabsList>
              <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
              <TabsTrigger value="in_person">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {t("tabs.inPerson")}
              </TabsTrigger>
              <TabsTrigger value="online">
                <Video className="h-3.5 w-3.5 mr-1.5" />
                {t("tabs.digital")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-2" />
                {t("list")}
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                {t("calendar")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Show "coming soon" placeholder when filtering to digital and there are none */}
            {format === "online" && !hasDigitalCourses ? (
              <DigitalComingSoon />
            ) : view === "list" ? (
              filteredCourses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <GraduationCap className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-1">{t("emptyState.noUpcoming")}</h3>
                    <p className="text-sm text-muted-foreground">{t("emptyState.checkBack")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )
            ) : (
              /* Calendar View */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {isEs ? "Calendario de cursos" : "Course calendar"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredCourses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{t("emptyState.noUpcoming")}</p>
                  ) : (
                    <div className="space-y-3">
                      {[...filteredCourses].sort(
                        (a, b) =>
                          new Date(a.courseDate || "").getTime() -
                          new Date(b.courseDate || "").getTime()
                      ).map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="text-center min-w-[60px]">
                            <p className="text-sm font-bold">
                              {course.courseDate
                                ? new Date(course.courseDate + "T12:00:00").toLocaleDateString(isEs ? "es-VE" : "en-US", { month: "short" })
                                : "TBD"}
                            </p>
                            <p className="text-2xl font-bold" style={{ color: BRAND.blue }}>
                              {course.courseDate ? new Date(course.courseDate + "T12:00:00").getDate() : "—"}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{course.name}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              {course.durationHours && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {course.durationHours}h
                                </span>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {course.format === "online" ? t("online") : t("inPerson")}
                              </Badge>
                            </div>
                          </div>
                          <p className="font-bold" style={{ color: BRAND.blue }}>${course.priceUsd}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>
    </div>
  );
}
