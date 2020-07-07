const fetcher = (url) =>
    fetch(url)
        .then((response) => response.json())
        .catch((err) => {});

export default fetcher;
