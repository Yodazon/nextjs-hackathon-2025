//need to add variables  to be passed to Lnagbase for AI lesson planning
import Link from "next/link";
import LessonAI from "@/app/lessons/aiLesson/[lessonName]/[lessonLevel]/page";
const LessonCircle = ({ lessonTitle, lessonNumber, Icon, lessonLevel }) => {
  // Color mapping based on lesson level
  const getLevelColors = (level) => {
    const levelColors = {
      1: {
        bg: "bg-green-100",
        border: "border-green-400",
        hover: "hover:bg-green-200",
        hover_border: "hover:border-green-500",
      },
      2: {
        bg: "bg-yellow-100",
        border: "border-yellow-400",
        hover: "hover:bg-yellow-200",
        hover_border: "hover:border-yellow-500",
      },
      3: {
        bg: "bg-red-100",
        border: "border-red-400",
        hover: "hover:bg-red-200",
        hover_border: "hover:border-red-500",
      },
    };

    return levelColors[level] || levelColors[1]; // Default to level 1 colors if level not found
  };

  const colors = getLevelColors(lessonLevel);

  return (
    <div className="flex flex-col items-center">
      <Link href={`/lessons/aiLesson/${lessonTitle}/${lessonLevel}`}>
        <div
          className={`
        w-24 h-24 md:w-32 md:h-32 
        rounded-full 
        ${colors.bg} 
        ${colors.hover} 
        ${colors.hover_border}
        border-10 
        ${colors.border} 
        flex items-center 
        justify-center 
        mb-2 
        transition-colors 
        duration-200
      `}
        >
          {Icon && <Icon className="w-8 h-8 md:w-12 md:h-12 text-gray-600" />}
        </div>
      </Link>
      <p className="text-center text-sm md:text-base font-medium">
        {lessonTitle}
      </p>
      <p className="text-center text-sm md:text-base font-medium">
        Lesson #{lessonNumber}
      </p>
      <span className="text-xs text-gray-500 mt-1">Level {lessonLevel}</span>
    </div>
  );
};

export default LessonCircle;
