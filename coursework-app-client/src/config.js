export default {
	MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "project-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://z56998i0q7.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_QsZBC8vXq",
    APP_CLIENT_ID: "2rjag0has357017lbkool49l5j",
    IDENTITY_POOL_ID: "us-east-1:12f451ab-dc95-47ae-9281-d6ad1e90574e"
  }
};