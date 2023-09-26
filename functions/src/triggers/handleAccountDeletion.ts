import { firestore, storage } from 'firebase-admin';
import { auth, logger } from 'firebase-functions/v1';

export const handleAccountDeletion = auth.user().onDelete(async user => {
  try {
    const { uid } = user;
    logger.info('Deleting account data for user', uid);

    const chats = (
      await firestore()
        .collection('chats')
        .where('members', 'array-contains', uid)
        .get()
    ).docs.map(doc => doc.ref.delete());

    await Promise.all([
      firestore().collection('users').doc(uid).delete(),
      ...chats,
      storage()
        .bucket()
        .deleteFiles({
          prefix: `users/${uid}`,
        }),
    ]);
  } catch (error) {
    logger.error('Error.handleAccountDeletion(): ', error);
    return 'Error deleting account data';
  }
  return 'Account deleted';
});
