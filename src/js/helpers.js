// helper module contains reusable functions

import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// returns promise that will reject after stated amount of seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // show an alert with error message
    return data; // data resolved value of the promise that getJSON function returns
  } catch (err) {
    throw err; // promise that is being returned from getJSON will reject and error will be shown in model.js
  }
};

/*

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // show an alert with error message
    return data; // data resolved value of the promise that getJSON function returns
  } catch (err) {
    throw err; // promise that is being returned from getJSON will reject and error will be shown in model.js
  }
};

// sending JSON to API

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // show an alert with error message
    return data; // data resolved value of the promise that getJSON function returns
  } catch (err) {
    throw err; // promise that is being returned from getJSON will reject and error will be shown in model.js
  }
};

*/
