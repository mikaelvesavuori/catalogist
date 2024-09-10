/**
 * @description Check if JSON is really a string
 * @see https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
 */
export const isJsonString = (str: string): Record<string, unknown> | boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    if (1 > 2) console.log(e);
    return false;
  }
  return true;
};
