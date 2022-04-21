
// 数组转元组

type Arr = ['qqq', '36', '3']

type TupleToUnion2<T extends any[]> = T[number]

type TupleToUnion<T extends any[]> = keyof {
    [P in T[number]]: P
}

type p = TupleToUnion<Arr>

type p2 = TupleToUnion2<Arr>


// isNever
type isNever<T> = [T] extends [never] ? true : false
type isNever2<T> = { [key: string]: T } extends { [key: string]: never } ? true : false

type A = isNever<never>
type B = isNever2<never>


// 4.Picker
interface Todo {
    title: string
    description: string
    completed: boolean
}

type MyPick<T, U extends keyof T> = {
    [K in U]: T[K]
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'nick',
    completed: false
}


// 7.readonly

interface Todo2 {
    title: string
    description: string
}

type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]
}


const todo2: MyReadonly<Todo2> = {
    title: "Hey",
    description: "foobar"
}

// todo2.title = "Hello" // Error: cannot reassign a readonly property
// todo2.description = "barFoo" // Error: cannot reassign a readonly property


// 11.元组转为对象
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type TupleToObject<T extends readonly any[]> = {
    [K in T[number]]:K
}

const a = typeof tuple

type result = TupleToObject<typeof tuple> 
// expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

// 14.第一个元素

type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type First<T extends any[]> = T extends [] ? never : T[0]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3


// 18.获取元组长度
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type Length<T extends readonly any[]> = T['length']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5


// 43.exclude

type newArr1 = 'one' | 'two' | 'three'

type newArr2 = 'one'

type myExclude<T, U> = T extends U ? never : T

type cludeArr = myExclude<newArr1, newArr2> // 'two' | 'three'


// 189.awaited
type Twait<T extends Promise<any>> = T extends Promise<infer U> ? (U extends Promise<any> ? Twait<U> : U) : never



// 268.IF判断

// type IF<U extends boolean, T, F> = [U] extends [true] ? T : F
type IF<U extends boolean, T, F> = U extends true ? T : F

type ifA = IF<true, 'a', 'b'>
type ifB = IF<false, 'a', 'b'>

// 533.concat 合并为一个新的数组
// 若是2个数组的合并
type ConcaArray<T extends any[], F extends any[]> = [...T, ...F]
type arrRes = ConcaArray<[1, 2], [3, 4]>
// 任意类型合并数组
type Concat<T, F> = T extends any[] ? F extends any[] ? [...T, ...F] : [...T, F] : F extends any[] ? [T, ...F] : [T, F]
type concatRes = Concat<1, {name:'nick',age:20}>


// 898.include
type Include<A extends any[], K> = K extends A[number] ? true : false

type IsEqual<A, B> = [A, B] extends [B, A] ? true : false

// 递归数组遍历 是否有该属性
type Include2<T extends readonly any[], U> = T extends [infer X, ...infer Y] ? (IsEqual<X, U> extends true ? true : Include2<Y, U>) : false

type isPillar = Include<[{name:'nick'}, 'age'], 'age'>

type isPillar2 = Include2<['name', 'age', {name:'nick', age:20}], 'name'>


// 3057.push
type Push<T extends any[], F> = [...T, F]

type pushRes = Push<[1,2,3], {name:'nick'}>

// 3060.Unshift
type Unshift<T extends any[], F> = [F, ...T]

type shiftRes = Unshift<[1,3], 2>

declare function f1(params:{a:number, b:string}):void

// 3312.Parameters
type Parameter<T extends (...args:any[]) => any> = T extends (...args:infer R) => any ? R : never
type T0 = Parameter<()=>string>
type T1 = Parameter<(s:string) => void>
type T2 = Parameter<<T>(arg:T) => T>
type T3 = Parameter<typeof f1>

// type T4 = Parameter<string> //Type 'string' does not satisfy the constraint '(...args: any) => any'.