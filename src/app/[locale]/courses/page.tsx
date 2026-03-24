"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
} from "lucide-react";
import {
  useCurrencyStore,
  formatPrice,
} from "@/components/layout/currency-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { publicApi } from "@/lib/api";
import { toast } from "sonner";
import type { Course } from "@/types";

function CourseCard({ course }: { course: Course }) {
  const t = useTranslations("courses");
  const { currency, exchangeRate } = useCurrencyStore();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const spotsLeft = course.maxParticipants
    ? course.maxParticipants - course.enrollmentCount
    : null;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
        <GraduationCap className="h-12 w-12 text-primary/30" />
      </div>
      <CardContent className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={course.format === "online" ? "default" : "secondary"}>
            {course.format === "online" ? (
              <><Video className="h-3 w-3 mr-1" />{t("online")}</>
            ) : (
              <><MapPin className="h-3 w-3 mr-1" />{t("inPerson")}</>
            )}
          </Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {t("duration", { hours: course.durationHours })}
          </Badge>
        </div>

        {/* Title & Description */}
        <h3 className="font-semibold text-lg mb-2">{course.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Date */}
        {course.startDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            {new Date(course.startDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}

        {/* Spots */}
        {spotsLeft !== null && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className={spotsLeft > 0 ? "text-green-600" : "text-destructive"}>
              {spotsLeft > 0
                ? t("spots", { count: spotsLeft })
                : t("full")}
            </span>
          </div>
        )}

        {/* Price & Enroll */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">{t("price")}</span>
            <p className="font-bold text-xl text-primary">
              {formatPrice(course.priceUsd, currency, exchangeRate)}
            </p>
          </div>
          <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
            <DialogTrigger asChild>
              <Button disabled={spotsLeft !== null && spotsLeft <= 0}>
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
  courseId: number;
  onSuccess: () => void;
}) {
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
      toast.success("Inscripción exitosa!");
      onSuccess();
    } catch {
      toast.error("Error al inscribirse. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="enroll-name">Full Name</Label>
        <Input
          id="enroll-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="enroll-email">Email</Label>
        <Input
          id="enroll-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="enroll-phone">Phone / WhatsApp</Label>
        <Input
          id="enroll-phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Confirm Enrollment
      </Button>
    </form>
  );
}

export default function CoursesPage() {
  const t = useTranslations("courses");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getCourses()
      .then((res) => setCourses(res.data))
      .catch(() => toast.error("Error loading courses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
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

      {/* Course Grid */}
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
      ) : view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        /* Calendar View - Simple month grid */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              April - May 2026
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courses.sort(
                (a, b) =>
                  new Date(a.startDate || "").getTime() -
                  new Date(b.startDate || "").getTime()
              ).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-bold">
                      {course.startDate
                        ? new Date(course.startDate).toLocaleDateString(
                            "en-US",
                            { month: "short" }
                          )
                        : "TBD"}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {course.startDate
                        ? new Date(course.startDate).getDate()
                        : "—"}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{course.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.durationHours}h
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {course.format === "online" ? "Online" : "In Person"}
                      </Badge>
                    </div>
                  </div>
                  <p className="font-bold text-primary">
                    ${course.priceUsd}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
