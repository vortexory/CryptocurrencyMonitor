export const validateFields = (fields: Array<any>) => {
  for (const field of fields) {
    if (field === undefined || field === null) {
      return false;
    }
  }
  return true;
};
