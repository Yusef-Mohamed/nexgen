export type SafetyKind = "post" | "comment" | "message";
export type SafetyMe = { rulesVersion: string; consented: boolean; suspended: boolean; suspensionReason: string | null; hiddenUserIds: string[]; blocks: { id: string; name: string }[] };
export type SafetySubmission = { _id: string; kind: SafetyKind; content: string; moderationState: string; moderationRevision: number; appealState: string | null; decisionReason: string | null; canAppeal: boolean };
export type SafetyPage = { data: SafetySubmission[]; hasMore: boolean };
export const safetyReasons = ["spam", "harassment", "hate", "sexual", "violence", "scam", "privacy", "other"] as const;
export const safetyCopy = {
  en: {
    title: "Community safety", actions: "Report / block", rulesTitle: "Community rules",
    rules: "Be respectful. No harassment, hate, threats, sexual exploitation, graphic violence, scams, spam, illegal content or sharing private information without permission. These rules apply to text, images and attachments. Repeated or serious abuse may result in a Community suspension.",
    review: "Posts, comments, replies and attachments publish immediately to their permitted audience, including edits. Users can report content and block others. Admins review reports afterward and may remove content or suspend publishing access. Reports alone do not hide content.",
    accept: "I agree to the Community rules", accepted: "Community rules accepted",
    report: "Report content", reportSent: "Report received. The moderation team will review it.",
    reason: "Reason", block: "Block this user", confirmBlock: "Confirm block",
    blockInfo: "You will no longer see each other's Community content or chat messages. Direct chats become unavailable; shared groups remain open. You can unblock them in account settings.",
    blocked: "Blocked users", unblock: "Unblock", noneBlocked: "No blocked users.",
    support: "Contact support", submissions: "My content and appeals", post: "Posts", comment: "Comments", message: "Chat messages",
    pending: "Published", approved: "Published", removed: "Removed",
    appeal: "Appeal removal", appealReason: "Explain why this decision should be reviewed",
    appealSent: "Appeal submitted", appealPending: "Appeal awaiting review", appealResolved: "Appeal reviewed",
    decision: "Moderator's explanation", suspend: "Community publishing is suspended for your account.",
    loading: "Loading safety settings...", retry: "Retry", error: "Unable to complete this action. Check your connection and try again.",
    rateError: "Too many requests. Please wait before trying again.", conflictError: "This content has changed. Refresh and try again.",
    unavailable: "This content or member is no longer available.", empty: "No submissions.", cancel: "Cancel",
    next: "Next", previous: "Previous", refresh: "Refresh", sent: "Saved",
    spam: "Spam", harassment: "Harassment or bullying", hate: "Hate or discrimination", sexual: "Sexual content or exploitation",
    violence: "Violence or threats", scam: "Scam or fraud", privacy: "Private information", other: "Other",
  },
  ar: {
    title: "سلامة المجتمع", actions: "إبلاغ / حظر", rulesTitle: "قواعد المجتمع",
    rules: "التزم بالاحترام. يمنع التحرش والكراهية والتهديدات والاستغلال الجنسي والعنف الصادم والاحتيال والرسائل المزعجة والمحتوى غير القانوني ونشر المعلومات الخاصة دون إذن. تنطبق القواعد على النصوص والصور والمرفقات. قد تؤدي الإساءة الجسيمة أو المتكررة إلى تعليق المشاركة في المجتمع.",
    review: "تنشر المنشورات والتعليقات والردود والمرفقات وتعديلاتها فورا للجمهور المسموح له. يمكن للمستخدمين الإبلاغ عن المحتوى وحظر الآخرين. يراجع المشرفون البلاغات لاحقا وقد يزيلون المحتوى أو يعلقون صلاحية النشر. لا تخفي البلاغات وحدها المحتوى.",
    accept: "أوافق على قواعد المجتمع", accepted: "تمت الموافقة على قواعد المجتمع",
    report: "الإبلاغ عن المحتوى", reportSent: "تم استلام البلاغ وسيراجعه فريق الإشراف.",
    reason: "السبب", block: "حظر هذا المستخدم", confirmBlock: "تأكيد الحظر",
    blockInfo: "لن يظهر لأي منكما محتوى الآخر في المجتمع أو رسائله. تتوقف المحادثات المباشرة وتبقى المجموعات المشتركة متاحة. يمكنك إلغاء الحظر من إعدادات الحساب.",
    blocked: "المستخدمون المحظورون", unblock: "إلغاء الحظر", noneBlocked: "لا يوجد مستخدمون محظورون.",
    support: "التواصل مع الدعم", submissions: "محتواي والاعتراضات", post: "المنشورات", comment: "التعليقات", message: "رسائل المحادثة",
    pending: "منشور", approved: "منشور", removed: "تمت الإزالة",
    appeal: "الاعتراض على الإزالة", appealReason: "اشرح سبب طلب مراجعة القرار",
    appealSent: "تم إرسال الاعتراض", appealPending: "الاعتراض بانتظار المراجعة", appealResolved: "تمت مراجعة الاعتراض",
    decision: "توضيح المشرف", suspend: "تم تعليق صلاحية النشر في المجتمع لحسابك.",
    loading: "جار تحميل إعدادات السلامة...", retry: "إعادة المحاولة", error: "تعذر إكمال الإجراء. تحقق من الاتصال وحاول مجددا.",
    rateError: "طلبات كثيرة. يرجى الانتظار قبل المحاولة مجددا.", conflictError: "تغير المحتوى. حدث الصفحة وحاول مجددا.",
    unavailable: "هذا المحتوى أو المستخدم لم يعد متاحا.", empty: "لا يوجد محتوى.", cancel: "إلغاء",
    next: "التالي", previous: "السابق", refresh: "تحديث", sent: "تم الحفظ",
    spam: "رسائل مزعجة", harassment: "تحرش أو تنمر", hate: "كراهية أو تمييز", sexual: "محتوى أو استغلال جنسي",
    violence: "عنف أو تهديد", scam: "احتيال", privacy: "معلومات خاصة", other: "سبب آخر",
  },
} as const;
export function safetyError(error: unknown, locale: string) {
  const copy = safetyCopy[locale === "ar" ? "ar" : "en"];
  const value = error as { code?: string; message?: string; response?: { data?: { code?: string } } } | null;
  const code = value?.response?.data?.code || value?.code || value?.message;
  if (code === "COMMUNITY_SUSPENDED") return copy.suspend;
  if (code === "SAFETY_RATE_LIMITED") return copy.rateError;
  if (code === "SAFETY_CONFLICT" || code === "SAFETY_APPEAL_UNAVAILABLE") return copy.conflictError;
  if (code === "CONTENT_UNAVAILABLE" || code === "MEMBER_UNAVAILABLE") return copy.unavailable;
  return copy.error;
}
export function safetyState(value: unknown, locale: string) {
  const copy = safetyCopy[locale === "ar" ? "ar" : "en"];
  return value === "approved" ? copy.approved : value === "removed" ? copy.removed : copy.pending;
}
