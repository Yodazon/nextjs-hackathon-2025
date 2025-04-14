import LessonCircle from "./lesson-circle";
import MainLayout from "../layout/MainLayout";

import {
  RiHomeHeartLine,
  RiStore2Line,
  RiRestaurantLine,
  RiPlaneLine,
  RiFootballFill,
  RiTrophyLine,
} from "react-icons/ri";

const lessons = [
  { title: "Home", lessonNumber: 1, lessonIcon: RiHomeHeartLine },
  { title: "Store", lessonNumber: 2, lessonIcon: RiStore2Line },
  { title: "Restaurant", lessonNumber: 3, lessonIcon: RiRestaurantLine },
  { title: "Travel", lessonNumber: 4, lessonIcon: RiPlaneLine },
  { title: "Sports", lessonNumber: 5, lessonIcon: RiFootballFill },
  { title: "Final", lessonNumber: 6, lessonIcon: RiTrophyLine },
];

export default function Lessons() {
  return (
    <MainLayout>
      <div className="w-full max-w-4xl border-2 rounded-2xl shadow-2xl py-4">
        {/* Top row */}
        <div className="flex justify-center mb-16">
          <LessonCircle
            lessonTitle={lessons[5].title}
            lessonNumber={lessons[5].lessonNumber}
            Icon={lessons[5].lessonIcon}
          />
        </div>

        {/* Middle row */}
        <div className="flex justify-center gap-20 mb-16">
          <LessonCircle
            lessonTitle={lessons[3].title}
            lessonNumber={lessons[3].lessonNumber}
            Icon={lessons[3].lessonIcon}
          />
          <LessonCircle
            lessonTitle={lessons[4].title}
            lessonNumber={lessons[4].lessonNumber}
            Icon={lessons[4].lessonIcon}
          />
        </div>

        {/* Bottom row */}
        <div className="flex justify-center gap-10 md:gap-20">
          <LessonCircle
            lessonTitle={lessons[0].title}
            lessonNumber={lessons[0].lessonNumber}
            Icon={lessons[0].lessonIcon}
          />
          <LessonCircle
            lessonTitle={lessons[1].title}
            lessonNumber={lessons[1].lessonNumber}
            Icon={lessons[1].lessonIcon}
          />
          <LessonCircle
            lessonTitle={lessons[2].title}
            lessonNumber={lessons[2].lessonNumber}
            Icon={lessons[2].lessonIcon}
          />
        </div>
      </div>
    </MainLayout>
  );
}
