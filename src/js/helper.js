import * as config from './config';

///////////////////////////////////////

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // 1) decide if it (push data / get data), and store it in varable
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    
    // 2) race between API & timeout, than turn it into json
    const res = await Promise.race([fetchPro, timeout(config.TIMEOUT_SEC)]);
    const data = await res.json();

    // 3) throw if error
    if (!res.ok) throw new Error(data.message, res.status);

    // 4) return data
    return data;
  } catch (error) {
    throw error;
  };
};
