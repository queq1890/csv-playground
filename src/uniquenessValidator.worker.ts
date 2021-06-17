import * as Comlink from 'comlink';
export interface WorkerType {
  validIdArray: string[];
  validate(idArray: string[]): boolean;
}

const uniquenessValidator: WorkerType = {
  validIdArray: [],
  validate(idArray: string[]) {
    if (this.validIdArray.some((id) => idArray.includes(id))) {
      this.validIdArray = [];
      return false;
    }

    this.validIdArray = this.validIdArray.concat(idArray);
    return true;
  },
};

Comlink.expose(uniquenessValidator);
