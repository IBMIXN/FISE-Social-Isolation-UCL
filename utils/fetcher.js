const fetcher = async (url) =>
  fetch(url)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw r;
    })
    .then((json) => json.data)
    .catch(async (err) => {
      if (err instanceof Error) {
        throw err
      }
      throw await err.json().then((rJson) => {
        return new Error(`HTTP ${err.status} ${err.statusText}: ${rJson.msg}`);
      });
    });

export default fetcher;
