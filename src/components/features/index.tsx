import SectionTitle from "../sectionTitle";
import {
  AwardsIcon,
  BookOpen,
  Globe,
  GraduationHatFill,
  Message,
  TargetIcon,
} from "@/lib/icons";

const reasonIcons = [
  GraduationHatFill,
  BookOpen,
  Message,
  TargetIcon,
  Globe,
  AwardsIcon,
];

const reasons = [
  { title: "Structured Career Preparation", label: "A Clear Path to Your Goal", text: "Understand what it takes to pursue a Merchant Navy career with focused preparation for IMU-CET and sponsorship examinations.", mobileText: "Prepare for IMU-CET and sponsorship exams with a clear career path." },
  { title: "Affordable Learning", label: "Quality Education Within Reach", text: "Access recorded lectures, study materials, practice questions, and learning support designed to make preparation more accessible.", mobileText: "Access lessons, study material, practice, and support at an affordable cost." },
  { title: "Personalised Student Support", label: "Guidance Beyond the Classroom", text: "Get help with doubts, preparation strategies, and interview readiness so you can approach each stage with greater confidence.", mobileText: "Get help with doubts, strategy, and interview readiness." },
  { title: "Practice for Real Opportunities", label: "Prepare with Confidence", text: "Build your knowledge, communication skills, and interview confidence through mock tests and mock interviews.", mobileText: "Build knowledge and confidence through mock tests and interviews." },
  { title: "Flexible Online Learning", label: "Learn on Your Schedule", text: "Revisit recorded lessons and organise your preparation around your own schedule, wherever you are.", mobileText: "Revisit lessons and plan learning around your schedule." },
  { title: "Your Maritime Journey Matters", label: "Focused on Your Future", text: "We aim to help aspiring mariners move forward with the knowledge, discipline, and confidence needed to pursue their career ambitions.", mobileText: "Develop the knowledge, discipline, and confidence for your maritime goals." },
];

const Features = () => {
  return (
    <section id="why-us" className="bg-gray-950 py-10 sm:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          className="flex flex-col items-center text-center"
          titleClassName="text-primary"
          subTitleClass="btn-gradient-border-black max-h-none text-gray-400 [&_p]:text-sm sm:[&_p]:text-xl lg:[&_p]:text-2xl"
          subTitle="Why choose Future Mariners Foundation?"
        >
          Your Dreams. Our Guidance. A Future at Sea.
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 pt-8 sm:gap-6 sm:pt-14 lg:grid-cols-3 lg:pt-16">
          {reasons.map((reason, index) => {
            const Icon = reasonIcons[index];
            return (
            <div
              key={reason.title}
              className="rounded-2xl border border-[#202020] bg-[linear-gradient(180deg,#222530_0%,#131422_100%)] p-3 sm:rounded-3xl sm:p-6"
            >
              <div
                style={{
                  background:
                    "linear-gradient(var(--gray-700), var(--gray-800)) padding-box, linear-gradient(to bottom, var(--secondary), var(--gray-800)) border-box",
                  borderRadius: "999px",
                  border: "0.75px solid transparent",
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#e4aa3b] sm:h-12 sm:w-12"
              >
                <Icon />
              </div>
              <p className="mt-4 text-[9px] leading-3 font-bold tracking-[0.08em] text-gray-400 uppercase sm:mt-7 sm:text-xs sm:leading-normal sm:tracking-[0.14em]">{reason.label}</p>
              <h5 className="mt-1.5 text-sm leading-5 font-semibold text-primary sm:mt-3 sm:text-xl sm:leading-7.5">{reason.title}</h5>
              <p className="mt-1 text-[10px] leading-4 tracking-base text-gray-400 sm:hidden">{reason.mobileText}</p>
              <p className="hidden sm:mt-2 sm:block sm:tracking-base sm:text-gray-400">{reason.text}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
