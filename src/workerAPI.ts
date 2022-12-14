import { LambdaWorker } from '@libreservice/my-worker'

const worker = new LambdaWorker('/worker.js')

const setOption: (option: RIME_OPTION, value: boolean) => Promise<void> = worker.register('setOption')
const process: (input: string) => Promise<string> = worker.register('process')

export { setOption, process }
