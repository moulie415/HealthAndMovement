import {Platform} from 'react-native';
// @ts-ignore
import GameCenter from 'react-native-game-center';
import {logError} from './error';

export interface IOSAchievement {
  showsCompletionBanner: boolean;
  lastReportedDate: number;
  completed: boolean;
  percentComplete: number;
  identifier: string;
}

export const initAchievements = async () => {
  try {
    if (Platform.OS === 'ios') {
      const leaderboardIdentifier = 'high_scores';
      const achievementIdentifier = 'novice_award';

      const result = await GameCenter.init({
        leaderboardIdentifier,
        achievementIdentifier,
      });
    } else {
    }
  } catch (e) {
    logError(e);
  }
};

export const getAchievements = async () => {
  try {
    if (Platform.OS === 'ios') {
      const achievements: IOSAchievement[] = await GameCenter.getAchievements();
      return achievements;
    } else {
    }
  } catch (e) {
    logError(e);
  }
};

export const openAchievementModal = async () => {
  try {
    if (Platform.OS === 'ios') {
      await GameCenter.openAchievementModal();
    }
  } catch (e) {
    logError(e);
  }
};

export const submitAchievementScore = async (
  percentComplete: number,
  achievementIdentifier: string,
) => {
  try {
    if (Platform.OS === 'ios') {
      const achievements = await GameCenter.submitAchievementScore({
        percentComplete,
        achievementIdentifier,
      });
      console.log(achievements)
    } else {
    }
  } catch (e) {
    logError(e);
  }
};

export const resetAchievements = async () => {
  try {
    if (Platform.OS === 'ios') {
      await GameCenter.resetAchievements();
    } else {
    }
  } catch (e) {
    logError(e);
  }
};
