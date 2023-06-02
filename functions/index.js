// import https from "https";
import fetch from "node-fetch";

export async function handler(event) {
  const {
    path,
    // 후에 authorization 기능 추가를 대비해 남겨둠
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

  // 서버가 현재 http라서 https 주석 처리
  // const httpsAgent = new https.Agent({
  //   rejectUnauthorized: false,
  // });

  try {
    let payload = {
      method: httpMethod,
      headers: { "content-type": "application/json" },
    };

    // 메서드가 GET이나 HEAD가 아닐 때만 body 첨부
    if (httpMethod !== "GET" && httpMethod !== "HEAD")
      payload = { ...payload, body: requestBody };

    const response = await fetch(
      `${process.env.API_URL}${path}?${rawQuery}`,
      payload
    );
    const { status, ok, headers } = response;

    const resJson = await response.json();
    const body = JSON.stringify(resJson);

    headers["Access-Control-Allow-Origin"] = "*";
    headers["content-type"] = "application/json;charset=UTF-8";

    return {
      statusCode: status,
      ok,
      headers,
      body,
    };
  } catch (err) {
    console.log("============ERROR============", err);

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
