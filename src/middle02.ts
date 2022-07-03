
// 1130. ReplaceKeys

type ReplaceKeys<T, K extends string, V extends object> = T extends T 
    ?
        {
            [P in keyof T]: P extends K ? K extends keyof V ? V[K] : never :T[P] 
        }
    : 
        never

type NodeA = {
    type: 'A'
    name: string
    flag: number
  }
  
  type NodeB = {
    type: 'B'
    id: number
    flag: number
  }
  
  type NodeC = {
    type: 'C'
    name: string
    flag: number
  }
  
  
  type Nodes = NodeA | NodeB | NodeC
  
  type ReplacedNodes = ReplaceKeys<Nodes, 'name' | 'flag', {name: number, flag: string}> 
// {type: 'A', name: number, flag: string} | 
//   {type: 'B', id: number, flag: string} | 
// {type: 'C', name: number, flag: string} 
// would replace name from string to number, replace flag from number to string.
  
  type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', {aa: number}> 
  // {type: 'A', name: never, flag: number} | NodeB | 
//   {type: 'C', name: never, flag: number}
 // would replace name to never


// 1367. remove index signature

type Foo = {
    [key:string]: any,
    foo(): void
}

type RemoveIndexSignature<T extends object> = {
    [P in keyof T as P extends `${infer R}` ? R : never]:T[P]
}

type A1 = RemoveIndexSignature<Foo>


// 1978. percentage parser

type num = 1 | 2

type PercentageParser<T extends string> = T extends `${infer X}${infer Y}` ? [X,Y] extends [num]  : T;

type PString1 = ''
type PString2 = '+85%'
type PString3 = '-85%'
type PString4 = '85%'
type PString5 = '85'

type R1 = PercentageParser<PString1> // expected ['', '', '']
type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
type R5 = PercentageParser<PString5> // expected ["", "85", ""]



interface Moddel {
    name:string
    age:number
    locations: string[] | null
}

type ObjectEntries<T> = {
    
}