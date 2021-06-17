import React, { useCallback } from 'react';
import Papa from 'papaparse';
import { useUniquenessValidator } from './useWorker';
import { Remote } from 'comlink';
import { WorkerType } from './uniquenessValidator.worker';

const is12DigitsNumeric = (value: string) => {
  return /^-?\d{12}$/.test(value);
};

const validateCSV = async (csv: File, workerApi: Remote<WorkerType>) => {
  Papa.parse<string>(csv, {
    chunk: async (results, parser) => {
      const idArray = results.data.flat();

      if (idArray.some((id) => !is12DigitsNumeric(id))) {
        console.log('invalid value detected!');
        parser.abort();
        return;
      }

      const isUnique = await workerApi.validate(idArray);

      if (!isUnique) {
        console.log('not unique value detected');
        parser.abort();
        return;
      }
    },
    complete: async () => {
      console.log('complete');
      console.log('for real');
      console.log(await workerApi.validIdArray);
      console.log('please resolve');
    },
    error: (error) => {
      console.log(error);
    },
    worker: true,
  });
};

const App = () => {
  const workerApi = useUniquenessValidator();
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const csv = event.target.files?.[0];
      if (!csv) return;
      validateCSV(csv, workerApi);
    },
    [workerApi]
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
