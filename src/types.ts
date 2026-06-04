import { emojis } from "./constants";
export type DynamicString =
  | string
  | { ar: string; en: string; localized: string };
export interface ICategory {
  title: DynamicString;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICourse {
  title: DynamicString;
  description: DynamicString;
  certificateDescription: DynamicString;
  courseWelcomeMessage: DynamicString;
  goodByeMessage: DynamicString;
  whatIsNextTitle?: DynamicString;
  whatIsNextDescription?: DynamicString;
  nextCourses?: ICourse[];

  whoThisCourseFor: DynamicString[];
  coursePrerequisites: DynamicString[];
  whatWillLearn: DynamicString[];

  ratingsAverage: number;
  examQuestionsNumber?: number;
  colors?: {
    bgColor: string;
    bgDarkMode: string;
    fontColor: string;
    fontDarkMode: string;
  };
  _id: string;
  category: {
    title: DynamicString;
    _id: string;
  };
  instructor: {
    _id: string;
    name: string;
    email: string;
    profileImg: string;
  };
  slug: string;
  rating: number;
  type: string;
  highlights: DynamicString[];
  image: string;
  price: number;
  priceAfterDiscount: number;
  coursePercentage: number;
  courseDuration: number;
  ratingsQuantity: number;
  needAccessibleCourse: boolean;
  freePackageSubscriptionInDays?: number;
  accessibleCourses: ICourse[];
  status: "inActive" | "active";
  promotionVideo?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  reviews: [];
  id: string;
  totalProgress?: number;
  userScore?: IUserScore;
  courseProgress?: ICourseProgress;
  lastLesson?: {
    title: DynamicString;
    description: DynamicString;
    _id: string;
    section: {
      title: DynamicString;
      _id: string;
    };
    lessonDuration: number;
  };
  examTitle?: DynamicString;
}
export interface ILesson {
  course: ICourse;
  title: DynamicString;
  description: DynamicString;
  attachments: string[];
  image: string;
  videoUrl?: string;
  isUnlocked?: boolean;
  _id: string;
  type: string;
  isRequireAnalytic: boolean;
  hasQuiz: boolean;
  lessonDuration?: number;
  order: number;
  passedExam?: boolean;
  passedAnalyticsTask?: boolean;
  // Assignment fields
  assignmentTitle?: DynamicString;
  assignmentDescription?: DynamicString;
  assignmentFile?: string;
  //
  assignmentDone?: boolean;
  lessonWatched?: boolean;
  quizTitle?: string;
  examQuestionsNumber?: number;
}

export interface IUser {
  name: string;
  email: string;
  role: "user" | "admin" | "marketer" | "customer" | "instructor";
  _id: string;
  phone: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  profileImg?: string;
  coverImg?: string;
  signatureImage?: string;
  authToReview: boolean;
  startMarketing: boolean;
  emailVerified: boolean;
  isInstructor?: boolean;
  idVerification: "pending" | "rejected" | "verified";
  note?: string;
  idDocuments: string[];
  timeSpent: {
    monthlyTimeSpent: number;
    totalTimeSpent: number;
  };
  isMarketer: boolean;
  isAffiliateMarketer: boolean;
  bio?: string;
  __v: number;
  lang: "ar" | "en";
}
export interface InputData {
  name: string;
  type: string;
  pattern?: string;
  title?: string;
  values?: {
    value: string;
    label: string;
  }[];
  multiLang?: boolean;
}

export interface InputProps {
  input: InputData;
  isLoading: boolean;
  value?: string | null;
  setData: (data: string | File) => void;
  inputs: (name: string) => string;
  notRequired?: boolean;
  error?: Record<string, string>;
}
export interface ApiError {
  param: string;
  msg: string;
}
export interface IExam {
  _id: string;
  model: string;
  title: DynamicString;
  passingScore: number;
  type: string;
  questions: IQuestion[];
  createdAt: string;
  updatedAt: string;
}
export interface IQuestion {
  _id: string;
  question: DynamicString;
  options: string[];
  correctOption: number;
  questionImage?: string;
  wrongAnswer?: number;
  grade?: number;
}
export interface IPackage {
  title: DynamicString;
  description: DynamicString;
  whoThisCourseFor: DynamicString[];
  coursePrerequisites: DynamicString[];
  whatWillLearn: DynamicString[];
  category: ICategory;
  image: string;
  price: number;
  priceAfterDiscount?: number;
  subscriptionDurationDays: number;
  status: "active" | "inActive" | "pending";
  course: ICourse;
  _id: string;
  slug: string;
  createdAt: string;
  promotionVideo?: string;
  updatedAt: string;
}
export interface ICoursePackage {
  title: DynamicString;
  description: DynamicString;
  highlights: DynamicString[];
  whoThisCourseFor: DynamicString[];
  coursePrerequisites: DynamicString[];
  promotionVideo?: string;
  whatWillLearn: DynamicString[];
  status: "active" | "inActive" | "pending";
  price: number;
  priceAfterDiscount?: number;
  courses: ICourse[];
  type:
    | "beginnerToIntermediate"
    | "intermediateToAdvanced"
    | "beginnerToAdvanced";
  _id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category: ICategory;
  image: string;
}
export interface IPost {
  content: string;
  imageCover: string;
  images: string[];
  sharedTo: string;
  user: IUser;
  course: ICourse[];
  package: IPackage[];
  reactionsCount: number;
  commentsCount: number;
  loggedUserReaction?: {
    type: keyof typeof emojis;
    _id: string;
  };
  _id: string;
  reactionTypes: (keyof typeof emojis)[];
  lastComment: IComment;
  createdAt: string;
  updatedAt: string;
}
export interface ILive {
  title: DynamicString;
  date: string;
  package: IPackage[];
  instructor: IUser;
  link: string;
  status: "active" | "inActive";
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface IChat {
  groupName: string;
  description: string;
  isGroupChat: boolean;
  archived: boolean;
  image?: string;
  participants: {
    user: string;
    userDetails: IUser;
    isAdmin: boolean;
    _id: string;
  }[];

  lastMessage?: IMessage[];
  createdAt: string;
  _id: string;
}
export interface IMessage {
  chat: string;
  isRead: boolean;
  media: string[];
  reactions: string[];
  sender: IUser;
  text: string;
  seenBy: string[];
  repliedTo: IMessage;
  createdAt: string;
  _id: string;
}
export interface IComment {
  content: string;
  image: string;
  post: string;
  user: IUser;

