import { Metadata } from "next";
import { IBlog, ICourse } from "./types";

const getTitle = (title: string, locale: string) => {
  if (locale === "ar") {
    return `${title} - أكاديمية نكستجين`;
  } else {
    return `${title} - Nexgen Academy`;
  }
};

// Landing Page Metadata
export function getMetadataLandingPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: {
      absolute: getTitle(
        params.locale === "ar" ? "الرئيسية" : "Home",
        params.locale
      ),
      default:
        params.locale === "ar"
          ? "الرئيسية - أكاديمية نكستجين"
          : "Home - Nexgen Academy",
    },
    description:
      params.locale === "ar"
        ? "اكتشف دورات أكاديمية نكستجين وشروط القبول."
        : "Discover Nexgen Academy courses and admission requirements.",
  };
}

// About Page Metadata
export function getMetadataAboutPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: getTitle(
      params.locale === "ar" ? "من نحن" : "About Us",
      params.locale
    ),
    description:
      params.locale === "ar"
        ? "تعرف على أكاديمية نكستجين ورسالتها التعليمية."
        : "Learn about Nexgen Academy and its educational mission.",
  };
}

// Contact Page Metadata
export function getMetadataContactPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: getTitle(
      params.locale === "ar" ? "اتصل بنا" : "Contact Us",
      params.locale
    ),
    description:
      params.locale === "ar"
        ? "تواصل مع أكاديمية نكستجين لأي استفسارات أو دعم."
        : "Get in touch with Nexgen Academy for any inquiries or support.",
  };
}

// Courses Page Metadata
export function getMetadataCoursesPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: getTitle(
      params.locale === "ar" ? "الدورات" : "Courses",
      params.locale
    ),
    description:
      params.locale === "ar"
        ? "استعرض دورات أكاديمية نكستجين التعليمية."
        : "Explore Nexgen Academy's educational courses.",
  };
}

// Course Details Page Metadata
export function getMetadataCoursePage({
  params,
  course,
}: {
  params: { locale: string };
  course: {
    title: string;
    description: string;
  };
}): Metadata {
  return {
    title: getTitle(course.title, params.locale),
    description: course.description,
  };
}
export function getMetadataCourseExamPage({
  params,
  course,
}: {
  params: { locale: string };
  course: {
    title: string;
    description: string;
  };
}): Metadata {
  return {
    title: getTitle(
      `${
        params.locale === "ar" ? "اختبار تحديد المستوي" : "Placement exam"
      } - ${course.title}`,
      params.locale
    ),
    description: course.description,
  };
}

// Blog Listing Page Metadata
export function getMetadataBlogsPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: getTitle(
      params.locale === "ar" ? "المدونة" : "Blogs",
      params.locale
    ),
    description:
      params.locale === "ar"
        ? "اقرأ أحدث المقالات والأخبار التعليمية في مدونة أكاديمية نكستجين."
        : "Read the latest articles and educational news in the Nexgen Academy blog.",
  };
}

// Blog Details Page Metadata
export function getMetadataBlogPage({
  params,
  blog,
}: {
  params: { locale: string };
  blog: {
    title: string;
    description: string;
  };
}): Metadata {
  return {
    title: getTitle(blog.title, params.locale),
    description: blog.description,
  };
}

// Dashboard Page Metadata
export function getMetadataDashboardPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: getTitle(
      params.locale === "ar" ? "لوحة القيادة" : "Dashboard",
      params.locale
    ),
    description:
      params.locale === "ar"
        ? "إدارة حسابك ودوراتك في أكاديمية نكستجين."
        : "Manage your account and courses at Nexgen Academy.",
  };
}

