"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/app/lib/utils";
import { IPackage, ILive } from "@/types";
import { toast } from "react-toastify";
import { AiFillDelete } from "react-icons/ai";
import { AxiosError } from "axios";
import { useAuth } from "@/components/auth-provider";
import { getDynamicString, getStringObject } from "@/lib/utils";

interface AddLiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLiveAdded: () => void;
  editLive?: ILive | null;
  onLiveEdited?: () => void;
}

interface LiveFormData {
  title: {
    en: string;
    ar: string;
  };
  link: string;
  date: string;
  packages: IPackage[];
}

const AddLiveDialog = ({
  open,
  onOpenChange,
  onLiveAdded,
  editLive,
  onLiveEdited,
}: AddLiveDialogProps) => {
  const instructorText = useTranslations("instructorLives");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [fetchedLive, setFetchedLive] = useState<ILive | null>(null);
  const [fetchingLive, setFetchingLive] = useState(false);
  const [formData, setFormData] = useState<LiveFormData>({
    title: {
      en: "",
      ar: "",
    },
    link: "",
    date: "",
    packages: [],
  });

  // Fetch single live data
  const fetchLive = async (liveId: string) => {
    if (!liveId) return;

    setFetchingLive(true);
    try {
      const response = await axiosInstance.get(`/lives/${liveId}`);
      const liveData = response?.data?.data;

      if (liveData) {
        setFetchedLive(liveData);
      }
    } catch (error) {
      console.error("Error fetching live:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      console.error("Fetch error:", errorMessage);
      toast.error("Failed to load live data");
    } finally {
      setFetchingLive(false);
    }
  };

  // Fetch packages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const packagesRes = await axiosInstance.get("/packages/getAll");
        setPackages(packagesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages");
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Fetch live data when dialog opens in edit mode
  useEffect(() => {
    if (editLive?._id && open) {
      fetchLive(editLive._id);
    } else {
      // Reset fetched live when not in edit mode
      setFetchedLive(null);
    }
  }, [editLive?._id, open]);

  // Populate form data when editing
  useEffect(() => {
    if (editLive && fetchedLive && open) {
      // For now, use the title field directly since ILive doesn't have translationTitle
      // In the future, if the API returns localized data, this can be updated
      const title = getStringObject(fetchedLive.title);
      setFormData({
        title: {
          en: title.en || "",
          ar: title.ar || "",
        },
        link: fetchedLive.link || "",
        date: new Date(fetchedLive.date).toISOString().slice(0, 16),
        packages: fetchedLive.package || [],
      });
    } else if (!editLive && open) {
      // Reset form for new live
      setFormData({
        title: {
          en: "",
          ar: "",
        },
        link: "",
        date: "",
        packages: [],
      });
    }
  }, [editLive, fetchedLive, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.en ||
      !formData.title.ar ||
      !formData.date ||
      !user?._id
    ) {
      toast.error(instructorText("pleaseFillRequiredFields"));
      return;
    }

    try {
      setLoading(true);

      const liveData = {
        title: formData.title,
        link: formData.link,
        date: new Date(formData.date).toISOString(),
        instructor: user._id,
        package: formData.packages.map((pkg) => pkg._id),
      };

      if (editLive) {
        // Update existing live
        await axiosInstance.put(`/lives/${editLive._id}`, liveData);
        toast.success(
          instructorText("liveSessionUpdatedSuccessfully") ||
            "Live session updated successfully"
        );
        onLiveEdited?.();
      } else {
        // Create new live
        await axiosInstance.post("/lives", liveData);
        toast.success(instructorText("liveSessionCreatedSuccessfully"));
        onLiveAdded();
      }

      // Reset form
      setFormData({
        title: {
          en: "",
          ar: "",
        },
        link: "",
        date: "",
        packages: [],
      });
    } catch (error) {
      console.error("Error saving live:", error);
      toast.error(
        editLive
          ? instructorText("failedToUpdateLiveSession") ||
              "Failed to update live session"
          : instructorText("failedToCreateLiveSession")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageId: string) => {
    const selectedPackage = packages.find((pkg) => pkg._id === packageId);
    if (selectedPackage) {
      setFormData((prev) => ({
        ...prev,
        packages: prev.packages.find((pkg) => pkg._id === packageId)
          ? prev.packages.filter((pkg) => pkg._id !== packageId)
          : [...prev.packages, selectedPackage],
      }));
    }
  };

  const handlePackageRemove = (packageId: string) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((pkg) => pkg._id !== packageId),
    }));
  };

  // Skeleton component for loading state
  const FormSkeleton = () => (
    <div className="space-y-4">
      {/* Title fields skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Link field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Date field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Packages field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex justify-end space-x-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editLive
              ? instructorText("editLiveSession") || "Edit Live Session"
              : instructorText("addNewLiveSession")}
          </DialogTitle>
          <DialogDescription>
            {editLive
              ? instructorText("updateLiveSessionDescription")
              : instructorText("createNewLiveSession")}
          </DialogDescription>
        </DialogHeader>

        {editLive && fetchingLive ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title_en">
                {instructorText("title")} ({instructorText("english")}) *
              </Label>
              <Input
                id="title_en"
                value={formData.title.en}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...prev.title, en: e.target.value },
                  }))
                }
                placeholder={instructorText("enterTitleEn")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title_ar">
                {instructorText("title")} ({instructorText("arabic")}) *
              </Label>
              <Input
                id="title_ar"
                value={formData.title.ar}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: { ...prev.title, ar: e.target.value },
                  }))
                }
                placeholder={instructorText("enterTitleAr")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">{instructorText("meetingLink")}</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder={instructorText("enterMeetingLink")}
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{instructorText("dateTime")} *</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                type="datetime-local"
                required
              />
            </div>

            {/* Package Selection */}
            <div className="space-y-2">
              <Label>{instructorText("associatedCourses")}</Label>
              <Select value="" onValueChange={handlePackageSelect}>
                <SelectTrigger>
                  <SelectValue placeholder={instructorText("selectPackages")} />
                </SelectTrigger>
                <SelectContent>
                  {packages
                    .filter(
                      (pkg) =>
                        !formData.packages.find(
                          (selected) => selected._id === pkg._id
                        )
                    )
                    .map((packageItem) => (
                      <SelectItem key={packageItem._id} value={packageItem._id}>
                        {getDynamicString(packageItem.course?.title) ||
                          getDynamicString(packageItem.title) ||
                          ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {/* Selected Packages Display */}
            {formData.packages.length > 0 && (
              <div className="space-y-2">
                <Label>{instructorText("selectedPackages")}:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.packages.map((packageItem) => (
                    <div
                      key={packageItem._id}
                      className="flex items-center gap-2 p-2 border rounded-md bg-gray-50"
                    >
                      <span className="text-sm">
                        {getDynamicString(packageItem.course?.title) ||
                          getDynamicString(packageItem.title) ||
                          ""}
                      </span>
                      <button
                        onClick={() => handlePackageRemove(packageItem._id)}
                        type="button"
                        className="text-destructive"
                      >
                        <AiFillDelete className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? editLive
                    ? instructorText("updating") || "Updating..."
                    : instructorText("creating")
                  : editLive
                  ? instructorText("updateLiveSession") || "Update Live Session"
                  : instructorText("createLiveSession")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddLiveDialog;
