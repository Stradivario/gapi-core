import Container from "typedi";

export const Bootstrap = (App) => {
    const a = <any>Container.get(App);
    console.log(a);
    if (a.start) {
        console.log('111')
        a.start().then(data => console.log(data)).catch(e => console.log(e));
      
    } else {
        throw new Error('Missing start method')
    }
    return App;
};