import { useState } from "react";
import axios from "axios";

const usePost = () => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const postData = async (url: string, payload: unknown) => {
    setLoading(true);

    try {
      const response = await axios.post(url, payload);
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error as Error);
      return null; // this is to ensure that if !no data, we can use it conditonally on frontend
    } finally {
      setLoading(false);
    }
  };

  return { postData, data, loading, error };
};

export default usePost;
