import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "User",
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userID: event.requestContext.identity.cognitoIdentityId,
      userEmail: data.userEmail,
      userStatus: data.userStatus,
      userFirstName: data.userFirstName,
      userLastName: data.userLastName,
      userDepartment: data.userDepartment,
      userDescription: data.userDescription,
	    userSkills: data.userSkills,
      joinedAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
	console.log(e);
    callback(null, failure({ status: false }));
  }
}