// Settings Page Metadata
export function getMetadataSettingsPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: getTitle(
      params.locale === "ar" ? "الإعدادات" : "Settings",
      params.locale
    ),
    description:
      params.locale === "ar"
        ? "تعديل إعدادات حسابك في أكاديمية نكستجين."
        : "Adjust your account settings at Nexgen Academy.",
  };
}
export function getMetadataChatPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: "الدردشة - أكاديمية نيكستجن",
      description:
        "تواصل مع طلاب آخرين من خلال منصة الدردشة الخاصة بأكاديمية نيكستجن.",
    };
  } else {
    return {
      title: "Chat - Nexgen Academy",
      description:
        "Connect with other students through Nexgen Academy's chat platform.",
    };
  }
}
export function getMetadataAnalyticsPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: "تحليلات لوحة التحكم - أكاديمية نيكستجن",
      description: "عرض تحليلات أدائك في أكاديمية نيكستجن.",
    };
  } else {
    return {
      title: "Dashboard Analytics - Nexgen Academy",
      description: "View performance analytics in Nexgen Academy.",
    };
  }
}
export function getMetadataCommunityPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: "مجتمع لوحة التحكم - أكاديمية نيكستجن",
      description: "تواصل مع مجتمع الطلاب في أكاديمية نيكستجن.",
    };
  } else {
    return {
      title: "Dashboard Community - Nexgen Academy",
      description: "Connect with the student community in Nexgen Academy.",
    };
  }
}
export function getMetadataLivesPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: "البث المباشر - أكاديمية نيكستجن",
      description: "تابع البث المباشر للدروس والجلسات في أكاديمية نيكستجن.",
    };
  } else {
    return {
      title: "Live Sessions - Nexgen Academy",
      description: "Join live classes and sessions in Nexgen Academy.",
    };
  }
}
export function getMetadataMarketingPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: "التسويق - أكاديمية نيكستجن",
      description: "إدارة عمليات التسويق في أكاديمية نيكستجن.",
    };
  } else {
    return {
      title: "Marketing - Nexgen Academy",
      description: "Manage marketing operations in Nexgen Academy.",
    };
  }
}
export function getMetadataProfilePage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: "الملف الشخصي - أكاديمية نيكستجن",
      description: "تحديث معلومات الملف الشخصي في أكاديمية نيكستجن.",
    };
  } else {
    return {
      title: "Profile - Nexgen Academy",
      description: "Update your profile information in Nexgen Academy.",
    };
  }
}
export function getMetadataPracticePage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle("التدريب", "ar"),

      description:
        "شارك في تحليل البيانات وإنشاء الرسوم البيانية كجزء من الواجبات الدراسية في أكاديمية نكستجن.",
    };
  } else {
    return {
      title: getTitle("Practice", "en"),
      description:
        "Engage in data analysis and create charts as part of your homework at Nexgen Academy.",
    };
  }
}
export function getMetadataCourseExamResultsPage({
  params,
  course,
}: {
  params: { locale: string };
  course: { title: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle(`نتائج الامتحانات - ${course.title}`, "ar"),
      description: `عرض نتائج الامتحانات لدورة ${course.title} في أكاديمية نكستجن.`,
    };
  } else {
    return {
      title: getTitle(`Exam Results - ${course.title}`, "en"),
      description: `View exam results for the ${course.title} course at Nexgen Academy.`,
    };
  }
}
export function getMetadataSpecificLessonExamPage({
  params,
  lesson,
}: {
  params: { locale: string };
  lesson: { title: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle(`امتحان الدرس - ${lesson.title}`, "ar"),
      description: `تفاصيل امتحان الدرس ${lesson.title} في أكاديمية نكستجن.`,
    };
  } else {
    return {
      title: getTitle(`Lesson Exam - ${lesson.title}`, "en"),
      description: `Details of the ${lesson.title} exam at Nexgen Academy.`,
    };
  }
}
export function getMetadataSignInPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle("تسجيل الدخول", "ar"),
      description:
        "قم بتسجيل الدخول إلى حسابك في أكاديمية نكستجن للوصول إلى المحتوى الشخصي والتحديثات.",
    };
  } else {
    return {
      title: getTitle("Sign In", "en"),
      description:
        "Sign in to your Nexgen Academy account to access your personalized content and updates.",
    };
  }
}
export function getMetadataSignUpPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle("إنشاء حساب", "ar"),
      description:
        "قم بإنشاء حساب جديد في أكاديمية نكستجن للوصول إلى المحتوى الحصري والدورات.",
    };
  } else {
    return {
      title: getTitle("Sign Up", "en"),
      description:
        "Create a new Nexgen Academy account to access exclusive content and courses.",
    };
  }
}
export function getMetadataResetCodePage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle("رمز إعادة التعيين", "ar"),
      description:
        "أدخل رمز إعادة التعيين لاستعادة الوصول إلى حسابك في أكاديمية نكستجن.",
    };
  } else {
    return {
      title: getTitle("Reset Code", "en"),
      description:
        "Enter the reset code to regain access to your Nexgen Academy account.",
    };
  }
}
export function getMetadataForgetPasswordPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle("نسيت كلمة المرور", "ar"),
      description: "استعادة كلمة المرور الخاصة بحسابك في أكاديمية نكستجن.",
    };
  } else {
    return {
      title: getTitle("Forgot Password", "en"),
      description: "Retrieve your Nexgen Academy account password.",
    };
  }
}
export function getMetadataResetPasswordPage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle("إعادة تعيين كلمة المرور", "ar"),
      description: "قم بإعادة تعيين كلمة المرور لحسابك في أكاديمية نكستجن.",
    };
  } else {
    return {
      title: getTitle("Reset Password", "en"),
      description: "Reset your Nexgen Academy account password.",
    };
  }
}
export function getMetadataTermsOfServicePage({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (params.locale === "ar") {
    return {
      title: getTitle("شروط الخدمة", "ar"),
      description: "تعرف على شروط الخدمة لاستخدام موقع أكاديمية نكستجن.",
    };
  } else {
    return {
      title: getTitle("Terms of Service", "en"),
      description: "Learn about the terms of service for using the Nexgen Academy website.",
    };
  }
}
