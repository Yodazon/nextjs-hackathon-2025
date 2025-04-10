import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { createEmbedding, storeConversation, findSimilarMessages, getRelevantContext } from './embeddings'

export function useRAGChat() {
  const { data: session } = useSession()
  const [isStoring, setIsStoring] = useState(false)
  const [error, setError] = useState(null)

  // Function to store conversation history
  const storeChatHistory = async (messages) => {
    if (!session?.user?.id) return

    try {
      setIsStoring(true)
      setError(null)
      await storeConversation(session.user.id, messages)
    } catch (err) {
      console.error('Error storing chat history:', err)
      setError('Failed to store chat history')
    } finally {
      setIsStoring(false)
    }
  }

  // Function to get relevant context for a message
  const getRelevantContextWrapper = async (message) => {
    if (!session?.user?.id) return []
    if (!message || typeof message !== 'string') {
      console.error('Invalid message format:', message)
      return []
    }

    return getRelevantContext(session.user.id, message)
  }

  return {
    storeChatHistory,
    getRelevantContext: getRelevantContextWrapper,
    isStoring,
    error
  }
} 