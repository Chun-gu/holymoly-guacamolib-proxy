import https from "https";
import fetch from "node-fetch";

export async function handler(event) {
  // console.log(event);
  const {
    path,
    headers: { authorization },
    httpMethod,
    body: requestBody,
    rawQuery,
  } = event;
  console.log('==============================requestBody==========================',requestBody);
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

  // const httpsAgent = new https.Agent({
  //   rejectUnauthorized: false,
  // });
  console.log(`${process.env.API_URL}${path}?${rawQuery}`);
  try {
    const response = await fetch(`${process.env.API_URL}${path}?${rawQuery}`, {
      // agent: httpsAgent,
      method: httpMethod,
      headers: {
        // Authorization: authorization,
        "Content-type": "application/json",
      },
      body: requestBody,
    });
    const { status, ok, headers } = response;
    const resJson = await response.json();
    // console.log(resJson)
    const body = JSON.stringify(resJson);
    headers["Access-Control-Allow-Origin"] = "*";
    headers["content-type"] = "application/json;charset=UTF-8";
    // console.log(headers);
    return {
      statusCode: status,
      ok,
      headers,
      body,
    };
  } catch (err) {
    // console.log(err);
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
