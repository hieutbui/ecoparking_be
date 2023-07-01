import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.js';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import utils from './utils.js';
import { print, OutputType } from './print.js';
import Exception from '../exceptions/Exception.js';

initializeApp(firebaseConfig);

const storage = getStorage();

/**
 * @author hieubt
 * @typedef UploadImageParams
 * @property {String} originalname
 * @property {String} mimetype
 * @property {Buffer} buffer
 * @property {String} email
 * @param {UploadImageParams} param
 * @returns {Promise<{downloadURL?: String}>}
 */
async function image({ originalname, mimetype, buffer, email }) {
  try {
    const dateTime = utils.getCurrentDateTime();

    const storageRef = ref(
      storage,
      `images/${email}/${originalname + ' ' + dateTime}`
    );

    /**
     * @description Create file metadata including the content type
     */
    const metadata = {
      contentType: mimetype,
    };

    /**
     * @description Upload the file in the bucket storage
     */
    const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);

    /**
     * @type {String}
     * @description Grab the public url
     */
    const downloadURL = await getDownloadURL(snapshot.ref);

    print('File successfully uploaded', OutputType.SUCCESS);

    return { downloadURL: downloadURL };
  } catch (error) {
    throw new Exception(Exception.SOMETHING_WRONG);
  }
}

export default {
  image,
};
