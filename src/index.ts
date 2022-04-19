
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

type First<T extends Array<any>> = T extends [] ? never : T[0]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3

