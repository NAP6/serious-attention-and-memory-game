async function post_api(url = "", data, ContentType = "application/json") {
  var response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
            "Content-type": `${ContentType}`,
          },
    });
    var json = response.json();
    return json;
}

export { post_api };
