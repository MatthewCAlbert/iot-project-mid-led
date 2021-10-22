let hasTestFailed = false;

export const sequentialTest = (name: string, action: {(done?: jest.DoneCallback):any}) => {
  it(name, async () => {        
    if(hasTestFailed){
      console.warn(`[skipped]: ${name}`)} 
    else {
        try {         
          await action()} 
        catch (error) {           
          hasTestFailed = true
          throw error}            
    }
  })
}