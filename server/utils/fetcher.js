const fetcherComplex = async (url) =>
  fetch(url)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
      throw r;
    })
    .then(({ message, data }) => data)
    .catch(async (err) => {
      if (err instanceof Error) {
        throw err;
      }
      throw await err.json().then((rJson) => {
        return new Error(
          `HTTP ${err.status} ${err.statusText}: ${rJson.message}`
        );
      });
    });

export const fetcher = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((res) => {
      return res.data || null;
    });

export default fetcherComplex;
