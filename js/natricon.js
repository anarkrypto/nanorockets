let natricons = {}

function natricon(nano_address){

    return new Promise((resolve, reject) => {

        if (nano_address in natricons) return resolve (natricons[nano_address])

        const endpoint = "https://natricon.com/api/v1/nano"
        const params = "?address=" + nano_address
        const getNatricon = endpoint + params

        fetch(getNatricon, {
            method: 'GET',
        }).then(function (response) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("image/svg+xml") !== -1) {
                return response.blob().then(function (myBlob) {
                    const objectURL = URL.createObjectURL(myBlob);
                    natricons[nano_address] = objectURL
                    resolve(objectURL)
                });
            } else {
                reject("Oops, we haven't got a SVG!");
            }
        })
        .catch(function (error) {
            reject(error)
        })
    })
}

