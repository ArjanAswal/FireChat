import { firestore } from 'firebase-admin';
import { auth, logger } from 'firebase-functions/v1';

export const createAvatar = auth.user().onCreate(async user => {
  try {
    const { uid, photoURL } = user;
    logger.info('Creating avatar for user', uid);

    // generate random hex color
    const bgColor = Math.floor(Math.random() * 16777215).toString(16);
    const imageURL =
      photoURL ||
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${uid}&&backgroundColor=${bgColor}`;

    console.log({ avatar: imageURL }, { merge: true });

    await firestore()
      .collection('users')
      .doc(uid)
      .set({ avatar: imageURL }, { merge: true });

    console.log({ avatar: imageURL }, { merge: true });
  } catch (error) {
    logger.error('Error.createAvatar(): ', error);
    return 'Error creating avatar';
  }
  return 'Avatar created';
});
