"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Share2, Award, Calendar, GraduationCap, CheckCircle2, Copy, Facebook, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { Link } from "@/i18n/navigation";

interface CertificateData {
  status: string;
  courseDetails: {
    title: string;
    image: string;
    _id: string;
  };
  certificate: {
    file: string;
    _id: string;
  };
  user: {
    name: string;
    email: string;
    profileImg: string;
  };
  attemptDate: string;
  score: number;
  modelExam: string;
}

export default function CertificateView({ data }: { data: CertificateData }) {
  const t = useTranslations();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = data.certificate.file;
    link.download = `certificate-${data.courseDetails.title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t("blogShareButtons.copyLinkAlert") || "Link copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-accent/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 text-primary">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            {t("certificate.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("certificate.awarded_to")} <span className="text-primary font-semibold">{data.user.name}</span> {t("certificate.for_completing")} <Link href={`/courses/${data.courseDetails._id}`} className="text-foreground font-semibold hover:underline">"{data.courseDetails.title}"</Link>.
          </p>
        </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
          <div className="relative aspect-16/11 w-full overflow-hidden rounded-lg">
                  <Image
                    src={data.certificate.file}
                    alt="Certificate"
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                  />
                
                </div>
            {/* Sharing Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-4">
              <Button onClick={handleDownload} size="lg" className="rounded-full px-8 shadow-md hover:shadow-lg transition-all">
                <Download className="mr-2 h-5 w-5" /> {t("certificate.download")}
              </Button>
              <Button onClick={handleCopyLink} variant="outline" size="lg" className="rounded-full shadow-sm hover:bg-accent transition-all">
                <Share2 className="mr-2 h-5 w-5" /> {t("certificate.copy_link")}
              </Button>
            </div>
          </motion.div>

      </div>
    </div>
  );
}
