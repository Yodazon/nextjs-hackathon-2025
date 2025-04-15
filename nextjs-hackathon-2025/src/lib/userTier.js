import redis from './redis';

export const TIERS = {
  FREE: 'free',
  LEARNER: 'learner',
  BOOSTED_LEARNER: 'boosted_learner'
};

export async function getUserTier(userId) {
  try {
    const tier = await redis.get(`user:${userId}:tier`);
    return tier || TIERS.FREE;
  } catch (error) {
    console.error('Error getting user tier:', error);
    return TIERS.FREE;
  }
}

export async function setUserTier(userId, tier) {
  try {
    await redis.set(`user:${userId}:tier`, tier);
  } catch (error) {
    console.error('Error setting user tier:', error);
  }
}

export async function getUserLimits(userId) {
  const tier = await getUserTier(userId);
  
  const limits = {
    [TIERS.FREE]: {
      audioMessages: 10,
      contextSize: 'small',
      historyRetention: 'none',
      features: ['chat', 'quiz']
    },
    [TIERS.LEARNER]: {
      audioMessages: 50,
      contextSize: 'medium',
      historyRetention: 'weekly',
      features: ['chat', 'quiz', 'lesson_planner']
    },
    [TIERS.BOOSTED_LEARNER]: {
      audioMessages: 'unlimited',
      contextSize: 'large',
      historyRetention: 'forever',
      features: ['chat', 'quiz', 'lesson_planner', 'advanced_stats', 'feature_suggestions']
    }
  };

  return limits[tier];
}

export async function checkFeatureAccess(userId, feature) {
  const limits = await getUserLimits(userId);
  return limits.features.includes(feature);
} 