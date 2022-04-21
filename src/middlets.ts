
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

read.description = 'my'
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

let varA:deepRes = {
    x:{
        a: 1,
        b: 'hi'
    },
    y:'hey'
}

console.log(varA)

// 10.元组转合集
type TupleToUnion01<T extends any[]> = T[number] extends any[] ? TupleToUnion01<T[number]> : T[number]
type TupleToUnion02<T> = T extends [infer H, ...infer E] ? H | TupleToUnion<E> : never

type Arr01 = ['1', ['4', '2'], '3']

type Test01 = TupleToUnion01<Arr01> // "1" | ["4", "2"] | "3"
type Test02 = TupleToUnion02<Arr01> // "1" | ["4", "2"] | "3"

// 12.可串联构造器

type Chainable<T extends {} = {}> = {
    option<K extends string, V>(key:K, value:V):Chainable<T & {[k in K]:V}>
    get():T
}