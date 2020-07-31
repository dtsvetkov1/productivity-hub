
export const Query = {
    getTarget(_, variables, { cache }) {
        console.log('variables ', variables)
        // let target =  cache.readQuery({ query: GET_TARGETS })[variables.id]
        // return target
    }
};