const fetcher = async (url) =>
  fetch(url)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw r;
    })
    .then(({message, data}) => data)
    .catch(async (err) => {
      if (err instanceof Error) {
        throw err
      }
      throw await err.json().then((rJson) => {
        return new Error(`HTTP ${err.status} ${err.statusText}: ${rJson.message}`);
      });
    });

export default fetcher;
