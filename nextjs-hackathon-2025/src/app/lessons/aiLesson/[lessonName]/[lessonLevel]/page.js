import MainLayout from "@/components/layout/MainLayout";

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

export default async function LessonAI({ params }) {
  const { lessonName, lessonLevel } = await params;
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
      <BaseChatScreen
        initialBot="lesson"
        allowBotSwitch={false}
        bots={lessonBots}
        systemVariable={[
          {
            role: "system",
            variable: {
              subject: `${lessonName}`,
              difficulty: `${lessonLevel}`,
            },
          },
        ]}
        className="h-[calc(100vh-16rem)]"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Lesson: {decodeURIComponent(lessonName)}
            Level: {decodeURIComponent(lessonLevel)}
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div>This is where the lesson content will go!</div>
            <div className="mt-4 text-gray-600">
              Currently studying: {decodeURIComponent(lessonName)}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
