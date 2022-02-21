async function post_api(url = "", data) {
  var response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
            "Content-type": "application/json; charset=UTF-7",
          },
    });
    var json = response.json();
    return json;
}

export { post_api };
