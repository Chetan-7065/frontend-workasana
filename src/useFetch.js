import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useFetch(url, initialData) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const refetch = useCallback(() => {
    const token = localStorage.getItem("token");
    const controller = new AbortController();
    setLoading(true);
    axios(url, {
      headers: {
        signal: controller.signal,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setData(response.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
    return () => {
      controller.abort();
    };
  },[url])

  useEffect(() => {
    refetch()
  }, [refetch]);

  return {loading, data, error, refetch};
}

