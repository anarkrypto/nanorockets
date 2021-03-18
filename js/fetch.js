function postJson(url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(function (response) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (json) {
                    // process your JSON further
                    resolve(json)
                });
            } else {
                reject("Oops, we haven't got JSON!");
            }
        }).catch(function (error) {
            reject(error)
        })
    })
}
