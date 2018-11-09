import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: "Project",
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
      projectID: uuid.v1(),
      projectStatus: data.projectStatus,
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      attributes: data.attributes,
      attachment: data.attachment,
      collaborators: data.collaborators,
      projectPendingCollaborators: data.projectPendingCollaborators,
      createdAt: Date.now()
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