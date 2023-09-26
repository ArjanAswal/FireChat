import { firestore } from 'firebase-admin';
import { auth, logger } from 'firebase-functions/v1';

export const createAvatar = auth.user().onCreate(async user => {
  try {
    const { uid, photoURL } = user;
    logger.info('Creating avatar for user', uid);

    // generate random hex color
    const bgColor = ((Math.random() * 0xffffff) << 0)
      .toString(16)
      .padStart(6, '0');

    const imageURL =
      photoURL ||
      `https://api.dicebear.com/7.x/lorelei/svg?seed=${uid}&&backgroundColor=${bgColor}`;

    await firestore()
      .collection('users')
      .doc(uid)
      .set({ avatar: imageURL }, { merge: true });
  } catch (error) {
    logger.error('Error.createAvatar(): ', error);
    return 'Error creating avatar';
  }
  return 'Avatar created';
});
