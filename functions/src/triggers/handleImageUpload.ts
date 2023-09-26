import { firestore, storage as adminStorage } from 'firebase-admin';
import { logger, storage } from 'firebase-functions/v1';

export const handleImageUpload = storage.object().onFinalize(async object => {
  try {
    const { bucket, name, owner, contentType } = object;

    if (!contentType?.includes('image')) {
      throw new Error('Uploaded file is not an image');
    }

    if (!name?.includes('users')) {
      throw new Error('Image is not a user avatar');
    }

    if (!owner || !owner.entityId) {
      throw new Error('Image has no owner');
    }

    if (name.split('/')[1].split('.')[0] !== owner.entityId) {
      throw new Error('Image owner does not match');
    }

    await firestore()
      .collection('users')
      .doc(owner?.entityId)
      .set(
        { avatar: `https://storage.googleapis.com/${bucket}/${name}` },
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
