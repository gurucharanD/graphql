//named exports ,you can have as many as needed
const message='see message from mymodule.js'
const name='guru'
const location='hyderabad'
const getGreeting= (name)=>{
  return `welcome ${name}`
}
export {
    message,
    name,
    getGreeting,
    location as default
}

//default export it has no name and you can have only one
 