export const createError = (
  message: string,
  statusCode: number,
  errorCode = 'E0',
): Error => {
  return Object.assign(new Error(message), { statusCode, errorCode });
};
