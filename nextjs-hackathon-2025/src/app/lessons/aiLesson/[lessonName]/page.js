import MainLayout from "@/components/layout/MainLayout";

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Lesson: {decodeURIComponent(lessonName)}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div>This is where the lesson content will go!</div>
          <div className="mt-4 text-gray-600">
            Currently studying: {decodeURIComponent(lessonName)}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
