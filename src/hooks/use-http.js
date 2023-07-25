
import { useState, useCallback } from "react";

const useHttp = () => {
    // const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    let isLoading = false;
  
    const sendRequest = useCallback(async (requestConfig, applyData, applyIsLoading) => {
      // setIsLoading(true);
      // isLoading = true;
      applyIsLoading(true)
      // console.log(isLoading)
      setError(null);
      try {
        const response = await fetch(
          requestConfig.url, {
            method: requestConfig.method ? requestConfig.method : 'GET',
            headers: requestConfig.headers ? requestConfig.headers : {},
            body: requestConfig.body ? JSON.stringify(requestConfig.body) : null
          }
        );
  
        if (!response.ok) {
          throw new Error('Request failed!');
        }
  
        const data = await response.json();
        applyData(data);
        
      } catch (err) {
        setError(err.message || 'Something went wrong!');
      }
      // setIsLoading(false);
      // isLoading = false;
      // applyIsLoading(false);

      // console.log('terminoo')
      // console.log(isLoading)

    }, []);

    return {
      isLoading,
      error,
      sendRequest
    }
}

export default useHttp;