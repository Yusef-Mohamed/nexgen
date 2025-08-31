"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { IExam, IQuestion } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { Plus, Edit, Trash2, Loader2, FileText, X } from "lucide-react";

interface QuestionsManagerProps {
  exam: IExam;
  onQuestionsUpdated: () => void;
}

interface QuestionFormData {
  question: string;
  questionImage: File | null;
  grade: number;
  optionsType: "text" | "image";
  options: (string | File)[];
  correctAnswer: number;
}

export const QuestionsManager = ({
  exam,
  onQuestionsUpdated,
}: QuestionsManagerProps) => {
  const text = useTranslations("exams");
  const [questions, setQuestions] = useState<IQuestion[]>(exam.questions);
  const [loading, setLoading] = useState(false);
  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false);
  const [editQuestionDialogOpen, setEditQuestionDialogOpen] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
    null
  );
  const [formData, setFormData] = useState<QuestionFormData>({
    question: "",
    questionImage: null,
    grade: 1,
    optionsType: "text",
    options: ["", ""],
    correctAnswer: 1,
  });

  useEffect(() => {
    setQuestions(exam.questions);
  }, [exam.questions]);

  const resetForm = () => {
    setFormData({
      question: "",
      questionImage: null,
      grade: 1,
      optionsType: "text",
      options: ["", ""],
      correctAnswer: 1,
    });
  };

  const handleAddQuestion = () => {
    resetForm();
    setAddQuestionDialogOpen(true);
  };

  const handleEditQuestion = (question: IQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      questionImage: null,
      grade: question.grade || 1,
      optionsType: question.options.some((opt: string) => opt.includes("http"))
        ? "image"
        : "text",
      options: question.options,
      correctAnswer: question.correctOption,
    });
    setEditQuestionDialogOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setDeletingQuestionId(questionId);
  };

  const confirmDeleteQuestion = async () => {
    if (!deletingQuestionId) return;

    try {
      setIsDeleting(true);
      await axiosInstance.delete(
        `/exams/${exam._id}/questions/${deletingQuestionId}`
      );
      toast.success(text("question_delete_success"));
      onQuestionsUpdated();
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error(text("question_delete_error"));
    } finally {
      setIsDeleting(false);
      setDeletingQuestionId(null);
    }
  };

  const validateQuestion = (data: QuestionFormData): boolean => {
    if (!data.question.trim()) {
      toast.error(text("validation.question_required"));
      return false;
    }
    if (data.options.length < 2) {
      toast.error(text("validation.min_options_required"));
      return false;
    }
    if (data.correctAnswer > data.options.length) {
      toast.error(text("validation.correct_answer_invalid"));
      return false;
    }
    return true;
  };

  const handleSubmitQuestion = async () => {
    if (!validateQuestion(formData)) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("question", formData.question);
      data.append("grade", formData.grade.toString());
      data.append("correctOption", formData.correctAnswer.toString());

      if (formData.questionImage) {
        data.append("questionImage", formData.questionImage);
      }

      if (formData.optionsType === "text") {
        formData.options.forEach((option: string | File) => {
          if (typeof option === "string") {
            data.append("options", option);
          }
        });
      } else {
        formData.options.forEach((option: string | File) => {
          if (option instanceof File) {
            data.append("options", option);
          }
        });
      }

      if (editingQuestion) {
        await axiosInstance.put(
          `/exams/${exam._id}/questions/${editingQuestion._id}`,
          data
        );
        toast.success(text("question_update_success"));
      } else {
        await axiosInstance.post(`/exams/${exam._id}/questions`, data);
        toast.success(text("question_create_success"));
      }

      onQuestionsUpdated();
      setAddQuestionDialogOpen(false);
      setEditQuestionDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving question:", err);
      toast.error(text("question_save_error"));
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      correctAnswer:
        prev.correctAnswer > index
          ? prev.correctAnswer - 1
          : prev.correctAnswer,
    }));
  };

  const updateOption = (index: number, value: string | File) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{text("questions")}</h3>
          <p className="text-sm text-muted-foreground">
            {text("questions_count", { count: questions.length })}
          </p>
        </div>
        <Button onClick={handleAddQuestion} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {text("add_question")}
        </Button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">
              {text("no_questions_yet")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={question._id}
              question={question}
              index={index}
              onEdit={() => handleEditQuestion(question)}
              onDelete={() => handleDeleteQuestion(question._id)}
            />
          ))}
        </div>
      )}

      {/* Add Question Dialog */}
      <Dialog
        open={addQuestionDialogOpen}
        onOpenChange={setAddQuestionDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{text("add_question_title")}</DialogTitle>
          </DialogHeader>

          <QuestionForm
            formData={formData}
            setFormData={setFormData}
            addOption={addOption}
            removeOption={removeOption}
            updateOption={updateOption}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddQuestionDialogOpen(false)}
            >
              {text("cancel")}
            </Button>
            <Button onClick={handleSubmitQuestion} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {text("add_question")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog
        open={editQuestionDialogOpen}
        onOpenChange={setEditQuestionDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{text("edit_question_title")}</DialogTitle>
          </DialogHeader>

          <QuestionForm
            formData={formData}
            setFormData={setFormData}
            addOption={addOption}
            removeOption={removeOption}
            updateOption={updateOption}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditQuestionDialogOpen(false)}
            >
              {text("cancel")}
            </Button>
            <Button onClick={handleSubmitQuestion} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {text("update_question")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingQuestionId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("delete_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("question_delete_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setDeletingQuestionId(null)}
            >
              {text("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={confirmDeleteQuestion}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {text("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Question Card Component
interface QuestionCardProps {
  question: IQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionCard = ({
  question,
  index,
  onEdit,
  onDelete,
}: QuestionCardProps) => {
  const text = useTranslations("exams");

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {text("question_number", { number: index + 1 })}
            </Badge>
            <Badge variant="outline">
              {text("points", { points: question.grade || 1 })}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{question.question}</p>

        {question.questionImage && (
          <img
            src={question.questionImage}
            alt="Question"
            className="max-w-[150px] rounded-md"
          />
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">{text("options")}:</p>
          <div className="grid grid-cols-1 gap-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`flex items-center gap-2 p-2 rounded text-sm ${
                  optionIndex + 1 === question.correctOption
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50"
                }`}
              >
                <span className="font-medium">{optionIndex + 1}.</span>
                {option.includes("http") ? (
                  <img
                    src={option}
                    alt={`Option ${optionIndex + 1}`}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <span>{option}</span>
                )}
                {optionIndex + 1 === question.correctOption && (
                  <Badge variant="default" className="ml-auto text-xs">
                    {text("correct")}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Question Form Component
interface QuestionFormProps {
  formData: QuestionFormData;
  setFormData: (data: QuestionFormData) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
  updateOption: (index: number, value: string | File) => void;
}

const QuestionForm = ({
  formData,
  setFormData,
  addOption,
  removeOption,
  updateOption,
}: QuestionFormProps) => {
  const text = useTranslations("exams");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{text("form.question")}</Label>
        <Textarea
          placeholder={text("form.question_placeholder")}
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>{text("form.question_image_optional")}</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setFormData({ ...formData, questionImage: file || null });
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>{text("form.grade")}</Label>
        <Input
          type="number"
          min="1"
          placeholder="1"
          value={formData.grade}
          onChange={(e) =>
            setFormData({ ...formData, grade: parseInt(e.target.value) || 1 })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>{text("form.options_type")}</Label>
        <Select
          value={formData.optionsType}
          onValueChange={(value: "text" | "image") => {
            setFormData({
              ...formData,
              optionsType: value,
              options: value === "text" ? ["", ""] : [],
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">
              {text("form.options_type_text")}
            </SelectItem>
            <SelectItem value="image">
              {text("form.options_type_image")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{text("form.options")}</Label>
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
            <Plus className="w-4 h-4 mr-1" />
            {text("form.add_option")}
          </Button>
        </div>

        {formData.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              {formData.optionsType === "text" ? (
                <Input
                  placeholder={text("form.option_placeholder", {
                    number: index + 1,
                  })}
                  value={option as string}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) updateOption(index, file);
                  }}
                />
              )}
            </div>
            {formData.options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
                className="text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>{text("form.correct_answer")}</Label>
        <Input
          type="number"
          min="1"
          max={formData.options.length}
          placeholder="1"
          value={formData.correctAnswer}
          onChange={(e) =>
            setFormData({
              ...formData,
              correctAnswer: parseInt(e.target.value) || 1,
            })
          }
        />
        <p className="text-xs text-muted-foreground">
          {text("form.correct_answer_help", { max: formData.options.length })}
        </p>
      </div>
    </div>
  );
};

export default QuestionsManager;
