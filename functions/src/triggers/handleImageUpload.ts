import { firestore, storage as adminStorage } from 'firebase-admin';
import { logger, storage } from 'firebase-functions/v1';

export const handleImageUpload = storage.object().onFinalize(async object => {
  try {
    const { bucket, name, contentType } = object;

    if (!contentType?.includes('image')) {
      throw new Error('Uploaded file is not an image');
    }

    if (!name?.includes('users')) {
      throw new Error('Image is not a user avatar');
    }

    const owner = name.split('/')[1].split('.')[0];

    await firestore()
      .collection('users')
      .doc(owner)
      .set(
        {
          avatar: `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
            name
          )}?alt=media`,
        },
        { merge: true }
      );

    logger.info('Image uploaded to', bucket, name);
  } catch (error) {
    logger.error('Error.handleImageUpload(): ', error);
    await adminStorage().bucket().deleteFiles({
      prefix: object.name,
    });
    return 'Error uploading image';
  }
  return 'Image uploaded';
});
