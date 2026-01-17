"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed AlertDialog imports; using Dialog instead
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { IExam, IQuestion } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { Plus, FileText, Loader2, ArrowLeft, Trash2, Edit } from "lucide-react";
import { cn, getDynamicString } from "@/lib/utils";
import { AxiosError } from "axios";
import FileInput from "@/components/ui/file-input";

interface ExamQuestionDisplayProps {
  exam: IExam;
  onBack: () => void;
  onExamUpdate?: (updatedExam: IExam) => void;
}

interface Question {
  question: string;
  questionImage: File | null;
  grade: number;
  optionsType: "text" | "image";
  options: (string | File)[];
  correctAnswer: number;
}

export const ExamQuestionDisplay = ({
  exam,
  onBack,
  onExamUpdate,
}: ExamQuestionDisplayProps) => {
  const text = useTranslations("exams");
  const commonT = useTranslations("common");
  const ui = useTranslations("exams.ui");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [questionMode, setQuestionMode] = useState<"single" | "multiple">(
    "single"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Single question form data
  const [formData, setFormData] = useState({
    question: "",
    questionImage: null as File | null,
    grade: 1,
    optionsType: "text" as "text" | "image",
    options: [""] as (string | File)[],
    correctAnswer: 1,
  });

  // Multiple questions form data
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      questionImage: null,
      grade: 1,
      optionsType: "text",
      options: [""],
      correctAnswer: 1,
    },
  ]);

  const validateQuestion = (
    questionData: Question | typeof formData,
    questionIndex?: number
  ): boolean => {
    if (!questionData.question.trim()) {
      toast.error(text("validation.question_text_required"));
      // Focus on the question with error in multiple mode
      if (questionIndex !== undefined) {
        setCurrentQuestionIndex(questionIndex);
      }
      return false;
    }
    if (questionData.options.length < 2) {
      toast.error(text("validation.min_options_required"));
      // Focus on the question with error in multiple mode
      if (questionIndex !== undefined) {
        setCurrentQuestionIndex(questionIndex);
      }
      return false;
    }
    // Ensure all options have a value (non-empty string or selected file)
    const hasInvalidOption = questionData.options.some((opt) => {
      if (typeof opt === "string") return opt.trim().length === 0;
      return !opt; // File null/undefined
    });
    if (hasInvalidOption) {
      toast.error(text("validation.fill_required_fields"));
      if (questionIndex !== undefined) {
        setCurrentQuestionIndex(questionIndex);
      }
      return false;
    }
    if (questionData.correctAnswer > questionData.options.length) {
      toast.error(text("validation.correct_answer_invalid"));
      // Focus on the question with error in multiple mode
      if (questionIndex !== undefined) {
        setCurrentQuestionIndex(questionIndex);
      }
      return false;
    }
    // Ensure selected correct answer points to a valid (non-empty) option
    const selectedIdx = questionData.correctAnswer - 1;
    if (selectedIdx < 0 || selectedIdx >= questionData.options.length) {
      toast.error(text("validation.correct_answer_invalid"));
      if (questionIndex !== undefined) {
        setCurrentQuestionIndex(questionIndex);
      }
      return false;
    }
    const selectedOption = questionData.options[selectedIdx];
    if (
      (typeof selectedOption === "string" &&
        selectedOption.trim().length === 0) ||
      (!selectedOption as unknown as boolean)
    ) {
      toast.error(text("validation.fill_required_fields"));
      if (questionIndex !== undefined) {
        setCurrentQuestionIndex(questionIndex);
      }
      return false;
    }
    return true;
  };

  const handleAddQuestion = async () => {
    if (!validateQuestion(formData)) return;

    setIsLoading(true);
    const data = new FormData();
    data.append("question", formData.question);
    data.append("grade", formData.grade.toString());
    data.append("correctOption", formData.correctAnswer.toString());

    if (formData.questionImage) {
      data.append("questionImage", formData.questionImage);
    }

    if (formData.optionsType !== "image") {
      formData.options.forEach((option: string | File) => {
        data.append("options", option);
      });
    }

    try {
      const url =
        isEditingQuestion && editingQuestionId
          ? `/exams/${exam._id}/questions/${editingQuestionId}`
          : `/exams/${exam._id}/questions`;
      const response = await axiosInstance.put(url, data);
      toast.success(
        isEditingQuestion
          ? text("messages.question_updated_success")
          : text("messages.question_added_success")
      );
      setIsAddingQuestion(false);
      // Reset form
      setFormData({
        question: "",
        questionImage: null,
        grade: 1,
        optionsType: "text",
        options: [""],
        correctAnswer: 1,
      });
      setIsEditingQuestion(false);
      setEditingQuestionId(null);
      // Update exam state with the response data
      if (response.data?.data?.exam && onExamUpdate) {
        onExamUpdate(response.data.data.exam);
      }
    } catch (err) {
      console.error(err);
      const typedError = err as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        text("messages.failed_to_add_question");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = (q: IQuestion) => {
    // Prefill from existing question
    setIsEditingQuestion(true);
    setEditingQuestionId(q._id || null);
    setFormData({
      question: getDynamicString(q.question) || "",
      questionImage: null,
      grade: q.grade || 1,
      optionsType: q.options?.some((o: string) => o?.startsWith("http"))
        ? "image"
        : "text",
      options:
        Array.isArray(q.options) && q.options.length > 0 ? q.options : [""],
      correctAnswer: q.correctOption || 1,
    });
    setQuestionMode("single");
    setIsAddingQuestion(true);
  };

  const submitMultipleQuestions = async () => {
    // Pre-validate all questions before any network calls
    for (let i = 0; i < questions.length; i++) {
      const isValid = validateQuestion(questions[i], i);
      if (!isValid) return;
    }

    setIsLoading(true);
    let successCount = 0;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      const data = new FormData();
      data.append("question", question.question);
      data.append("grade", question.grade.toString());
      data.append("correctOption", question.correctAnswer.toString());

      if (question.questionImage) {
        data.append("questionImage", question.questionImage);
      }

      question.options.forEach((option) => {
        data.append("options", option);
      });

      try {
        const response = await axiosInstance.put(
          `/exams/${exam._id}/questions`,
          data
        );
        successCount++;
        // Update exam state with the latest response data
        if (response.data?.data?.exam && onExamUpdate) {
          onExamUpdate(response.data.data.exam);
        }
      } catch (err) {
        console.error(err);
        const typedError = err as AxiosError<{ message: string }>;
        const errorMessage =
          typedError?.response?.data?.message ||
          typedError?.message ||
          text("messages.failed_to_submit_question", {
            number: successCount + 1,
          });
        // Inform about the number of successfully added questions so far
        if (successCount > 0) {
          toast.success(
            text("messages.successfully_added_questions", {
              count: successCount,
            })
          );
        }
        toast.error(errorMessage);
        // Remove successfully submitted questions from the local form list
        setQuestions((prev) => prev.slice(successCount));
        setCurrentQuestionIndex(0);
        setIsLoading(false);
        return;
      }
    }

    toast.success(
      text("messages.successfully_added_questions", { count: successCount })
    );
    setIsLoading(false);
    setIsAddingQuestion(false);
    // Reset questions
    setQuestions([
      {
        question: "",
        questionImage: null,
        grade: 1,
        optionsType: "text",
        options: [""],
        correctAnswer: 1,
      },
    ]);
    setCurrentQuestionIndex(0);
  };

  const addOption = () => {
    if (questionMode === "single") {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    } else {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].options.push("");
      setQuestions(newQuestions);
    }
  };

  const removeOption = (index: number) => {
    if (questionMode === "single") {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer:
          prev.correctAnswer > prev.options.length - 1
            ? prev.options.length - 1
            : prev.correctAnswer,
      }));
    } else {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].options.splice(index, 1);
      if (
        newQuestions[currentQuestionIndex].correctAnswer >
        newQuestions[currentQuestionIndex].options.length
      ) {
        newQuestions[currentQuestionIndex].correctAnswer =
          newQuestions[currentQuestionIndex].options.length;
      }
      setQuestions(newQuestions);
    }
  };

  const updateOption = (index: number, value: string | File) => {
    if (questionMode === "single") {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.map((opt, i) => (i === index ? value : opt)),
      }));
    } else {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].options[index] = value;
      setQuestions(newQuestions);
    }
  };

  const addNewQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        questionImage: null,
        grade: 1,
        optionsType: "text",
        options: [""],
        correctAnswer: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    if (currentQuestionIndex >= index && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const locale = useLocale();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            onClick={onBack}
          >
            <ArrowLeft
              className={cn("w-4 h-4", locale === "ar" && "rotate-180")}
            />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {text("questions_for_exam", {
                title:
                  getDynamicString(exam.title) ||
                  text("exam_title", {
                    model: text(`form.model_${exam.model?.toLowerCase()}`),
                  }) ||
                  "",
              })}
            </h1>
            <p className="text-muted-foreground mt-1">
              {text("manage_exam_questions", {
                model: text(`form.model_${exam.model?.toLowerCase()}`),
              })}
            </p>
          </div>
          <Button
            onClick={() => setIsAddingQuestion(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {text("add_question")}
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            {exam.questions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {text("no_questions_available")}
                </p>
              </div>
            ) : (
              exam.questions.map((question, index) => (
                <Card key={question._id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">
                        {text("question_number", { number: index + 1 })}
                      </h4>
                      <Badge variant="outline">
                        {text("points", { points: question.grade || 1 })}
                      </Badge>
                    </div>

                    <p className="text-sm">
                      {getDynamicString(question.question)}
                    </p>

                    {question.questionImage && (
                      <img
                        src={question.questionImage}
                        alt="Question"
                        className="max-w-[200px] rounded-md"
                      />
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">{text("options")}:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex items-center gap-2 p-2 rounded ${
                              optionIndex + 1 === question.correctOption
                                ? "bg-fadedGreen border border-green/20"
                                : "bg-muted"
                            }`}
                          >
                            <span className="font-medium">
                              {optionIndex + 1}.
                            </span>
                            {option.includes("http") ? (
                              <img
                                src={option}
                                alt={`Option ${optionIndex + 1}`}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <span className="text-sm">{option}</span>
                            )}
                            {optionIndex + 1 === question.correctOption && (
                              <Badge variant="default" className="ml-auto">
                                {text("correct")}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Edit className="w-4 h-4" /> {text("edit")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Add/Edit Question Dialog */}
          <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
            <DialogContent
              isOpen={isAddingQuestion}
              className="sm:max-w-7xl max-h-[90vh] overflow-y-auto"
            >
              <DialogHeader>
                <DialogTitle>
                  {isEditingQuestion
                    ? text("edit_question_title")
                    : questionMode === "single"
                    ? text("add_question_title")
                    : text("multiple_questions.title")}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {commonT("dialog.exam_question_description")}
                </DialogDescription>
              </DialogHeader>

              {/* Question Mode Tabs (hidden while editing a question) */}
              {!isEditingQuestion && (
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={questionMode === "single" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuestionMode("single")}
                  >
                    {text("multiple_questions.single_question")}
                  </Button>
                  <Button
                    variant={
                      questionMode === "multiple" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setQuestionMode("multiple")}
                  >
                    {text("multiple_questions.multiple_questions")}
                  </Button>
                </div>
              )}

              {questionMode === "single" ? (
                // Single Question Form
                <form className="space-y-5">
                  <div className="space-y-3">
                    <Label>{text("form.question")}</Label>
                    <Input
                      placeholder={text("form.question_placeholder")}
                      disabled={isLoading}
                      required
                      value={formData.question}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          question: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>{text("form.question_image_optional")}</Label>
                    <FileInput
                      accept=".png,.jpe,.jpeg"
                      disabled={isLoading}
                      onFilesSelected={(files) =>
                        setFormData((prev) => ({
                          ...prev,
                          questionImage: files?.[0] || null,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>{text("form.grade")}</Label>
                    <Input
                      required
                      type="number"
                      placeholder="1"
                      disabled={isLoading}
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          grade: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>{text("form.options_type")}</Label>
                    <Select
                      disabled={isLoading}
                      value={formData.optionsType}
                      onValueChange={(value: "text" | "image") => {
                        setFormData((prev) => ({
                          ...prev,
                          optionsType: value,
                          options: [""],
                        }));
                      }}
                    >
                      <SelectTrigger className="w-full">
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

                  {formData.options.map((option, index) => (
                    <div key={index} className="space-y-3">
                      <Label className="text-text-2 font-medium">
                        {ui("answer_number", { number: index + 1 })}
                      </Label>
                      <div className="relative">
                        <div className="flex items-center gap-3 p-3  border border-border rounded-lg">
                          <input
                            type="radio"
                            name="single-correct-answer"
                            className="w-4 h-4 text-primary bg-muted border-border focus:ring-primary"
                            checked={formData.correctAnswer === index + 1}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                correctAnswer: index + 1,
                              }))
                            }
                          />
                          {formData.optionsType === "text" ? (
                            <input
                              type="text"
                              disabled={isLoading}
                              required
                              value={option as string}
                              placeholder={ui("write_question_placeholder")}
                              onChange={(e) =>
                                updateOption(index, e.target.value)
                              }
                              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground border-none outline-none"
                            />
                          ) : (
                            <div className="space-y-2 flex-1">
                              <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/50">
                                {typeof option === "string" &&
                                option.includes("http") ? (
                                  <img
                                    src={option}
                                    alt={`Option ${index + 1}`}
                                    className="object-cover w-full h-full rounded-lg"
                                  />
                                ) : (
                                  <div className="text-center text-muted-foreground text-xs">
                                    <div>{ui("click_or_drop_image")}</div>
                                    <div>{ui("drop_image_here")}</div>
                                    <div>{ui("here")}</div>
                                  </div>
                                )}
                              </div>
                              <FileInput
                                accept=".png,.jpe,.jpeg"
                                disabled={isLoading}
                                onFilesSelected={(files) => {
                                  if (files && files[0]) {
                                    updateOption(index, files[0]);
                                  }
                                }}
                              />
                            </div>
                          )}
                          {formData.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    className="flex items-center justify-center w-8 h-8 p-0 ml-auto"
                    onClick={addOption}
                  >
                    <Plus />
                  </Button>

                  {/* Correct answer is selected via radios next to each option */}
                </form>
              ) : (
                // Multiple Questions Form
                <>
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={
                          currentQuestionIndex === index ? "default" : "outline"
                        }
                        onClick={() => setCurrentQuestionIndex(index)}
                        className="flex items-center gap-2 min-w-[120px]"
                      >
                        {text("multiple_questions.question_number", {
                          number: index + 1,
                        })}
                        {questions.length > 1 && (
                          <Trash2
                            className="w-4 h-4 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeQuestion(index);
                            }}
                          />
                        )}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addNewQuestion}
                      className="flex items-center gap-2"
                    >
                      <Plus /> {text("multiple_questions.add_question")}
                    </Button>
                  </div>

                  <form className="space-y-5">
                    <div className="space-y-3">
                      <Label>{text("multiple_questions.question")}</Label>
                      <Textarea
                        placeholder={text("form.question_placeholder")}
                        disabled={isLoading}
                        required
                        value={questions[currentQuestionIndex].question}
                        onChange={(e) => {
                          updateQuestion(currentQuestionIndex, {
                            question: e.target.value,
                          });
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>{text("multiple_questions.question_image")}</Label>
                      <FileInput
                        accept=".png,.jpe,.jpeg"
                        disabled={isLoading}
                        onFilesSelected={(files) => {
                          if (files && files[0]) {
                            updateQuestion(currentQuestionIndex, {
                              questionImage: files[0],
                            });
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>{text("multiple_questions.grade")}</Label>
                      <Input
                        required
                        type="number"
                        placeholder="1"
                        disabled={isLoading}
                        value={questions[currentQuestionIndex].grade}
                        onChange={(e) => {
                          updateQuestion(currentQuestionIndex, {
                            grade: parseInt(e.target.value),
                          });
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>{text("multiple_questions.options_type")}</Label>
                      <Select
                        disabled={isLoading}
                        value={questions[currentQuestionIndex].optionsType}
                        onValueChange={(value: "text" | "image") => {
                          updateQuestion(currentQuestionIndex, {
                            optionsType: value,
                            options: [""],
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
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

                    {questions[currentQuestionIndex].options.map(
                      (opt, index) => (
                        <div key={index} className="space-y-3">
                          <Label className="text-text-2 font-medium">
                            {ui("answer_number", { number: index + 1 })}
                          </Label>
                          <div className="relative">
                            <div className="flex items-center gap-3 p-3 bg-muted border border-border rounded-lg">
                              <input
                                type="radio"
                                name={`multi-correct-${currentQuestionIndex}`}
                                className="w-4 h-4 text-primary bg-muted border-border focus:ring-primary"
                                checked={
                                  questions[currentQuestionIndex]
                                    .correctAnswer ===
                                  index + 1
                                }
                                onChange={() =>
                                  updateQuestion(currentQuestionIndex, {
                                    correctAnswer: index + 1,
                                  })
                                }
                              />
                              {questions[currentQuestionIndex].optionsType ===
                              "text" ? (
                                <input
                                  type="text"
                                  disabled={isLoading}
                                  required
                                  value={
                                    questions[currentQuestionIndex].options[
                                      index
                                    ] as string
                                  }
                                  placeholder={ui("write_question_placeholder")}
                                  onChange={(e) => {
                                    const newOptions = [
                                      ...questions[currentQuestionIndex]
                                        .options,
                                    ];
                                    newOptions[index] = e.target.value;
                                    updateQuestion(currentQuestionIndex, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground border-none outline-none"
                                />
                              ) : (
                                <div className="flex-1">
                                  <div className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/50">
                                    {typeof questions[currentQuestionIndex]
                                      .options[index] === "string" &&
                                    questions[currentQuestionIndex].options[
                                      index
                                    ].includes("http") ? (
                                      <img
                                        src={
                                          questions[currentQuestionIndex]
                                            .options[index] as string
                                        }
                                        alt={`Option ${index + 1}`}
                                        className="object-cover w-full h-full rounded-lg"
                                      />
                                    ) : (
                                      <div className="text-center text-muted-foreground text-xs">
                                        <div>{ui("click_or_drop_image")}</div>
                                        <div>{ui("drop_image_here")}</div>
                                        <div>{ui("here")}</div>
                                      </div>
                                    )}
                                  </div>
                                  <FileInput
                                    accept=".png,.jpe,.jpeg"
                                    disabled={isLoading}
                                    onFilesSelected={(files) => {
                                      if (files && files[0]) {
                                        const newOptions = [
                                          ...questions[currentQuestionIndex]
                                            .options,
                                        ];
                                        newOptions[index] = files[0];
                                        updateQuestion(currentQuestionIndex, {
                                          options: newOptions,
                                        });
                                      }
                                    }}
                                  />
                                </div>
                              )}
                              {questions[currentQuestionIndex].options.length >
                                1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newOptions = [
                                      ...questions[currentQuestionIndex]
                                        .options,
                                    ];
                                    newOptions.splice(index, 1);
                                    updateQuestion(currentQuestionIndex, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    <Button
                      type="button"
                      className="flex items-center justify-center w-8 h-8 p-0 ml-auto"
                      onClick={() => {
                        const newOptions = [
                          ...questions[currentQuestionIndex].options,
                          "",
                        ];
                        updateQuestion(currentQuestionIndex, {
                          options: newOptions,
                        });
                      }}
                    >
                      <Plus />
                    </Button>

                    {/* Correct answer is selected via radios next to each option */}
                  </form>
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => {
                    setIsAddingQuestion(false);
                    setIsEditingQuestion(false);
                    setEditingQuestionId(null);
                    // Reset forms
                    setFormData({
                      question: "",
                      questionImage: null,
                      grade: 1,
                      optionsType: "text",
                      options: [""],
                      correctAnswer: 1,
                    });
                    setQuestions([
                      {
                        question: "",
                        questionImage: null,
                        grade: 1,
                        optionsType: "text",
                        options: [""],
                        correctAnswer: 1,
                      },
                    ]);
                    setCurrentQuestionIndex(0);
                    setQuestionMode("single");
                  }}
                >
                  {text("cancel")}
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={
                    questionMode === "single"
                      ? handleAddQuestion
                      : submitMultipleQuestions
                  }
                >
                  {isLoading && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {questionMode === "single"
                    ? isEditingQuestion
                      ? text("update")
                      : text("add_question")
                    : text("multiple_questions.submit_all_questions")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ExamQuestionDisplay;
