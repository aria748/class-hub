import { useState, useEffect } from "react";
import Papa from "papaparse";

export const useGoogleSheets = (csvUrl) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Papa.parse(csvUrl, {
      download: true,
      header: true, // Otomatis mengubah baris pertama menjadi key object
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      }
    });
  }, [csvUrl]);

  return { data, loading, error };
};