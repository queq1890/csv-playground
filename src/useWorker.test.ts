import rewire from "rewire"
const useWorker = rewire("./useWorker")
const makeWorkerApiAndCleanup = useWorker.__get__("makeWorkerApiAndCleanup")
// @ponicode
describe("useWorker.useUniquenessValidator", () => {
    test("0", () => {
        let callFunction: any = () => {
            useWorker.useUniquenessValidator()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("makeWorkerApiAndCleanup", () => {
    test("0", () => {
        let callFunction: any = () => {
            makeWorkerApiAndCleanup()
        }
    
        expect(callFunction).not.toThrow()
    })
})
