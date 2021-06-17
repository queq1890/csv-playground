import { wrap, releaseProxy, Remote } from 'comlink';
import { useEffect, useMemo } from 'react';
import { WorkerType } from './uniquenessValidator.worker';

export const useUniquenessValidator = (): Remote<WorkerType> => {
  const { workerApi } = useWorker();
  return workerApi;
};

const useWorker = () => {
  const workerApiAndCleanup = useMemo(() => makeWorkerApiAndCleanup(), []);

  useEffect(() => {
    const { cleanup } = workerApiAndCleanup;

    return () => {
      cleanup();
    };
  }, [workerApiAndCleanup]);

  return workerApiAndCleanup;
};

const makeWorkerApiAndCleanup = () => {
  const worker = new Worker('./uniquenessValidator.worker', {
    name: 'my-first-worker',
    type: 'module',
  });
  const workerApi = wrap<WorkerType>(worker);

  // A cleanup function that releases the comlink proxy and terminates the worker
  const cleanup = () => {
    workerApi[releaseProxy]();
    worker.terminate();
  };

  const workerApiAndCleanup = { workerApi, cleanup };

  return workerApiAndCleanup;
};
