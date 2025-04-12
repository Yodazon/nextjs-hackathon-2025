"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  RiRobot2Line, 
  RiChat1Line, 
  RiTimeLine,
  RiBarChartBoxLine,
  RiErrorWarningLine,
  RiTokenIcon
} from "react-icons/ri";
import MainLayout from "../layout/MainLayout";

const UserStats = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    tokens: {
      openai: 0,
      elevenlabs: 0,
      total: 0
    },
    conversations: {
      conversational: 0,
      quiz: 0,
      total: 0
    },
    lastUpdated: null,
    elevenLabsUsage: {
      today: 0,
      historical: [],
      date: null
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/user/stats?userId=${session.user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        const data = await response.json();
        
        // Ensure data structure matches what we expect
        const formattedData = {
          tokens: {
            openai: data?.tokens?.openai || 0,
            elevenlabs: data?.tokens?.elevenlabs || 0,
            total: data?.tokens?.total || 0
          },
          conversations: {
            conversational: data?.conversations?.conversational || 0,
            quiz: data?.conversations?.quiz || 0,
            total: data?.conversations?.total || 0
          },
          lastUpdated: data?.lastUpdated || null,
          elevenLabsUsage: {
            today: data?.elevenLabsUsage?.today || 0,
            historical: data?.elevenLabsUsage?.historical || [],
            date: data?.elevenLabsUsage?.date || null
          }
        };
        
        setStats(formattedData);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [session?.user?.id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <RiErrorWarningLine className="text-red-500 mr-2" size={24} />
              <h2 className="text-xl font-semibold text-red-700">Error Loading Statistics</h2>
            </div>
            <p className="mt-2 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Your Usage Statistics</h1>
        
        {/* API Token Usage */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            
            API Token Usage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">OpenAI Tokens</div>
              <div className="text-2xl font-bold">{stats.tokens.openai.toLocaleString()}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600">ElevenLabs Characters</div>
              <div className="text-2xl font-bold">{stats.tokens.elevenlabs.toLocaleString()}</div>
              <div className="text-sm text-purple-500 mt-2">
                Today: {stats.elevenLabsUsage.today.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Total Usage</div>
              <div className="text-2xl font-bold">{stats.tokens.total.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* ElevenLabs Usage Details */}
        {stats.elevenLabsUsage.historical.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <RiRobot2Line className="mr-2" />
              ElevenLabs Usage Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Daily Average (Last 30 Days)</div>
                  <div className="text-xl font-bold">
                    {Math.round(stats.elevenLabsUsage.historical.reduce((sum, day) => sum + (day.character_count || 0), 0) / 30).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">characters per day</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Peak Usage</div>
                  <div className="text-xl font-bold">
                    {Math.max(...stats.elevenLabsUsage.historical.map(day => day.character_count || 0)).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">characters in a day</div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Usage Trend</div>
                <div className="h-32 flex items-end space-x-1">
                  {stats.elevenLabsUsage.usage?.slice(-7).map((day, index) => (
                    <div key={index} className="flex-1">
                      <div 
                        className="bg-purple-500 rounded-t"
                        style={{ 
                          height: `${Math.min(100, (day.usage || 0) / Math.max(...stats.elevenLabsUsage.usage.map(d => d.usage || 0)) * 100)}%` 
                        }}
                      />
                      <div className="text-xs text-center text-gray-500 mt-1">
                        {new Date(day.timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <RiChat1Line className="mr-2" />
            Conversation Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-indigo-600">Conversational Bot</div>
              <div className="text-2xl font-bold">{stats.conversations.conversational}</div>
              <div className="text-sm text-gray-500">chats</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-sm text-pink-600">Quiz Bot</div>
              <div className="text-2xl font-bold">{stats.conversations.quiz}</div>
              <div className="text-sm text-gray-500">quizzes</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600">Total Conversations</div>
              <div className="text-2xl font-bold">{stats.conversations.total}</div>
              <div className="text-sm text-gray-500">interactions</div>
            </div>
          </div>
        </div>

        {/* Usage Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <RiTimeLine className="mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <RiBarChartBoxLine className="text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="text-sm text-gray-500">
                  {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserStats; 