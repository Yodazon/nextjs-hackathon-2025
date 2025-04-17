"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SignOutButton from "@/components/SignOutButton";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  const { data: session, status } = useSession();

  // Hardcoded progress data for now
  const progressData = {
    completedLessons: 3,
    totalLessons: 10,
    currentStreak: 5,
    totalPoints: 120,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {status === "loading" ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : !session ? (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Verbalo
          </h2>

          <p className="text-gray-600 mb-4">Start learning by speaking </p>

          <p className="text-gray-600 mb-8">Sign in below</p>

          <Link
            href="/auth/signin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <MainLayout>
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Completed Lessons</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {progressData.completedLessons}/{progressData.totalLessons}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-green-600">
                    {progressData.currentStreak} days
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {progressData.totalPoints}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round(
                      (progressData.completedLessons /
                        progressData.totalLessons) *
                        100
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/lessons" className="group">
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Image
                        src="/images/school.svg"
                        alt="Lessons"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                        Lessons
                      </h3>
                      <p className="text-sm text-gray-600">
                        Continue your learning journey
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/stats" className="group">
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Image
                        src="/images/chart.svg"
                        alt="Stats"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600">
                        Stats
                      </h3>
                      <p className="text-sm text-gray-600">
                        View your learning analytics
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/chat" className="group">
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Image
                        src="/images/bot.svg"
                        alt="AI Chat"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
                        AI Chat
                      </h3>
                      <p className="text-sm text-gray-600">
                        Chat with your AI learning assistant
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/settings" className="group">
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Image
                        src="/images/settings.svg"
                        alt="Settings"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600">
                        Settings
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage your preferences
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </MainLayout>
      )}
    </div>
  );
}
