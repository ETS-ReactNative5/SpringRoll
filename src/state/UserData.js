import { BellhopSingleton } from '../communication/BellhopSingleton';
const onReturn = Symbol('onReturn');
const READ = 'userDataRead';
const WRITE = 'userDataWrite';
const DELETE = 'userDataRemove';

const IDBOPEN = 'openDb';
const IDBADD = 'addToDb';
const IDBDELETE = 'deleteFromDb';
const IDBREAD = 'readDb';
const IDBCURSOR = 'getCursorDb';
/**
 *
 * Manages data between SpringRoll Container and SpringRoll
 * @export
 * @class UserData
 */
export class UserData {
  /**
   * Handles return
   * @function
   * @memberof UserData
   * @name onReturn
   * @param {*} data
   * @param {number} [attempts=3]
   * @param {string} METHOD
   * @private
   * @returns
   * @static
   */
  static [onReturn](METHOD, data, attempts = 3) {
    return new Promise((resolve, reject) => {
      let success = false;
      let count = 0;

      const onReturn = event => {
        BellhopSingleton.off(METHOD, onReturn);
        success = true;
        resolve(event);
      };
      BellhopSingleton.on(METHOD, onReturn);

      BellhopSingleton.send(METHOD, data);

      const interval = setInterval(() => {
        if (success) {
          clearInterval(interval);
          return;
        }

        if (count >= attempts) {
          clearInterval(interval);
          BellhopSingleton.off(METHOD, onReturn);
          reject('No Response');
        }
        count++;
      }, 100);
    });
  }

  /**
   * Gets data from SpringRoll Container
   * @memberof UserData
   * @param {string} name
   * @return {Promise}
   * @static
   */
  static read(name) {
    if (!BellhopSingleton.connected) {
      const warning = `Could not complete read action for ${name}. Bellhop is not connected.`;
      return Promise.reject(warning);
    }

    return this[onReturn](READ, name)
      .then(({ data }) => {
        return data;
      });
  }

  /**
   * Sends data to SpringRoll Container
   * @memberof UserData
   * @param {*} value
   * @param {string} name
   * @returns {Promise}
   * @static
   */
  static write(name, value) {
    const warning = `Could not complete write action for ${name} with value ${value}. Bellhop is not connected.`;
    return BellhopSingleton.connected
      ? this[onReturn](WRITE, { name, value })
      : new Promise((_, reject) => reject(warning));
  }

  /**
   * Removes data from SpringRoll Container
   * @memberof UserData
   * @param {string} name
   * @static
   */
  static delete(name) {
    if (!BellhopSingleton.connected) {
      const warning = `Could not complete read action for ${name}. Bellhop is not connected.`;
      return Promise.reject(warning);
    }

    return this[onReturn](DELETE, name);
  }


  /**
   * Opens a connection with the indexedDB database
   * @memberof UserData
   * @param {string} name
   * @static
   */
  static openDb(dbName, dbVersion = null, additions = {}) {
    if (!BellhopSingleton.connected) {
      const warning = `Could not complete connect action for ${name}. Bellhop is not connected.`;
      return Promise.reject(warning);
    }

    return this[onReturn](IDBOPEN, {dbName: dbName, dbVersion: dbVersion, additions: additions });
  }

  /**
   * Adds a record to the indexedDB database
   * @memberof UserData
   * @param {string} name
   * @static
   */
  static addToStore(storeName, note) {
    if (!BellhopSingleton.connected) {
      const warning = `Could not complete connect action for ${name}. Bellhop is not connected.`;
      return Promise.reject(warning);
    }

    return this[onReturn](IDBADD, { storeName, note });
  }

  /**
   * Removes data from SpringRoll Container
   * @memberof UserData
   * @param {string} name
   * @static
   */
  static deleteFromStore(storeName, key) {
    if (!BellhopSingleton.connected) {
      const warning = `Could not complete connect action for ${name}. Bellhop is not connected.`;
      return Promise.reject(warning);
    }

    return this[onReturn](IDBDELETE, {storeName, key });
  }
  /**
   * Removes data from SpringRoll Container
   * @memberof UserData
   * @param {string} name
   * @static
   */
  static readFromStore(storeName, key) {
    if (!BellhopSingleton.connected) {
      const warning = `Could not complete connect action for ${name}. Bellhop is not connected.`;
      return Promise.reject(warning);
    }
    
    return this[onReturn](IDBREAD, {storeName, key });
  }

  /**
   * Create a cursor instance in container
   */
  static createCursor(storeName, key) {
    if (!BellhopSingleton.connected) {
      const warning = `Could not complete connect action for ${name}. Bellhop is not connected.`;
      return Promise.reject(warning);
    }

    return this[onReturn](IDBCURSOR, {storeName, key });
  }
}
export default UserData;

