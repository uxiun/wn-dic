
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'uxiun',
  applicationName: 'apollo-lambda',
  appUid: 'q4MnPXS3BlKF5J2X2s',
  orgUid: '98a90039-5e8e-4aa0-87ee-549796dd2bd2',
  deploymentUid: '6fad1259-cd2e-4318-9c5f-0f78f9cc2c14',
  serviceName: 'apollo-lambda',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '6.2.2',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'apollo-lambda-dev-graphql', timeout: 6 };

try {
  const userHandler = require('./graphql.js');
  module.exports.handler = serverlessSDK.handler(userHandler.graphqlHandler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}