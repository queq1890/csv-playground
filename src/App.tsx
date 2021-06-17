import React, { useCallback } from 'react';
import Papa from 'papaparse';

import Worker from './uniquenessValidator.worker';

const is12DigitsNumeric = (value: string) => {
  return /^-?\d{12}$/.test(value);
};

const validateCSV = (csv: File) => {
  let validIdArray: string[] = [];

  Papa.parse<string>(csv, {
    chunk: (results, parser) => {
      const idArray = results.data.flat();

      if (
        idArray.some((id) => {
          return !is12DigitsNumeric(id);

          // return validIdArray.includes(id); // uniqueness validation
        })
      ) {
        console.log('invalid value detected!');
        parser.abort();
      }
      validIdArray = validIdArray.concat(idArray);
    },
    complete: () => {
      console.log('complete');
      console.log(validIdArray);
      validIdArray = [];
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
