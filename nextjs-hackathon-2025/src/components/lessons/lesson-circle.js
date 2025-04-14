const LessonCircle = ({ lessonTitle, lessonNumber, Icon }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 border-10 border-[#f08080] flex items-center justify-center mb-2">
        {Icon && <Icon className="w-8 h-8 md:w-12 md:h-12 text-gray-600" />}
      </div>
      <p className="text-center text-sm md:text-base font-medium">
        {lessonTitle}
      </p>
      <p className="text-center text-sm md:text-base font-medium">
        Lesson #{lessonNumber}
      </p>
    </div>
  );
};

export default LessonCircle;