  repiles: IComment[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}
export interface IReview {
  title: string;
  ratings: number;
  user: IUser;
  course?: ICourse;
  reply?: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
export interface IReact {
  user: IUser;
  post: string;
  type: keyof typeof emojis;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface IInovice {
  totalSalesMoney: number;
  mySales: number;
  profitPercentage: number;
  profits: number;
  desc: string;
  paymentMethod: string;
  receiverAcc: string;
  status: string;
  createdAt: string;
  _id: string;
}
export interface IWalletItem {
  member: IUser;
  amount: number;
  percentage: number;
  profit: number;
  Date: string;
  createdAt: string;
  _id: string;
}
export interface IWalletInvoiceItem {
  Date: string;
  createdAt: string;
  desc: string;
  paymentMethod: string;
  profits: number;
  reasonToWithdraw: string;
  recieverAcc: string;
  status: string;
  _id: string;
}
export interface IMarketLog {
  role: string;
  marketer: IUser;
  totalProfits: number;
  commissionsProfits: number;
  availableToWithdraw: number;
  withdrawals: number;
  totalSalesMoney: number;
  hasSentRequest: boolean;
  salesMoneyDifference: number;
  profitsDifference: number;
  profits: number;
  profitPercentage: number;
  invoices: IInovice[];
  sales: ISale[];
  commissions: ICommissions[];
  invitationKeys: string[];
  wallet: IWalletItem[];
  walletInvoices: ISubInvoice[];
  commissionsInvoices: ISubInvoice[];
  __v: number;
  _id: string;
  updatedAt: string;
  createdAt: string;
}
export interface ISale {
  purchaser: IUser;
  amount: number;
  type: string;
  item: string;
  Date: string;
  _id: string;
}
export interface ISubInvoice {
  createdAt: string;
  desc: string;
  profits: number;
  status: string;
  _id: string;
}
export interface ICommissions {
  profit: number;
  lastUpdate: string;
  _id: string;
  member: IUser;
}
export interface IAnalytic {
  content: string;
  createdAt: string;
  imageCover: string;
  isPassed: boolean;
  isSeen: boolean;
  marketer: string;
  updatedAt: string;
  marketerComment?: string;
  media: string[];
  user: IUser;
  _id: string;
}
export interface IUserScore {
  averageGradePercentage: number;
  completedLessons: ILesson[];
  examsCompletedPercentage: number;
  examsNotAttemptedPercentage: number;
  finalExamCompletionPercentage: number;
  notAttemptedLessons: ILesson[];
  totalProgress: string;
  completedLessonsPercentage: number;
  completionStatus: string;
  lessonsScores: ILessonScore[];
}
export interface IPagination {
  numberOfPages: number;
  limit: number;
  currentPage: number;
  results: number;
}
export interface IOrder {
  coursePackage?: ICoursePackage;
  package?: IPackage;
  course?: ICourse;
  isPaid: boolean;
  paidAt: string;
  paymentMethodType: string;
  totalOrderPrice: number;
  isResale: boolean;
  user: IUser;
  _id: string;
}
export interface INotification {
  _id: string;
  createdAt: string;
  message: string;
  read: boolean;
  type: "chat" | "post" | "system" | "follow" | "certificate" | "order";
  course?: string;
  post?: IPost;
  chat?: IChat;
  file?: string;
  followedUser?: IUser;
  updatedAt: string;
  __v: number;
}
export type BlogStatus = "active" | "inactive" | "pending";

export interface IBlog {
  title: DynamicString;
  videoUrl: string;
  imageCover: string;
  content: DynamicString;
  description: DynamicString;
  _id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    profileImg: string;
  };
  readTime: number;
  status?: BlogStatus;
}
export interface IProgress {
  lesson: ILesson;
  modelExam: "A" | "B";
  status: "Completed" | "failed";
  examScore: number;
  attemptDate: string;
  _id: string;
}
export interface ILessonScore {
  lessonId: string;
  lessonTitle: DynamicString;
  percentage: string | number;
  attemptDate: string;
  modelExam: "A" | "B";
}
export interface ISection {
  title: DynamicString;
  section: string;
  _id: string;
  sectionId: string;
  course: ICourse;
  createdAt: string;
  updatedAt: string;
  order: number;
  status: "active" | "inActive";
  lessons?: ILesson[];
}
export interface ICourseProgress {
  avgLessonsExamsPercentage: number;
  avgCourseExamsPercentage: number;
  totalProgress: string;
  status: "Completed" | "failed" | "notTaken";
  totalLessonsExamsPercentage: string;
  certificate: {
    file: string;
    _id: string;
    isTake: boolean;
  };
}
export interface ICoupon {
  couponName: string;
  discount: number;
  marketer: IUser;
  maxUsageTimes: number;
  usedTimes: number;
  status: "active" | "rejected" | "pending";
  reason: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
export interface IEvent {
  title: string;
  description: string;
  date: string;
  link: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
