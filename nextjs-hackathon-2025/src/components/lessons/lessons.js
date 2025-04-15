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

// lesson level is HARDCODED to test functionality
// Have three levels: easy, medium, hard [1,2,3]
const lessons = [
  {
    title: "Home",
    lessonNumber: 1,
    lessonIcon: RiHomeHeartLine,
    lessonLevel: 1,
  },
  {
    title: "Store",
    lessonNumber: 2,
    lessonIcon: RiStore2Line,
    lessonLevel: 2,
  },
  {
    title: "Restaurant",
    lessonNumber: 3,
    lessonIcon: RiRestaurantLine,
    lessonLevel: 3,
  },
  {
    title: "Travel",
    lessonNumber: 4,
    lessonIcon: RiPlaneLine,
    lessonLevel: 1,
  },
  {
    title: "Sports",
    lessonNumber: 5,
    lessonIcon: RiFootballFill,
    lessonLevel: 1,
  },
  {
    title: "Final",
    lessonNumber: 6,
    lessonIcon: RiTrophyLine,
    lessonLevel: 1,
  },
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
            lessonLevel={lessons[5].lessonLevel}
          />
        </div>

        {/* Middle row */}
        <div className="flex justify-center gap-20 mb-16">
          <LessonCircle
            lessonTitle={lessons[3].title}
            lessonNumber={lessons[3].lessonNumber}
            Icon={lessons[3].lessonIcon}
            lessonLevel={lessons[3].lessonLevel}
          />
          <LessonCircle
            lessonTitle={lessons[4].title}
            lessonNumber={lessons[4].lessonNumber}
            Icon={lessons[4].lessonIcon}
            lessonLevel={lessons[4].lessonLevel}
          />
        </div>

        {/* Bottom row */}
        <div className="flex justify-center gap-10 md:gap-20">
          <LessonCircle
            lessonTitle={lessons[0].title}
            lessonNumber={lessons[0].lessonNumber}
            Icon={lessons[0].lessonIcon}
            lessonLevel={lessons[0].lessonLevel}
          />
          <LessonCircle
            lessonTitle={lessons[1].title}
            lessonNumber={lessons[1].lessonNumber}
            Icon={lessons[1].lessonIcon}
            lessonLevel={lessons[1].lessonLevel}
          />
          <LessonCircle
            lessonTitle={lessons[2].title}
            lessonNumber={lessons[2].lessonNumber}
            Icon={lessons[2].lessonIcon}
            lessonLevel={lessons[2].lessonLevel}
          />
        </div>
      </div>
    </MainLayout>
  );
}
