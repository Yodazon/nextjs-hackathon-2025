import MainLayout from "@/components/layout/MainLayout";
<<<<<<< Updated upstream
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
import BaseChatScreen from "@/components/chat/mainChatComponent";

const lessonBots = {
  lesson: {
    name: "Lessons",
    pipeName: "lesson-teacher",
    icon: "📚",
    voice: "ThT5KcBeYPX3keUQqHPh",
    id: "lesson",
  },
};
<<<<<<< Updated upstream
=======
>>>>>>> a85a9f172c32dfc215f1ce9d79a78f2883464933
=======
>>>>>>> Stashed changes

export default async function LessonAI({ params }) {
  const { lessonName } = await params;

  if (!lessonName) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">Error: Lesson not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
<<<<<<< Updated upstream
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
      <BaseChatScreen
        initialBot="lesson"
        allowBotSwitch={false}
        bots={lessonBots}
        systemContext={[
          {
            role: "system",
            variable: `${lessonName}`,
          },
        ]}
        className="h-[calc(100vh-16rem)]"
      />
      {/* <div className="container mx-auto px-4 py-8">
<<<<<<< Updated upstream
=======
      <div className="container mx-auto px-4 py-8">
>>>>>>> a85a9f172c32dfc215f1ce9d79a78f2883464933
=======
>>>>>>> Stashed changes
        <h1 className="text-3xl font-bold mb-6">
          Lesson: {decodeURIComponent(lessonName)}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div>This is where the lesson content will go!</div>
          <div className="mt-4 text-gray-600">
            Currently studying: {decodeURIComponent(lessonName)}
          </div>
        </div>
<<<<<<< Updated upstream
<<<<<<< HEAD
      </div> */}
=======
      </div>
>>>>>>> a85a9f172c32dfc215f1ce9d79a78f2883464933
=======
      </div> */}
>>>>>>> Stashed changes
    </MainLayout>
  );
}
