exports.successResponse = (code, msg, data) => {
  return {
    code: code,
    error: false,
    message: msg,
    data: data,
  };
};

exports.errorResponse = (code, msg) => {
  return {
    code: code,
    error: true,
    message: msg,
  };
};
