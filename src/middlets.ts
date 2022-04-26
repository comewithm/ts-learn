
// 2.获取函数返回的类型
const fn = (v: boolean) => {
    if (v)
        return 1
    else
        return 2
}

type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any) => infer R ? R : never

type returnRes = MyReturnType<typeof fn> // 应推导出 "1 | 2"


// 3.Omit
interface Todo {
    title: string
    description: string
    completed: boolean
}

type MyOmit<T, U extends keyof T> = {
    [K in keyof T as (K extends U ? never : K)]: T[K]
}

// 集合T与集合K的补集
type MyExclude<T, K> = T extends K ? never : T

type MyOmit2<T, U extends keyof T> = {
    [K in MyExclude<keyof T, U>]: T[K]
}

type TodoPreview2 = MyOmit<Todo, 'description' | 'title'>
type TodoPreview3 = MyOmit2<Todo, 'description' | 'title'>

const todo11: TodoPreview2 = {
    completed: false,
}


// 8.readonly
// 设置默认值
type MyReadonly2<T, K extends keyof T = keyof T> = {
    readonly [U in K]: T[U]
} & {
        [U in MyExclude<keyof T, K>]: T[U]
    }

const read: MyReadonly2<Todo, 'description'> = {
    title: 'nick',
    description: 'name',
    completed: false
}

// read.description = 'my'
read.title = 'lucy'

// 9.深度readonly

type X = {
    x: {
        a: 1
        b: 'hi'
    }
    y: 'hey'
}

type DeepReadonly<T> = {
    readonly [U in keyof T]: T[U] extends any[] | Function
    ?
    T[U]
    : (T[U] extends Object ? DeepReadonly<T[U]> : T[U])
}

// type Expected = {
//     readonly x: {
//         readonly a: 1
//         readonly b: 'hi'
//     }
//     readonly y: 'hey'
// }

type deepRes = DeepReadonly<X> // should be same as `Expected`

let varA: deepRes = {
    x: {
        a: 1,
        b: 'hi'
    },
    y: 'hey'
}

console.log(varA)

// 10.元组转合集
type TupleToUnion01<T extends any[]> = T[number] extends any[] ? TupleToUnion01<T[number]> : T[number]
type TupleToUnion02<T> = T extends [infer H, ...infer E] ? H | TupleToUnion02<E> : never

type Arr01 = ['1', ['4', '2'], '3']

type Test01 = TupleToUnion01<Arr01> // "1" | ["4", "2"] | "3"
type Test02 = TupleToUnion02<Arr01> // "1" | ["4", "2"] | "3"

// 12.可串联构造器

type Chainable<T extends {} = {}> = {
    option<K extends string, V>(key: K, value: V): Chainable<T & { [k in K]: V }>
    get(): T
}


// 15.最后一个元素
type last1 = ['a', 'b', 'c']
type last2 = [3, 2, 1]

// 遍历数组,当数组中只有一个数时，X有值 Y为空 
// 判断Y的值是否为空
type Last<T extends any[]> = T extends [infer X, ...infer Y] ? (Y extends [] ? X : Last<Y>) : never
// 或者(扩展运算符)
type Last2<T extends any[]> = T extends [...infer X, infer Y] ? Y : never

type tail1 = Last<last1> // expected to be 'c'
type tail2 = Last<last2> // expected to be 1

type tail01 = Last2<last1> // expected to be 'c'
type tail02 = Last2<last2> // expected to be 1


// 16.出堆(实现一个通用Pop<T>，它接受一个数组T并返回一个没有最后一个元素的数组。)
type heap1 = ['a', 'b', 'c', 'd']
type heap2 = [3, 2, 1]

type Pop<T extends any[]> = T extends [...infer X, infer Y] ? X : never

type popRes1 = Pop<heap1> // expected to be ['a', 'b', 'c']
type popRes2 = Pop<heap2> // expected to be [3, 2]


// 20.Promise.all(函数)
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
});

// error(promiseAll是一个函数，接收promise数组入参，返回相应的类型，所以不是用type定义)
type PromiseAll<T extends any[]> = T extends [infer X, ...infer Y] ? X extends Promise<infer Z> ? [Z, ...PromiseAll<Y>] : [X, ...PromiseAll<Y>] : never
// type alls = PromiseAll<[promise1, promise2, promise3]>
// expected to be `Promise<[number, 42, string]>`
const p = Promise.all([promise1, promise2, promise3] as const)

// right
// declare function PromiseAll1<T extends unknown[]>(values: readonly [...T]): Promise<{ [K in keyof T]: T[K] extends Promise<infer R> ? R : T[K] }>

