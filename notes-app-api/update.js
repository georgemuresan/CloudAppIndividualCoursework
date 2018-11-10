import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "Project",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userID: event.pathParameters.uid,
      projectID: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET projectName = :projectName, projectDescription = :projectDescription, attributes = :attributes, attachment = :attachment, collaborators = :collaborators, projectPendingCollaborators = :projectPendingCollaborators, projectStatus = :projectStatus",
    ExpressionAttributeValues: {
      ":attachment": data.attachment ? data.attachment : null,
      ":projectName": data.projectName ? data.projectName : null,
	  ":projectDescription": data.projectDescription ? data.projectDescription : null,
	  ":attributes": data.attributes ? data.attributes : null,
	  ":collaborators": data.collaborators ? data.collaborators : null,
    ":projectPendingCollaborators": data.projectPendingCollaborators ? data.projectPendingCollaborators : null,
    ":projectStatus": data.projectStatus ? data.projectStatus : null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}