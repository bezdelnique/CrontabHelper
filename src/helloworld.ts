// 
// https://www.surfsidemedia.in/post/creating-a-simple-web-application-with-typescript
// 
// https://dev.to/mariecolvinn/introduction-to-typescript-build-your-first-simple-web-application-1j5j
// 
// https://khalilstemmler.com/blogs/typescript/node-starter-project/
// https://github.com/stemmlerjs/simple-typescript-starter
//
// let message: string = 'Hello World';
// console.log(message);
// console.log(typeof null);
//
// let obj: Object = {
//     x: 0,
//     y: 0,
//     z: null,
// }
// console.log(obj.z===null);
//
// const x: 'hello world' = 'hello world';
//
// function f(y: 'hello world') {
//     console.log(y);
// }
//
// f(x)
//
interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}

console.log(getArea({ kind: "square", sideLength: 1 }));


function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

let names: Array<string> = ["Tom", "Bob", "Alice"];
console.log(firstElement(names));


