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
  // Edit,
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
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
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
  // const [editingExam, setEditingExam] = useState<IExam | null>(null);
  // const [isEditExam, setIsEditExam] = useState(false);
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
    // setEditingExam(null);
    // setIsEditExam(false);
    setExamDialogOpen(true);
  };

  // const handleEditExam = (exam: IExam) => {
  //   setEditingExam(exam);
  //   setIsEditExam(true);
  //   setExamDialogOpen(true);
  // };

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
  // onEdit: () => void;
  onDelete: () => void;
  onViewQuestions: () => void;
}

const ExamCard = ({
  exam,
  // onEdit,
  onDelete,
  onViewQuestions,
}: ExamCardProps) => {
  const text = useTranslations("exams");

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {exam.title ||
              text("exam_title", {
                model: text(`form.model_${exam.model.toLowerCase()}`),
              })}
          </CardTitle>
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
              {/* <DropdownMenuItem
                onClick={() => {
                  setTimeout(() => {
                    onEdit();
                  }, 100);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                {text("edit_exam")}
              </DropdownMenuItem> */}
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
          <Badge variant="secondary">
            {text(`form.model_${exam.model.toLowerCase()}`)}
          </Badge>
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
    title: exam?.title || "",
  });

  const handleSubmit = async () => {
    if (!formData.model || !formData.passingScore) {
      toast.error(text("validation.fill_required_fields"));
      return;
    }

    setLoading(true);
    try {
      const data = {
        model: formData.model,
        passingScore: parseInt(formData.passingScore),
        title: formData.title,
        type: type,
        [type === "placement" ? "course" : type]: parentId,
      };

      let response;
      if (isEdit && exam) {
        response = await axiosInstance.put(`/exams/${exam._id}`, data);
      } else {
        response = await axiosInstance.post("/exams", data);
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
              {text("form.title_optional")}
            </label>
            <Input
              placeholder={text("form.title_placeholder")}
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
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

export default ExamsDisplay;
