import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import Exercise from '../types/Exercise';
import Profile from '../types/Profile';
import Test from '../types/Test';
import {
  CardioType,
  CoolDown,
  Goal,
  Level,
  StrengthArea,
  WarmUp,
} from '../types/Shared';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine, SavedTest, SavedWorkout} from '../types/SavedItem';
import Education from '../types/Education';
import Snackbar from 'react-native-snackbar';
import Chat from '../types/Chat';
import Message from '../types/Message';

export const getUser = (user: FirebaseAuthTypes.User) => {
  return db().collection('users').doc(user.uid).get();
};

export const setUser = (user: Profile) => {
  return db().collection('users').doc(user.uid).set(user);
};

export const updateUser = (user: Profile) => {
  return db().collection('users').doc(user.uid).update(user);
};

export const createUser = async (
  email: string,
  password: string,
  extraData: object,
) => {
  const {user} = await auth().createUserWithEmailAndPassword(email, password);
  await db()
    .collection('users')
    .doc(user.uid)
    .set({uid: user.uid, email: user.email, ...extraData});
  if (!user.emailVerified) {
    await user.sendEmailVerification();
  }
};

const getExercisesQuery = async (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
  warmUp: WarmUp[],
  coolDown: CoolDown[],
) => {
  let warmUpDocs: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] = [];
  let coolDownDocs: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[] = [];
  if (warmUp.length) {
    const warmUpQuery = await db()
      .collection('exercises')
      .where('warmUp', 'in', warmUp)
      .get();
    warmUpDocs = warmUpQuery.docs;
  }
  if (coolDown.length) {
    const coolDownQuery = await db()
      .collection('exercises')
      .where('coolDown', 'in', coolDown)
      .get();
    coolDownDocs = coolDownQuery.docs;
  }
  if (goal === Goal.STRENGTH) {
    const exercises = await db()
      .collection('exercises')
      .where('type', '==', goal)
      .where('area', '==', area)
      .where('level', '==', level)
      .get();
    return [...exercises.docs, ...warmUpDocs, ...coolDownDocs];
  }
  const exercises = await db()
    .collection('exercises')
    .where('type', '==', goal)
    .where('cardioType', '==', cardioType)
    .where('level', '==', level)
    .get();
  return [...exercises.docs, ...warmUpDocs, ...coolDownDocs];
};

export const getExercises = async (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
  warmUp: WarmUp[],
  coolDown: CoolDown[],
) => {
  const docs = await getExercisesQuery(
    level,
    goal,
    area,
    cardioType,
    warmUp,
    coolDown,
  );
  return docs.reduce((acc: {[id: string]: Exercise}, cur) => {
    const exercise: any = cur.data();
    acc[cur.id] = {...exercise, id: cur.id};
    return acc;
  }, {});
};

export const getExercisesById = async (ids: string[]) => {
  const snapshot = await db()
    .collection('exercises')
    .where(db.FieldPath.documentId(), 'in', ids)
    .get();
  return snapshot.docs.reduce((acc: {[id: string]: Exercise}, cur) => {
    const exercise: any = cur.data();
    acc[cur.id] = {...exercise, id: cur.id};
    return acc;
  }, {});
};

export const deleteExercise = (id: string) => {
  return db().collection('exercises').doc(id).delete();
};

export const addExercise = (exercise: Exercise) => {
  return db().collection('exercises').add(exercise);
};

export const updateExercise = (exercise: Exercise) => {
  return db().collection('exercises').doc(exercise.id).update(exercise);
};

export const getTests = async () => {
  const snapshot = await db().collection('tests').get();
  return snapshot.docs.reduce((acc: {[id: string]: Test}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {...test, id: cur.id};
    return acc;
  }, {});
};

export const getTestsById = async (ids: string[]) => {
  const snapshot = await db()
    .collection('tests')
    .where(db.FieldPath.documentId(), 'in', ids)
    .get();
  return snapshot.docs.reduce((acc: {[id: string]: Test}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {...test, id: cur.id};
    return acc;
  }, {});
};

export const getQuickRoutines = async () => {
  const snapshot = await db().collection('quickRoutines').get();
  return snapshot.docs.reduce((acc: {[id: string]: QuickRoutine}, cur) => {
    const quickRoutine: any = cur.data();
    acc[cur.id] = {...quickRoutine, id: cur.id};
    return acc;
  }, {});
};

export const getQuickRoutinesById = async (ids: string[]) => {
  const snapshot = await db()
    .collection('quickRoutines')
    .where(db.FieldPath.documentId(), 'in', ids)
    .get();
  return snapshot.docs.reduce((acc: {[id: string]: QuickRoutine}, cur) => {
    const quickRoutine: any = cur.data();
    acc[cur.id] = {...quickRoutine, id: cur.id};
    return acc;
  }, {});
};

