export const split = (str: string) => {
  /* eslint-disable no-plusplus */
  /* eslint-disable no-continue */
  const results = [];
  let word = '';
  let validWord;
  for (let i = 0; i < str.length;) {
    if (/\s/.test(str[i])) {
      // Skips spaces.
      while (i < str.length && /\s/.test(str[i])) {
        i++;
      }
      results.push(word);
      word = '';
      validWord = false;
      continue;
    }

    if (str[i] === '"') {
      i++;
      while (i < str.length) {
        if (str[i] === '"') {
          validWord = true;
          break;
        }

        if (str[i] === '\\') {
          i++;
          word += str[i++];
          continue;
        }

        word += str[i++];
      }
      i++;
      continue;
    }

    if (str[i] === "'") {
      i++;
      while (i < str.length) {
        if (str[i] === "'") {
          validWord = true;
          break;
        }

        if (str[i] === '\\') {
          i++;
          word += str[i++];
          continue;
        }

        word += str[i++];
      }
      i++;
      continue;
    }

    if (str[i] === '\\') {
      i++;
      word += str[i++];
      continue;
    }
    validWord = true;
    word += str[i++];
  }
  if (validWord) {
    results.push(word);
  }
  return results;
};

export function encodeHTMLEntities(string: string, callback: (s: string) => {}) {
  callback(string.replace(
    /[\u00A0-\u2666<>\&]/g,
    c => `&${encodeHTMLEntities.entityTable[c.charCodeAt(0)] || `#${c.charCodeAt(0)}`};`,
  ));
}

encodeHTMLEntities.entityTable = {
  34: 'quot',
  38: 'amp',
  39: 'apos',
  60: 'lt',
  62: 'gt',
};

export function decodeHTMLEntities(string: string, callback: (s: string) => {}) {
  callback(string.replace(/\&(\w)*\;/g, c =>
    String.fromCharCode(decodeHTMLEntities.entityTable[c.substring(1, c.indexOf(';'))])));
}

decodeHTMLEntities.entityTable = {
  quot: 34,
  amp: 38,
  apos: 39,
  lt: 60,
  gt: 62,
};

export const containsConnection = (connectionList, object) => {
  let contains = false;
  connectionList.forEach((element) => {
    if (
      element.host === object.host &&
      element.port === object.port &&
      element.password === object.password &&
      element.dbIndex === object.dbIndex
    ) {
      contains = true;
    }
  });
  return contains;
};
