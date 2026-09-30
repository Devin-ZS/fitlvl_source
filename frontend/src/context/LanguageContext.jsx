import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    home: 'Home',
    workouts: 'Workouts',
    quests: 'Quests',
    ranks: 'Ranks',
    profile: 'Profile',

    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    enterArena: 'Enter the Arena',
    startJourney: 'Start Your Journey',
    noAccount: 'No account? ',
    alreadyTraining: 'Already training? ',
    tagline: 'Level up your fitness journey',
    loading: 'Loading...',
    somethingWrong: 'Something went wrong',

    // Dashboard
    welcomeBack: 'Welcome back,',
    levelFighter: 'fighter.',
    levelProgress: 'Level Progress',
    toNextLevel: 'XP to next level',
    activeQuests: 'Active Quests',
    allQuests: 'All Quests',
    startWorkout: 'Start a Workout',
    startWorkoutSub: 'Choose from our templates',
    recentXP: 'Recent XP Activity',
    totalWorkouts: 'Workouts',
    dayStreak: 'Day Streak',
    totalXP: 'Total XP',
    badges: 'Badges',

    // Workouts
    programs: 'Programs',
    history: 'History',
    startWorkoutBtn: 'Start Workout',
    workoutInProgress: 'Workout in progress',
    finishWorkout: 'Finish',
    pause: 'Pause',
    resume: 'Resume',
    exercises: 'exercises',
    noWorkoutsYet: 'No workouts yet. Start your first one!',
    done: 'Done',
    sets: 'sets',
    reps: 'reps',
    rest: 'rest',
    duration: 'Duration',
    xpReward: 'XP Reward',
    difficulty: 'Difficulty',
    workoutComplete: 'Workout done!',

    // Quests
    questsSubtitle: 'Complete quests to earn bonus XP and level up faster',
    dailyQuests: 'Daily Quests',
    weeklyQuests: 'Weekly Quests',
    completed: 'Completed',
    noQuests: 'No quests available right now. Check back soon!',
    logProgress: 'Log +1',
    questComplete: 'Quest Complete:',

    // Leaderboard
    leaderboardTitle: 'Leaderboard',
    leaderboardSub: 'Top fighters ranked by total XP',
    you: 'YOU',

    // Profile
    editProfile: 'Edit',
    saveProfile: 'Save',
    noBio: 'No bio yet. Tell your fitness story!',
    earnedBadges: 'EARNED',
    lockedBadges: 'LOCKED',
    recentXPHistory: 'Recent XP',
    level: 'Level',

    // Misc
    keep: 'Keep pushing. Level',
    cancel: 'Cancel',
    loadingQuests: 'Loading quests...',
    loadingRankings: 'Loading rankings...',
  },

  mn: {
    // Navbar
    home: 'Нүүр',
    workouts: 'Дасгал',
    quests: 'Даалгавар',
    ranks: 'Рейтинг',
    profile: 'Профайл',

    // Auth
    login: 'Нэвтрэх',
    register: 'Бүртгүүлэх',
    email: 'И-мэйл',
    password: 'Нууц үг',
    username: 'Хэрэглэгчийн нэр',
    enterArena: 'Тэмцээнд орох',
    startJourney: 'Аяллаа эхлүүлэх',
    noAccount: 'Бүртгэл байхгүй юу? ',
    alreadyTraining: 'Аль хэдийн бүртгэлтэй юу? ',
    tagline: 'Фитнесийн аяллаа дараагийн түвшинд гаргаарай',
    loading: 'Ачааллаж байна...',
    somethingWrong: 'Алдаа гарлаа',

    // Dashboard
    welcomeBack: 'Тавтай морил,',
    levelFighter: 'дайчин.',
    levelProgress: 'Түвшний ахиц',
    toNextLevel: 'XP дараагийн түвшинд',
    activeQuests: 'Идэвхтэй даалгаварууд',
    allQuests: 'Бүх даалгавар',
    startWorkout: 'Дасгал эхлүүлэх',
    startWorkoutSub: 'Загваруудаас сонгоорой',
    recentXP: 'Сүүлийн XP үйл ажиллагаа',
    totalWorkouts: 'Дасгал',
    dayStreak: 'Өдрийн цуваа',
    totalXP: 'Нийт XP',
    badges: 'Медаль',

    // Workouts
    programs: 'Хөтөлбөр',
    history: 'Түүх',
    startWorkoutBtn: 'Дасгал эхлүүлэх',
    workoutInProgress: 'Дасгал үргэлжилж байна',
    finishWorkout: 'Дуусгах',
    pause: 'Зогсоох',
    resume: 'Үргэлжлүүлэх',
    exercises: 'дасгал',
    noWorkoutsYet: 'Одоогоор дасгал байхгүй. Эхнийхээ дасгалыг эхлүүлээрэй!',
    done: 'Дууссан',
    sets: 'давталт багц',
    reps: 'давталт',
    rest: 'амралт',
    duration: 'Үргэлжлэх хугацаа',
    xpReward: 'XP шагнал',
    difficulty: 'Хүндрэл',
    workoutComplete: 'Дасгал дууслаа!',

    // Quests
    questsSubtitle: 'Даалгаврууд гүйцэтгэж нэмэлт XP авч, илүү хурдан түвшингээ ахиулна уу',
    dailyQuests: 'Өдрийн даалгаварууд',
    weeklyQuests: 'Долоо хоногийн даалгаварууд',
    completed: 'Дууссан',
    noQuests: 'Одоогоор даалгавар байхгүй байна. Дараа дахин шалгаарай!',
    logProgress: '+1 бүртгэх',
    questComplete: 'Даалгавар дууслаа:',

    // Leaderboard
    leaderboardTitle: 'Рейтингийн самбар',
    leaderboardSub: 'Нийт XP-ээр эрэмбэлсэн шилдэг дайчид',
    you: 'ТА',

    // Profile
    editProfile: 'Засах',
    saveProfile: 'Хадгалах',
    noBio: 'Одоогоор bio байхгүй. Фитнесийн түүхээ бичээрэй!',
    earnedBadges: 'АВСАН',
    lockedBadges: 'ЦООЖТОЙ',
    recentXPHistory: 'Сүүлийн XP',
    level: 'Түвшин',

    // Misc
    keep: 'Амжилт хүсье. Түвшин',
    cancel: 'Цуцлах',
    loadingQuests: 'Даалгаврууд ачааллаж байна...',
    loadingRankings: 'Рейтинг ачааллаж байна...',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('fitlvl-lang') || 'en');

  const toggleLang = () => {
    const next = lang === 'en' ? 'mn' : 'en';
    setLang(next);
    localStorage.setItem('fitlvl-lang', next);
  };

  const t = (key) => translations[lang][key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isMn: lang === 'mn' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