export const isAdmin = async (uid: string) => {
  const admins = await db().collection('admins').get();
  const keys = admins.docs.map(doc => doc.id);
  return keys.includes(uid);
};

export const saveWorkout = (workout: SavedWorkout, uid: string) => {
  return db()
    .collection('users')
    .doc(uid)
    .collection('savedWorkouts')
    .add(workout);
};

export const saveTest = (test: SavedTest, uid: string) => {
  return db().collection('users').doc(uid).collection('savedTests').add(test);
};

export const saveQuickRoutine = (
  quickRoutine: SavedQuickRoutine,
  uid: string,
) => {
  return db()
    .collection('users')
    .doc(uid)
    .collection('savedQuickRoutines')
    .add(quickRoutine);
};

export const getSavedWorkouts = async (uid: string) => {
  const savedWorkouts = await db()
    .collection('users')
    .doc(uid)
    .collection('savedWorkouts')
    .limit(10)
    .get();
  return savedWorkouts.docs.reduce((acc: {[id: string]: SavedWorkout}, cur) => {
    const workout: any = cur.data();
    acc[cur.id] = {...workout, id: cur.id};
    return acc;
  }, {});
};

export const getSavedTests = async (uid: string) => {
  const savedTests = await db()
    .collection('users')
    .doc(uid)
    .collection('savedTests')
    .limit(10)
    .get();
  return savedTests.docs.reduce((acc: {[id: string]: SavedTest}, cur) => {
    const test: any = cur.data();
    acc[cur.id] = {...test, id: cur.id};
    return acc;
  }, {});
};

export const getSavedQuickRoutines = async (uid: string) => {
  const savedQuickRoutines = await db()
    .collection('users')
    .doc(uid)
    .collection('savedQuickRoutines')
    .limit(10)
    .get();
  return savedQuickRoutines.docs.reduce(
    (acc: {[id: string]: SavedQuickRoutine}, cur) => {
      const routine: any = cur.data();
      acc[cur.id] = {...routine, id: cur.id};
      return acc;
    },
    {},
  );
};

export const getEducation = async () => {
  const education = await db().collection('education').get();
  return education.docs.reduce((acc: {[id: string]: Education}, cur) => {
    const edu: any = cur.data();
    acc[cur.id] = {...edu, id: cur.id};
    return acc;
  }, {});
};

export const generateLink = async () => {
  try {
    const response = await functions().httpsCallable('generateLink')();
    return response.data.link;
  } catch (e) {
    Snackbar.show({text: 'Error generating link'});
  }
};

export const acceptInviteLink = async (value: string) => {
  const response = await functions().httpsCallable('acceptInviteLink')({
    value,
  });
  return response.data.user;
};

export const setFCMToken = (uid: string, FCMToken: string) => {
  return db().collection('users').doc(uid).update({FCMToken});
};

export const getConnections = async (uid: string) => {
  // const response = await functions().httpsCallable('getConnections')();
  // return response.data.users;
  const connections = await db()
    .collection('users')
    .doc(uid)
    .collection('connections')
    .limit(20)
    .get();
  const uids = connections.docs.map(doc => doc.data().uid);
  if (uids.length) {
    const userData = await db()
      .collection('users')
      .where(db.FieldPath.documentId(), 'in', uids)
      .get();
    const users = userData.docs.reduce((acc: {[key: string]: Profile}, cur) => {
      const user: any = cur.data();
      acc[cur.id] = user;
      return acc;
    }, {});
    return users;
  }
  return {};
};

export const getChats = async (uid: string) => {
  const idQuery = await db()
    .collection('users')
    .doc(uid)
    .collection('chats')
    .limit(20)
    .get();
  const ids = idQuery.docs.map(chat => chat.data().id);
  if (ids.length) {
    const chats = await db()
      .collection('chats')
      .where(db.FieldPath.documentId(), 'in', ids)
      .get();
    return chats.docs.reduce((acc: {[key: string]: Chat}, cur) => {
      const otherUid = cur.data().users.find((id: string) => id !== uid);
      const chat: any = {id: cur.id, ...cur.data()};
      acc[otherUid] = chat;
      return acc;
    }, {});
  }
  return {};
};

export const sendMessage = (
  message: Message,
  chatId: string,
  userId: string,
) => {
  return functions().httpsCallable('sendMessage')({message, chatId, userId});
};

export const setUnread = (uid: string, unread: {[key: string]: number}) => {
  return db().collection('users').doc(uid).update({unread});
};
