const Joi = require('joi');

module.exports = Joi.object({
  AWS_REGION: Joi.string().required(),
  COGNITO_USER_POOL_ID: Joi.string().required(),
  COGNITO_USER_POOL_WEB_CLIENT_ID: Joi.string().required(),
  API_URI: Joi.string().required(),
  WS_URI: Joi.string().required(),
  GOOGLE_ANALYTICS_ID: Joi.string().required(),
});
