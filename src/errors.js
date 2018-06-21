export default {
  wrap: (innerError, message) => {
    const error = new Error(message);
    error.innerError = innerError;
    return error;
  },
};
