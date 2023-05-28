import https from "https";
import fetch from "node-fetch";

export async function handler(event) {
  const {
    path,
    headers: { authorization },
    httpMethod,
    body: requestBody,
    rawQuery,
  } = event;

  if (httpMethod === "OPTIONS")
    return {
      statusCode: 200,
      ok: true,
      headers: {
        "Access-Control-Allow-Origin": process.env.HOST,
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  console.log(path, rawQuery);
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  try {
    const response = await fetch(`${process.env.API_URL}${path}?${rawQuery}`, {
      agent: httpsAgent,
      method: httpMethod,
      headers: {
        Authorization: authorization,
        "Content-type": "application/json",
      },
      body: requestBody,
    });
    const { status, ok, headers } = response;
    const resJson = await response.json();
    const body = JSON.stringify(resJson);
    console.log("status", status, "ok", ok, "body", body);
    headers["Access-Control-Allow-Origin"] = "*";
    return {
      statusCode: status,
      ok,
      headers,
      body,
    };
  } catch (err) {
    return {
      statusCode: 404,
      statusText: err.message,
      ok: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
