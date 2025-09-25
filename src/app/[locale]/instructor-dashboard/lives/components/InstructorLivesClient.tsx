"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { ILive } from "@/types";
import InstructorLiveFilters from "./InstructorLiveFilters";
import InstructorLivesCalendar from "./InstructorLivesCalendar";
import AddLiveDialog from "./AddLiveDialog";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { useLivesManagement } from "../hooks/useLivesManagement";
import LiveCard from "./LiveCard";

// LiveCard Skeleton Component
const LiveCardSkeleton = () => (
  <div className="flex flex-col justify-between w-full gap-4 p-4 border rounded-md">
    <div>
      {/* Course badges skeleton */}
      <div className="flex flex-wrap items-center justify-start gap-2">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-5 w-3/4 mt-4 mb-3" />

      {/* Date and time skeletons */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>

    {/* Action buttons skeleton */}
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-20" />
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <main className="flex bg-background flex-col-reverse w-full gap-8 p-8 lg:flex-row lg:gap-10 lg:p-10">
    <div className="flex-1 w-full">
      <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <LiveCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
    <div className="xl:w-[25rem] lg:w-[20rem] space-y-6">
      {/* Filters skeleton */}
      <div className="bg-card cardShadow rounded-xl p-4 space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      {/* Calendar skeleton */}
      <div className="bg-card cardShadow rounded-xl p-4">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>
    </div>
  </main>
);

const InstructorLivesClient = () => {
  const instructorText = useTranslations("instructorLives");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editLive, setEditLive] = useState<ILive | null>(null);
  const [deleteLive, setDeleteLive] = useState<ILive | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the custom hook for lives management
  const {
    lives,
    filteredLives,
    loading,
    fetchLives,
    deleteLiveFromState,
    deleteLive: deleteLiveAPI,
  } = useLivesManagement({ selectedDate, selectedCourse });

  const handleLiveAdded = () => {
    setShowAddDialog(false);
    setEditLive(null);
    fetchLives(); // Refetch data after create
  };

  const handleLiveEdited = () => {
    setShowAddDialog(false);
    setEditLive(null);
    fetchLives(); // Refetch data after edit
  };

  const handleDeleteLive = (liveId: string) => {
    const liveToDelete = lives.find((live) => live._id === liveId);
    if (liveToDelete) {
      setDeleteLive(liveToDelete);
      setShowDeleteDialog(true);
    }
  };

  const handleEditLive = (liveId: string) => {
    const liveToEdit = lives.find((live) => live._id === liveId);
    if (liveToEdit) {
      setEditLive(liveToEdit);
      setShowAddDialog(true);
    }
  };

  const confirmDeleteLive = async () => {
    if (!deleteLive) return;

    try {
      setIsDeleting(true);
      await deleteLiveAPI(deleteLive._id);

      // Remove from state (immediate UI update)
      deleteLiveFromState(deleteLive._id);

      // Show success message
      const toast = await import("react-toastify");
      toast.toast.success(
        instructorText("liveSessionDeletedSuccessfully") ||
          "Live session deleted successfully"
      );

      // Close dialog
      setShowDeleteDialog(false);
      setDeleteLive(null);
    } catch (error) {
      console.error("Error deleting live:", error);
      const toast = await import("react-toastify");
      toast.toast.error(
        instructorText("failedToDeleteLiveSession") ||
          "Failed to delete live session"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteLive = () => {
    setShowDeleteDialog(false);
    setDeleteLive(null);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <main className="flex bg-background flex-col-reverse w-full gap-8 p-8 xl:flex-row lg:gap-10 lg:p-10">
        <div className="flex-1 w-full">
          {selectedDate ? (
            <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
              <h2 className="mb-4 font-medium md:mb-6">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              {filteredLives.length !== 0 ? (
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                  }}
                >
                  {filteredLives.map((live) => (
                    <LiveCard
                      key={live._id}
                      live={live}
                      onDelete={handleDeleteLive}
                      onEdit={handleEditLive}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-center text-text-3">
                    {instructorText("noLivesThisDay")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-4 mb-4 cardShadow rounded-xl h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium md:mb-6">
                  {instructorText("allLives")}
                </h2>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {instructorText("addLive")}
                </Button>
              </div>
              {filteredLives.length !== 0 ? (
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                  }}
                >
                  {filteredLives.map((live) => (
                    <LiveCard
                      key={live._id}
                      live={live}
                      onDelete={handleDeleteLive}
                      onEdit={handleEditLive}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-center text-text-3">
                    {instructorText("noLivesFound")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="xl:w-[25rem] ">
          <InstructorLiveFilters
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
          />
          <InstructorLivesCalendar
            lives={lives}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </main>

      <AddLiveDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onLiveAdded={handleLiveAdded}
        editLive={editLive}
        onLiveEdited={handleLiveEdited}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        title={instructorText("confirmDeleteTitle")}
        description={instructorText("confirmDeleteDescription")}
        isLoading={isDeleting}
        loadingText={instructorText("deleting")}
        confirmText={instructorText("delete")}
        cancelText={instructorText("cancel")}
        onCancel={cancelDeleteLive}
        onConfirm={confirmDeleteLive}
      />
    </>
  );
};

export default InstructorLivesClient;
