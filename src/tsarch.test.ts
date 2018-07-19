interface TransferFunctionData {
  subjects: string[]
}

interface TransferFunction {
  (data: TransferFunctionData): TransferFunctionData
}

describe('Dummy test', () => {
  it('playground', () => {
    let fn: TransferFunction = (data: TransferFunctionData) => data

    let input: TransferFunctionData = {
      subjects: ['a', 'aaaaa', 'bbb', 'asdasd']
    }

    let filter: TransferFunction = (data: TransferFunctionData) => {
      data.subjects = data.subjects.filter(s => s.length > 3)
      return data
    }

    console.log(filter(fn(input)))
  })
})
