const getDateTimeLocale = (locale: string) =>
  locale.startsWith("ar") ? "ar-EG" : locale;

export const formatMessageTime = (date: Date | string, locale: string) =>
  new Intl.DateTimeFormat(getDateTimeLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
