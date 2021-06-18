import React, { useCallback } from 'react';
import Papa from 'papaparse';

const is12DigitsNumeric = (value: string) => {
  return /^-?\d{12}$/.test(value);
};

// onComplete みたいなcallback を受け取るようにすればabort 後の状態も取れる
const validateCSV = async (csv: File) => {
  let validIdArray: string[] = [];

  Papa.parse<string>(csv, {
    chunk: async (results, parser) => {
      const idArray = results.data.flat();

      if (idArray.some((id) => !is12DigitsNumeric(id))) {
        console.log('invalid value detected!');
        parser.abort();
        return;
      }

      validIdArray.some((id) => {
        const isUnique = !idArray.includes(id);

        if (!isUnique) {
          console.log('not unique value detected', id);
          parser.abort();
        }
        return isUnique;
      });

      validIdArray = validIdArray.concat(idArray);
    },
    complete: async () => {
      console.log('complete');
    },
    error: (error) => {
      console.log(error);
    },
    worker: true,
  });
};

const App = () => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const csv = event.target.files?.[0];
      if (!csv) return;
      validateCSV(csv);
    },
    []
  );

  return (
    <div className="App">
      <div>
        <input type="file" accept=".csv" onChange={handleChange} />
      </div>
    </div>
  );
};

export default App;
