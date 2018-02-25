import Container from "typedi";

export const Bootstrap = (App) => {
    const a = <any>Container.get(App);
    console.log(a);
    if (a.start) {
        a.start();
    } else {
        throw new Error('Missing start method')
    }
    return App;
};