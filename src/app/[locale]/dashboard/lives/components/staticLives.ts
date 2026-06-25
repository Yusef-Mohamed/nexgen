import { ICourse, ILive, IPackage, IUser } from "@/types";

const createTitle = (en: string, ar = en) => ({
  en,
  ar,
  localized: en,
});

const staticInstructor: IUser = {
  _id: "static-instructor-aya",
  name: "Aya Hassan",
  email: "aya.hassan@nexgen.local",
  role: "instructor",
  phone: "+201000000000",
  active: true,
  authToReview: false,
  startMarketing: false,
  emailVerified: true,
  isInstructor: true,
  idVerification: "verified",
  idDocuments: [],
  timeSpent: {
    monthlyTimeSpent: 0,
    totalTimeSpent: 0,
  },
  isMarketer: false,
  isAffiliateMarketer: false,
  lang: "en",
  profileImg: "",
  coverImg: "",
  signatureImage: "",
  bio: "Product design and frontend mentor",
  __v: 0,
  createdAt: "2026-06-25T00:00:00.000Z",
  updatedAt: "2026-06-25T00:00:00.000Z",
};

const staticCourseInstructor = {
  _id: staticInstructor._id,
  name: staticInstructor.name,
  email: staticInstructor.email,
  profileImg: staticInstructor.profileImg || "",
};

const createStaticCourse = ({
  id,
  title,
}: {
  id: string;
  title: string;
}): ICourse => ({
  _id: id,
  id,
  title: createTitle(title),
  description: createTitle(`${title} demo description`),
  certificateDescription: createTitle(`${title} certificate`),
  courseWelcomeMessage: createTitle(`Welcome to ${title}`),
  goodByeMessage: createTitle(`Great work finishing ${title}`),
  whoThisCourseFor: [createTitle("Dashboard learners")],
  coursePrerequisites: [createTitle("Basic product knowledge")],
  whatWillLearn: [createTitle("A focused live-session workflow")],
  ratingsAverage: 4.8,
  ratingsQuantity: 24,
  category: {
    _id: "static-category-dashboard",
    title: createTitle("Dashboard"),
  },
  instructor: staticCourseInstructor,
  slug: id,
  rating: 5,
  type: "intermediate",
  highlights: [createTitle("Live practice"), createTitle("Office hours")],
  image: "",
  price: 120,
  priceAfterDiscount: 95,
  coursePercentage: 70,
  courseDuration: 18,
  needAccessibleCourse: false,
  accessibleCourses: [],
  status: "active",
  promotionVideo: "",
  createdAt: "2026-06-25T00:00:00.000Z",
  updatedAt: "2026-06-25T00:00:00.000Z",
  __v: 0,
  reviews: [],
});

const staticCourses = [
  createStaticCourse({
    id: "static-course-product-foundations",
    title: "Product Foundations",
  }),
  createStaticCourse({
    id: "static-course-frontend-systems",
    title: "Frontend Systems",
  }),
  createStaticCourse({
    id: "static-course-growth-labs",
    title: "Growth Labs",
  }),
];

export const staticDashboardLivePackages: IPackage[] = staticCourses.map(
  (course, index) => ({
    _id: `static-package-${course._id}`,
    title: course.title,
    description: course.description,
    whoThisCourseFor: course.whoThisCourseFor,
    coursePrerequisites: course.coursePrerequisites,
    whatWillLearn: course.whatWillLearn,
    category: {
      _id: course.category._id,
      title: course.category.title,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    },
    image: course.image,
    price: course.price + index * 25,
    priceAfterDiscount: course.priceAfterDiscount,
    subscriptionDurationDays: 30,
    status: "active",
    course,
    slug: `static-package-${course.slug}`,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  }),
);

const getLiveDate = (daysFromToday: number, hour: number, minute = 0) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const getStaticDashboardLives = (): ILive[] => [
  {
    _id: "static-live-design-review",
    title: createTitle("Design Review: Course Card Systems"),
    date: getLiveDate(1, 18, 30),
    package: [staticDashboardLivePackages[0]],
    instructor: staticInstructor,
    link: "https://meet.google.com/demo-live-one",
    status: "active",
    createdAt: "2026-06-25T00:00:00.000Z",
    updatedAt: "2026-06-25T00:00:00.000Z",
  },
  {
    _id: "static-live-build-session",
    title: createTitle("Live Build: Searchable Dashboard Filters"),
    date: getLiveDate(2, 20),
    package: [staticDashboardLivePackages[1]],
    instructor: staticInstructor,
    link: "https://meet.google.com/demo-live-two",
    status: "active",
    createdAt: "2026-06-25T00:00:00.000Z",
    updatedAt: "2026-06-25T00:00:00.000Z",
  },
  {
    _id: "static-live-growth-lab",
    title: createTitle("Growth Lab: Student Retention Ideas"),
    date: getLiveDate(8, 19),
    package: [staticDashboardLivePackages[2]],
    instructor: staticInstructor,
    link: "https://meet.google.com/demo-live-three",
    status: "active",
    createdAt: "2026-06-25T00:00:00.000Z",
    updatedAt: "2026-06-25T00:00:00.000Z",
  },
  {
    _id: "static-live-office-hours",
    title: createTitle("Office Hours: Portfolio Feedback"),
    date: getLiveDate(14, 17, 15),
    package: [staticDashboardLivePackages[0], staticDashboardLivePackages[1]],
    instructor: staticInstructor,
    link: "https://meet.google.com/demo-live-four",
    status: "active",
    createdAt: "2026-06-25T00:00:00.000Z",
    updatedAt: "2026-06-25T00:00:00.000Z",
  },
];
