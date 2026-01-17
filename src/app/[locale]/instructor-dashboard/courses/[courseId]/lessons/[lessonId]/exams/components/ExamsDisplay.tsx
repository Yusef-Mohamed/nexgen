"use client";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { IExam } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
// import { useAuth } from "@/components/auth-provider";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Loader2,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import { cn, getDynamicString, getStringObject } from "@/lib/utils";
import { AxiosError } from "axios";

interface ExamsDisplayProps {
  type: "course" | "lesson" | "placement";
  parentId: string;
  title?: string;
  description?: string;
  backUrl?: string;
  onViewQuestions: (exam: IExam) => void;
  initialExamId?: string | undefined;
  exams?: IExam[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export const ExamsDisplay = ({
  type,
  parentId,
  title,
  description,
  backUrl,
  onViewQuestions,
  initialExamId,
  exams: examsProp,
  loading: loadingProp,
  error: errorProp,
  onRefresh,
}: ExamsDisplayProps) => {
  const text = useTranslations("exams");
  // token is not needed here when data is provided by parent
  const [exams, setExams] = useState<IExam[]>(examsProp || []);
  const [loading, setLoading] = useState<boolean>(loadingProp ?? true);
  const [error, setError] = useState<string | null>(errorProp ?? null);
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<IExam | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch exams based on type and parentId
  // Keep local state in sync when parent provides data
  useEffect(() => {
    if (Array.isArray(examsProp)) setExams(examsProp);
  }, [examsProp]);
  useEffect(() => {
    if (typeof loadingProp === "boolean") setLoading(loadingProp);
  }, [loadingProp]);
  useEffect(() => {
    if (typeof errorProp !== "undefined") setError(errorProp ?? null);
  }, [errorProp]);

  // Auto-open exam from URL param after exams load
  useEffect(() => {
    if (!loading && !error && initialExamId && exams.length > 0) {
      const match = exams.find((e) => e._id === initialExamId);
      if (match) {
        // Use a small delay to ensure dropdown is closed if it was open
        const timer = setTimeout(() => {
          onViewQuestions(match);
        }, 50);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, initialExamId, exams]);

  const handleAddExam = () => {
    if (exams.length >= 2) return;
    setEditingExam(null);
    setExamDialogOpen(true);
  };

  const handleEditExam = (exam: IExam) => {
    setEditingExam(exam);
    setEditDialogOpen(true);
  };

  const handleDeleteExam = (examId: string) => {
    setDeletingExamId(examId);
  };

  const confirmDeleteExam = async () => {
    if (!deletingExamId) return;

    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/exams/${deletingExamId}`);
      toast.success(text("delete_success"));
      setExams((prev) => prev.filter((exam) => exam._id !== deletingExamId));
    } catch (err) {
      const typedError = err as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        text("delete_error");
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeletingExamId(null);
    }
  };

  const handleExamUpdated = (examData?: IExam, isEdit?: boolean) => {
    if (examData) {
      if (isEdit) {
        setExams((prev) =>
          prev.map((exam) => (exam._id === examData._id ? examData : exam))
        );
        toast.success(text("update_success"));
      } else {
        setExams((prev) => [...prev, examData]);
        toast.success(text("create_success"));
      }
    }
    setExamDialogOpen(false);
  };

  const handleEditExamUpdated = (examData?: IExam) => {
    if (examData) {
      setExams((prev) =>
        prev.map((exam) => (exam._id === examData._id ? examData : exam))
      );
      toast.success(text("update_success"));
    }
    setEditDialogOpen(false);
    setEditingExam(null);
  };

  const locale = useLocale();

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {backUrl && (
            <Link href={backUrl}>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <ArrowLeft
                  className={cn("w-4 h-4", locale === "ar" && "rotate-180")}
                />
              </Button>
            </Link>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {title || text("title", { type: type })}
            </h1>
            <p className="text-muted-foreground mt-1">
              {description || text("description", { type: type })}
            </p>
          </div>
          <Button onClick={handleAddExam} disabled={exams.length >= 2}>
            <Plus className="w-4 h-4 mr-2" />
            {text("add_exam")}
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={onRefresh}>{text("retry")}</Button>
              </CardContent>
            </Card>
          )}

          {!loading && !error && exams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {text("no_exams_title")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {text("no_exams_description", { type: type })}
                </p>
                <Button onClick={handleAddExam}>
                  <Plus className="w-4 h-4 mr-2" />
                  {text("create_exam")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {exams.map((exam) => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  onEdit={() => handleEditExam(exam)}
                  onDelete={() => handleDeleteExam(exam._id)}
                  onViewQuestions={() => onViewQuestions(exam)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Exam Dialog */}
        <ExamDialog
          open={examDialogOpen}
          onOpenChange={setExamDialogOpen}
          exam={null}
          type={type}
          parentId={parentId}
          onExamUpdated={handleExamUpdated}
          isEdit={false}
        />

        {/* Edit Exam Dialog */}
        {editingExam && (
          <EditExamDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            exam={editingExam}
            onExamUpdated={handleEditExamUpdated}
          />
        )}

        {/* Delete Confirmation */}
        <ConfirmationDialog
          open={!!deletingExamId}
          title={text("delete_confirm_title")}
          description={text("delete_confirm_description")}
          isLoading={isDeleting}
          confirmText={text("delete")}
          onCancel={() => setDeletingExamId(null)}
          onConfirm={confirmDeleteExam}
        />
      </div>
    </div>
  );
};

// Exam Card Component
interface ExamCardProps {
  exam: IExam;
  onEdit: () => void;
  onDelete: () => void;
  onViewQuestions: () => void;
}

const ExamCard = ({
  exam,
  onEdit,
  onDelete,
  onViewQuestions,
}: ExamCardProps) => {
  const text = useTranslations("exams");
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {getDynamicString(exam.title)}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {text(`form.model_${exam.model?.toLowerCase()}`)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent withPortal={false} align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  // Close the dropdown first, then navigate
                  onViewQuestions();
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                {text("view_questions")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setTimeout(() => {
                    onEdit();
                  }, 100);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                {text("edit_exam")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {text("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {text("passing_score", { score: exam.passingScore })}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {text("questions_count", { count: exam.questions.length })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Exam Dialog Component
interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam?: IExam | null;
  type: string;
  parentId: string;
  onExamUpdated: (examData?: IExam, isEdit?: boolean) => void;
  isEdit: boolean;
}

const ExamDialog = ({
  open,
  onOpenChange,
  exam,
  type,
  parentId,
  onExamUpdated,
  isEdit,
}: ExamDialogProps) => {
  const text = useTranslations("exams");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    model: exam?.model || "A",
    passingScore: exam?.passingScore?.toString() || "70",
    title: exam?.title ? getStringObject(exam.title) : { en: "", ar: "" },
  });

  // Reset form when dialog opens or exam changes
  useEffect(() => {
    if (open) {
      if (isEdit && exam) {
        setFormData({
          model: exam.model || "A",
          passingScore: exam.passingScore?.toString() || "70",
          title: exam.title ? getStringObject(exam.title) : { en: "", ar: "" },
        });
      } else {
        setFormData({
          model: "A",
          passingScore: "70",
          title: { en: "", ar: "" },
        });
      }
    }
  }, [open, exam, isEdit]);

  const handleSubmit = async () => {
    if (!formData.model || !formData.passingScore) {
      toast.error(text("validation.fill_required_fields"));
      return;
    }

    // Validate title is required (both en and ar)
    if (!formData.title.en || !formData.title.en.trim()) {
      toast.error(
        text("validation.question_text_required") ||
          "Title (English) is required"
      );
      return;
    }
    if (!formData.title.ar || !formData.title.ar.trim()) {
      toast.error(
        text("validation.question_text_required") ||
          "Title (Arabic) is required"
      );
      return;
    }

    setLoading(true);
    try {
      const requestBody: {
        model: string;
        passingScore: string;
        title: { en: string; ar: string };
        type: string;
        [key: string]: string | { en: string; ar: string };
      } = {
        model: formData.model,
        passingScore: formData.passingScore,
        title: {
          en: formData.title.en,
          ar: formData.title.ar,
        },
        type: type,
      };

      // Add the parent ID with the appropriate key
      const parentKey = type === "placement" ? "course" : type;
      requestBody[parentKey] = parentId;

      let response;
      if (isEdit && exam) {
        response = await axiosInstance.put(`/exams/${exam._id}`, requestBody);
      } else {
        response = await axiosInstance.post("/exams", requestBody);
      }

      // API returns { data: { exam: {...} } } for create/update
      const returnedExam = response?.data?.data?.exam ?? response?.data?.data;
      onExamUpdated(returnedExam, isEdit);
    } catch (err) {
      const typedError = err as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        text("save_error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? text("edit_exam_title") : text("create_exam_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {text("form.title")} (English){" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={text("form.title_placeholder")}
              value={formData.title.en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: { ...prev.title, en: e.target.value },
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {text("form.title")} (Arabic){" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={text("form.title_placeholder")}
              value={formData.title.ar}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: { ...prev.title, ar: e.target.value },
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{text("form.model")}</label>
            <Select
              value={formData.model}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, model: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">{text("form.model_a")}</SelectItem>
                <SelectItem value="B">{text("form.model_b")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {text("form.passing_score")}
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              placeholder="70"
              value={formData.passingScore}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  passingScore: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {text("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? text("update") : text("create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Exam Dialog Component (only title and passing score)
interface EditExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: IExam;
  onExamUpdated: (examData?: IExam) => void;
}

const EditExamDialog = ({
  open,
  onOpenChange,
  exam,
  onExamUpdated,
}: EditExamDialogProps) => {
  const text = useTranslations("exams");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    passingScore: exam?.passingScore?.toString() || "70",
    title: exam?.title ? getStringObject(exam.title) : { en: "", ar: "" },
  });

  // Reset form when exam changes
  useEffect(() => {
    if (exam) {
      setFormData({
        passingScore: exam.passingScore?.toString() || "70",
        title: exam.title ? getStringObject(exam.title) : { en: "", ar: "" },
      });
    }
  }, [exam]);

  const handleSubmit = async () => {
    if (!formData.passingScore) {
      toast.error(text("validation.fill_required_fields"));
      return;
    }

    // Validate title is required (both en and ar)
    if (!formData.title.en || !formData.title.en.trim()) {
      toast.error(
        text("validation.question_text_required") ||
          "Title (English) is required"
      );
      return;
    }
    if (!formData.title.ar || !formData.title.ar.trim()) {
      toast.error(
        text("validation.question_text_required") ||
          "Title (Arabic) is required"
      );
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("passingScore", formData.passingScore);
      formDataToSend.append("title.en", formData.title.en);
      formDataToSend.append("title.ar", formData.title.ar);

      const response = await axiosInstance.put(
        `/exams/${exam._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // API returns { data: { exam: {...} } } for update
      const returnedExam = response?.data?.data?.exam ?? response?.data?.data;
      onExamUpdated(returnedExam);
    } catch (err) {
      const typedError = err as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        text("save_error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{text("edit_exam_title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {text("form.title")} (English){" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={text("form.title_placeholder")}
              value={formData.title.en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: { ...prev.title, en: e.target.value },
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {text("form.title")} (Arabic){" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={text("form.title_placeholder")}
              value={formData.title.ar}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: { ...prev.title, ar: e.target.value },
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {text("form.passing_score")}
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              placeholder="70"
              value={formData.passingScore}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  passingScore: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {text("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {text("update")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamsDisplay;
