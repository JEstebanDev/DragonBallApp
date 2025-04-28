import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = "character";
export const handler = async (event, context) => {
    try {
        const method = event.requestContext.http.method;
        const id = event.queryStringParameters ? event.queryStringParameters.id : null;
        const body = event.body ? JSON.parse(event.body) : null;
        if (method === "POST") {
            return await createCharacter(body);
        } else if (method === "GET" && id) {
            return await getCharacter(id);
        } else if (method === "GET") {
            return await listCharacters();
        } else if (method === "PUT" && id) {
            return await updateCharacter(id, body);
        } else if (method === "DELETE" && id) {
            return await deleteCharacter(id);
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Bad Request" }),
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
// 🟢 Crear un personaje
const createCharacter = async (data) => {
    const newCharacter = {
        ...data,
        id: randomUUID(),
    };
    await ddbDocClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: newCharacter,
    }));
    return {
        statusCode: 201,
        body: JSON.stringify(newCharacter),
    };
};
// 🟡 Obtener un personaje
const getCharacter = async (id) => {
    const response = await ddbDocClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
    }));
    if (!response.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Character not found" }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify(response.Item),
    };
};
// 🟠 Listar todos los personajes
const listCharacters = async () => {
    const response = await ddbDocClient.send(new ScanCommand({
        TableName: TABLE_NAME,
    }));
    return {
        statusCode: 200,
        body: JSON.stringify(response.Items),
    };
};
// 🔵 Actualizar un personaje
const updateCharacter = async (id, data) => {
    const response = await ddbDocClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "set #name = :name, race = :race, powerLevel = :powerLevel, isVillain = :isVillain",
        ExpressionAttributeNames: {
            "#name": "name",
        },
        ExpressionAttributeValues: {
            ":name": data.name,
            ":race": data.race,
            ":powerLevel": data.powerLevel,
            ":isVillain": data.isVillain,
        },
        ReturnValues: "ALL_NEW",
    }));
    return {
        statusCode: 200,
        body: JSON.stringify(response.Attributes),
    };
};
// 🔴 Borrar un personaje
const deleteCharacter = async (id) => {
    await ddbDocClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
    }));
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Character deleted" }),
    };
};
