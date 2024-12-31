import { emojis } from "./constants";

export interface ICategory {
  title: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICourse {
  title: string;
  description: string;
  image: string;
  price: number;
  priceAfterDiscount?: number;
  category: ICategory;
  accessibleCourses?: ICourse[];
  coursePercentage: number;
  highlights: string[];
  colors: {
    bgColor: string;
    bgDarkMode: string;
    fontColor: string;
    fontDarkMode: string;
  };
  reviews: IReview[];
  ratingsQuantity: number;
  ratingsAverage: number;
  progressPercentage?: number;
  totalProgress?: number;
  userScore?: IUserScore;
  courseProgress?: ICourseProgress;
  _id: string;
  createdAt: string;
  instructor: IUser;
  updatedAt: string;
  users: {
    email: string;
    _id: string;
    profileImg: string;
    name: string;
  }[];
}
export interface ILesson {
  course: ICourse;
  title: string;
  description: string;
  attachments: string[];
  image: string;
  videoUrl?: string;
  _id: string;
  type: string;
  isRequireAnalytic: boolean;
  lessonDuration?: number;
  order: number;
}

export interface IUser {
  name: string;
  email: string;
  role: "user" | "admin" | "marketer" | "customer" | "instructor";
  _id: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  profileImg?: string;
  coverImg?: string;
  authToReview: boolean;
  startMarketing: boolean;
  emailVerified: boolean;
  idVerification: "pending" | "rejected" | "verified";
  note?: string;
  idDocuments: string[];
  timeSpent: {
    monthlyTimeSpent: number;
    totalTimeSpent: number;
  };
  isMarketer: boolean;
  __v: number;
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
  title: string;
  passingScore: number;
  type: string;
  questions: IQuestion[];
  createdAt: string;
  updatedAt: string;
}
export interface IQuestion {
  _id: string;
  question: string;
  options: string[];
  correctOption: number;
  questionImage?: string;
  wrongAnswer?: number;
  grade?: number;
}
export interface IPackage {
  title: string;
  description: string;
  highlights: string[];
  price: number;
  priceAfterDiscount?: number;
  subscriptionDurationDays: number;
  course: ICourse;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICoursePackage {
  title: string;
  description: string;
  highlights: string[];
  price: string;
  priceAfterDiscount?: string;
  courses: ICourse[];
  _id: string;
  createdAt: string;
  updatedAt: string;
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
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface ILive {
  title: string;
  date: string;
  package: IPackage[];
  instructor: IUser;
  link: string;
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
  lessonsScores: IProgress[];
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
  post?: string;
  chat?: IChat;
  file?: string;
  followedUser?: IUser;
  updatedAt: string;
  __v: number;
}
export interface IBlog {
  title: string;
  videoUrl: string;
  imageCover: string;
  content: string;
  description: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  readTime: number;
}
export interface IProgress {
  lesson: ILesson;
  modelExam: "A" | "B";
  status: "Completed" | "failed";
  examScore: number;
  attemptDate: string;
  _id: string;
}
export interface ISection {
  title: string;
  _id: string;
  course: ICourse;
  createdAt: string;
  updatedAt: string;
  lessons?: ILesson[];
}
export interface ICourseProgress {
  totalProgress: string;
  status: "Completed" | "failed";
  totalLessonsExamsPercentage: string;

  certificate: {
    isTaken: boolean;
    isDeserved: boolean;
    file?: string;
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