// const alls = PromiseAll1([promise1, promise2, promise3])


// 62.Type Lookup
// 此题为确定的type类型进行索引，若是不确定的类型，如何处理？？？
interface Cat {
    type: 'cat'
    breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
    type: 'dog'
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
    color: 'brown' | 'white' | 'black'
}

type LookUp<T extends {type: string}, K extends string> = T extends {type: K} ? T : never

type MyDogType = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
type MyCatType = LookUp<Cat | Dog, 'cat'> // expected to be `Cat`


// 106.Trim Left
type TrimLeft<T extends string> = T extends `${infer X}${infer Y}` ? (X extends ' ' ? TrimLeft<Y> : T) : never
// 更简便方式
type TrimLeft2<T extends string> = T extends `${' ' | '\n' | '\t'}${infer Y}` ? TrimLeft2<Y> : T

type trimleft = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '
type trimleft2 = TrimLeft2<'    hello world2  '>

// Trim right
type TrimRight<T extends string> = T extends `${infer X}${' ' | '\n' | '\t'}` ? TrimRight<X> : T
type trimright = TrimRight<'    hello world2  '>


// 108.Trim
type Char = ' ' | '\n' | '\t'
type Trim<T extends string> = T extends `${Char}${infer X}` ? Trim<X> : T extends `${infer Y}${Char}` ? Trim<Y> : T

// 先处理右边,在处理左边
type Trim2<T extends string> = TrimLeft<TrimRight<T>>

type trim = Trim<'  Hello my friend   '>
type trim2 = Trim2<'  Hello my friend   '>

// 110.Capitalize

type Dict = {
    'a': 'A',
    'b': 'B',
    'c': 'C',
    'd': 'D',
    'e': 'E',
    'f': 'F',
    'g': 'G',
    'h': 'H',
    'i': 'I',
    'j': 'J',
    'k': 'K',
    'l': 'L',
    'm': 'M',
    'n': 'N',
    'o': 'O',
    'p': 'P',
    'q': 'Q',
    'r': 'R',
    's': 'S',
    't': 'T',
    'u': 'U',
    'v': 'V',
    'w': 'W',
    'x': 'X',
    'y': 'Y',
    'z': 'Z'
}

type MyCapitalize<T extends string> = T extends `${infer X}${infer Y}` ? `${X extends keyof Dict ? Dict[X] : X}${Y}` : never
type capitalized = MyCapitalize<'hello world'> // expected to be 'Hello world'


//  116.Replace

type Replace<T extends string, U extends string, V extends string> = U extends '' ? T : T extends `${infer X}${U}${infer Y}` ? `${X}${V}${Y}` : T

type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'

// 119.ReplaceAll

type ReplaceAll<T extends string, U extends string, V extends string> = U extends '' ? T : T extends `${infer X}${U}${infer Y}` ? ReplaceAll<`${X}${V}${Y}`,U, V> : T
type place01 = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'

// 191.追加参数
type AppendArgument<F extends (...args:any[]) => any, P extends any> = F extends (...args: infer R) => infer Y ? (...args:[...R, P]) => Y : F

type Fn = (a: number, b: string) => number

type Result = AppendArgument<Fn, boolean> 
// 期望是 (a: number, b: string, x: boolean) => number

let fn2:Result = (x:number, y: string, z:boolean) => {
    return x
}

type OtherExclude<T, F> = T extends F ? never : T


// 296.联合类型的全排列
type MyPermutation<U, T = U> = [U] extends [never] ? [] : T extends infer R ? [R, ...MyPermutation<OtherExclude<U, R>>] : []

type perm = MyPermutation<'A' | 'B' | 'C'>;

// ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

// 298.length of string
// 字符串转数组,再拿数组长度
type StringToArray<T extends string> = T extends `${infer X}${infer Y}` ? [X, ...StringToArray<Y>] : []

type LensStr<T extends string> = (StringToArray<T>)['length']

type str01 = LensStr<'wanghuan'>

// 459.Flatten
type Flatten<T extends any[]> = T extends [infer X, ...infer Y] ? X extends any[] ? [...Flatten<X>, ...Flatten<Y>] : [X, ...Flatten<Y>] : []

type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]

type flatAny = Flatten<[{name:'nick'}, undefined, 12, [1,2,3]]> // [{name: 'nick';}, unknown, 12, 1, 2, 3]

// 527.Append to object
type Test = { id: '1' }

type AppendToObject<T extends object, K extends string, V> = {
    [U in keyof T | K]: U extends keyof T ? T[U] : V
} 

type AppRes = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }