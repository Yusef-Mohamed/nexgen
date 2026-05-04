import { useTranslations } from "next-intl";
import {
  HiOutlineAcademicCap,
  HiOutlineGlobeAlt,
  HiOutlineStar,
  HiOutlineUsers,
} from "react-icons/hi2";

const HeroSection = () => {
  const text = useTranslations("aboutHeroPage");
  const heroText = useTranslations("hero");

  // Temporarily keeping the old about metrics here for later reuse.
  // const aboutStats = [
  //   {
  //     value: "10+",
  //     label: text("yearsOfExperience"),
  //     icon: <HiOutlineSparkles className="size-5" />,
  //     tone: "primary",
  //   },
  //   {
  //     value: "40+",
  //     label: text("ourInstructors"),
  //     icon: <HiOutlineAcademicCap className="size-5" />,
  //     tone: "secondary",
  //   },
  //   {
  //     value: "10K+",
  //     label: text("ourLearners"),
  //     icon: <HiOutlineUserGroup className="size-5" />,
  //     tone: "primary",
  //   },
  // ];

  const stats = [
    {
      value: "1K+",
      label: heroText("activeLearners"),
      icon: <HiOutlineUsers className="size-5" />,
      tone: "primary",
    },
    {
      value: "10+",
      label: heroText("expertCourses"),
      icon: <HiOutlineAcademicCap className="size-5" />,
      tone: "secondary",
    },
    {
      value: "4.9/5",
      label: heroText("topRated"),
      icon: <HiOutlineStar className="size-5" />,
      tone: "gold",
    },
  ];

  return (
    <section className="container pt-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary-faded px-4 py-10 sm:px-8 sm:py-14 md:px-12 lg:px-16">
        <div
          aria-hidden
          className="absolute -top-24 -start-24 size-72 rounded-full bg-secondary/25 dark:bg-secondary/35 blur-[110px] opacity-80 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -end-24 size-72 rounded-full bg-primary/20 dark:bg-primary/30 blur-[110px] opacity-80 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-clear-ground/80 backdrop-blur-sm border border-primary/20 cardShadowSm">
            <HiOutlineGlobeAlt className="size-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary-main">
              NexGen Academy
            </span>
          </div>
          <h1 className="font-bold leading-tight tracking-tight text-text-1">
            {text("heading")}
          </h1>
          <p className="my-6 sm:my-8 text-base md:text-lg text-text-2 leading-relaxed max-w-2xl">
            {text("subHeading")}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-clear-ground/75 border border-primary/10 p-4 backdrop-blur-sm"
              >
                <div
                  className={
                    stat.tone === "primary"
                      ? "mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      : stat.tone === "gold"
                      ? "mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold"
                      : "mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary"
                  }
                >
                  {stat.icon}
                </div>
                <div className="text-xl font-bold text-text-1 leading-none">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs sm:text-sm text-text-3">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-3 rounded-[40px] bg-gradient-to-br from-primary/20 via-secondary/15 to-transparent blur-2xl"
        />
        <div className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-clear-ground cardShadow">
          <Image
            width={1350}
            height={540}
            priority
            src="/images/about_hero_section.jpeg"
            alt="Forex trading education illustration"
            className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-clear-ground/90 backdrop-blur-md border border-primary/10 p-4 cardShadowSm">
            <p className="text-sm sm:text-base text-text-2 leading-relaxed">
              {text("description")}
            </p>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;
