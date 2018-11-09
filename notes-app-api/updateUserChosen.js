import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "User",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userID: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET userStatus = :userStatus, userFirstName = :userFirstName, userLastName = :userLastName, userDepartment = :userDepartment, userDescription = :userDescription, userSkills = :userSkills",
    ExpressionAttributeValues: {
      ":userStatus": data.userStatus ? data.userStatus : null,
      ":userFirstName": data.userFirstName ? data.userFirstName : null,
      ":userLastName": data.userLastName ? data.userLastName : null,
    ":userDepartment": data.userDepartment ? data.userDepartment : null,
    ":userDescription": data.userDescription ? data.userDescription : null,
	  ":userSkills": data.userSkills ? data.userSkills : null
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