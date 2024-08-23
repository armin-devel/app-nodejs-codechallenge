const logger = (req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  console.log('Request Params:', req.params);
  console.log('Request Query:', req.query);

  const oldSend = res.send;

  res.send = function (data) {
    console.log(`Response Status: ${res.statusCode}`);
    console.log('Response Headers:', res.getHeaders());
    console.log('Response Body:', data);
    oldSend.apply(res, arguments);
  };

  next();
};

module.exports = logger;
