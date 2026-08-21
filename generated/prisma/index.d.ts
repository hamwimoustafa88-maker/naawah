
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ObituaryStat
 * إحصاءات مجهولة الهوية عند كل تصدير — بلا أي بيان عن الفقيد أو محتوى النعوة.
 */
export type ObituaryStat = $Result.DefaultSelection<Prisma.$ObituaryStatPayload>
/**
 * Model Template
 * 
 */
export type Template = $Result.DefaultSelection<Prisma.$TemplatePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more ObituaryStats
 * const obituaryStats = await prisma.obituaryStat.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more ObituaryStats
   * const obituaryStats = await prisma.obituaryStat.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.obituaryStat`: Exposes CRUD operations for the **ObituaryStat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ObituaryStats
    * const obituaryStats = await prisma.obituaryStat.findMany()
    * ```
    */
  get obituaryStat(): Prisma.ObituaryStatDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.template`: Exposes CRUD operations for the **Template** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Templates
    * const templates = await prisma.template.findMany()
    * ```
    */
  get template(): Prisma.TemplateDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ObituaryStat: 'ObituaryStat',
    Template: 'Template'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "obituaryStat" | "template"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ObituaryStat: {
        payload: Prisma.$ObituaryStatPayload<ExtArgs>
        fields: Prisma.ObituaryStatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObituaryStatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObituaryStatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>
          }
          findFirst: {
            args: Prisma.ObituaryStatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObituaryStatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>
          }
          findMany: {
            args: Prisma.ObituaryStatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>[]
          }
          create: {
            args: Prisma.ObituaryStatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>
          }
          createMany: {
            args: Prisma.ObituaryStatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObituaryStatCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>[]
          }
          delete: {
            args: Prisma.ObituaryStatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>
          }
          update: {
            args: Prisma.ObituaryStatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>
          }
          deleteMany: {
            args: Prisma.ObituaryStatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObituaryStatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ObituaryStatUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>[]
          }
          upsert: {
            args: Prisma.ObituaryStatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObituaryStatPayload>
          }
          aggregate: {
            args: Prisma.ObituaryStatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObituaryStat>
          }
          groupBy: {
            args: Prisma.ObituaryStatGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObituaryStatGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObituaryStatCountArgs<ExtArgs>
            result: $Utils.Optional<ObituaryStatCountAggregateOutputType> | number
          }
        }
      }
      Template: {
        payload: Prisma.$TemplatePayload<ExtArgs>
        fields: Prisma.TemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findFirst: {
            args: Prisma.TemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findMany: {
            args: Prisma.TemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          create: {
            args: Prisma.TemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          createMany: {
            args: Prisma.TemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          delete: {
            args: Prisma.TemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          update: {
            args: Prisma.TemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          deleteMany: {
            args: Prisma.TemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          upsert: {
            args: Prisma.TemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          aggregate: {
            args: Prisma.TemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplate>
          }
          groupBy: {
            args: Prisma.TemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    obituaryStat?: ObituaryStatOmit
    template?: TemplateOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model ObituaryStat
   */

  export type AggregateObituaryStat = {
    _count: ObituaryStatCountAggregateOutputType | null
    _min: ObituaryStatMinAggregateOutputType | null
    _max: ObituaryStatMaxAggregateOutputType | null
  }

  export type ObituaryStatMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    ipHash: string | null
    country: string | null
    region: string | null
    templateId: string | null
  }

  export type ObituaryStatMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    ipHash: string | null
    country: string | null
    region: string | null
    templateId: string | null
  }

  export type ObituaryStatCountAggregateOutputType = {
    id: number
    createdAt: number
    ipHash: number
    country: number
    region: number
    templateId: number
    _all: number
  }


  export type ObituaryStatMinAggregateInputType = {
    id?: true
    createdAt?: true
    ipHash?: true
    country?: true
    region?: true
    templateId?: true
  }

  export type ObituaryStatMaxAggregateInputType = {
    id?: true
    createdAt?: true
    ipHash?: true
    country?: true
    region?: true
    templateId?: true
  }

  export type ObituaryStatCountAggregateInputType = {
    id?: true
    createdAt?: true
    ipHash?: true
    country?: true
    region?: true
    templateId?: true
    _all?: true
  }

  export type ObituaryStatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObituaryStat to aggregate.
     */
    where?: ObituaryStatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObituaryStats to fetch.
     */
    orderBy?: ObituaryStatOrderByWithRelationInput | ObituaryStatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObituaryStatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObituaryStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObituaryStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ObituaryStats
    **/
    _count?: true | ObituaryStatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObituaryStatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObituaryStatMaxAggregateInputType
  }

  export type GetObituaryStatAggregateType<T extends ObituaryStatAggregateArgs> = {
        [P in keyof T & keyof AggregateObituaryStat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObituaryStat[P]>
      : GetScalarType<T[P], AggregateObituaryStat[P]>
  }




  export type ObituaryStatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObituaryStatWhereInput
    orderBy?: ObituaryStatOrderByWithAggregationInput | ObituaryStatOrderByWithAggregationInput[]
    by: ObituaryStatScalarFieldEnum[] | ObituaryStatScalarFieldEnum
    having?: ObituaryStatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObituaryStatCountAggregateInputType | true
    _min?: ObituaryStatMinAggregateInputType
    _max?: ObituaryStatMaxAggregateInputType
  }

  export type ObituaryStatGroupByOutputType = {
    id: string
    createdAt: Date
    ipHash: string | null
    country: string | null
    region: string | null
    templateId: string
    _count: ObituaryStatCountAggregateOutputType | null
    _min: ObituaryStatMinAggregateOutputType | null
    _max: ObituaryStatMaxAggregateOutputType | null
  }

  type GetObituaryStatGroupByPayload<T extends ObituaryStatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObituaryStatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObituaryStatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObituaryStatGroupByOutputType[P]>
            : GetScalarType<T[P], ObituaryStatGroupByOutputType[P]>
        }
      >
    >


  export type ObituaryStatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    ipHash?: boolean
    country?: boolean
    region?: boolean
    templateId?: boolean
  }, ExtArgs["result"]["obituaryStat"]>

  export type ObituaryStatSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    ipHash?: boolean
    country?: boolean
    region?: boolean
    templateId?: boolean
  }, ExtArgs["result"]["obituaryStat"]>

  export type ObituaryStatSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    ipHash?: boolean
    country?: boolean
    region?: boolean
    templateId?: boolean
  }, ExtArgs["result"]["obituaryStat"]>

  export type ObituaryStatSelectScalar = {
    id?: boolean
    createdAt?: boolean
    ipHash?: boolean
    country?: boolean
    region?: boolean
    templateId?: boolean
  }

  export type ObituaryStatOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "ipHash" | "country" | "region" | "templateId", ExtArgs["result"]["obituaryStat"]>

  export type $ObituaryStatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ObituaryStat"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      ipHash: string | null
      country: string | null
      region: string | null
      templateId: string
    }, ExtArgs["result"]["obituaryStat"]>
    composites: {}
  }

  type ObituaryStatGetPayload<S extends boolean | null | undefined | ObituaryStatDefaultArgs> = $Result.GetResult<Prisma.$ObituaryStatPayload, S>

  type ObituaryStatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ObituaryStatFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ObituaryStatCountAggregateInputType | true
    }

  export interface ObituaryStatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ObituaryStat'], meta: { name: 'ObituaryStat' } }
    /**
     * Find zero or one ObituaryStat that matches the filter.
     * @param {ObituaryStatFindUniqueArgs} args - Arguments to find a ObituaryStat
     * @example
     * // Get one ObituaryStat
     * const obituaryStat = await prisma.obituaryStat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObituaryStatFindUniqueArgs>(args: SelectSubset<T, ObituaryStatFindUniqueArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ObituaryStat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ObituaryStatFindUniqueOrThrowArgs} args - Arguments to find a ObituaryStat
     * @example
     * // Get one ObituaryStat
     * const obituaryStat = await prisma.obituaryStat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObituaryStatFindUniqueOrThrowArgs>(args: SelectSubset<T, ObituaryStatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ObituaryStat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObituaryStatFindFirstArgs} args - Arguments to find a ObituaryStat
     * @example
     * // Get one ObituaryStat
     * const obituaryStat = await prisma.obituaryStat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObituaryStatFindFirstArgs>(args?: SelectSubset<T, ObituaryStatFindFirstArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ObituaryStat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObituaryStatFindFirstOrThrowArgs} args - Arguments to find a ObituaryStat
     * @example
     * // Get one ObituaryStat
     * const obituaryStat = await prisma.obituaryStat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObituaryStatFindFirstOrThrowArgs>(args?: SelectSubset<T, ObituaryStatFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ObituaryStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObituaryStatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ObituaryStats
     * const obituaryStats = await prisma.obituaryStat.findMany()
     * 
     * // Get first 10 ObituaryStats
     * const obituaryStats = await prisma.obituaryStat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const obituaryStatWithIdOnly = await prisma.obituaryStat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ObituaryStatFindManyArgs>(args?: SelectSubset<T, ObituaryStatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ObituaryStat.
     * @param {ObituaryStatCreateArgs} args - Arguments to create a ObituaryStat.
     * @example
     * // Create one ObituaryStat
     * const ObituaryStat = await prisma.obituaryStat.create({
     *   data: {
     *     // ... data to create a ObituaryStat
     *   }
     * })
     * 
     */
    create<T extends ObituaryStatCreateArgs>(args: SelectSubset<T, ObituaryStatCreateArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ObituaryStats.
     * @param {ObituaryStatCreateManyArgs} args - Arguments to create many ObituaryStats.
     * @example
     * // Create many ObituaryStats
     * const obituaryStat = await prisma.obituaryStat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObituaryStatCreateManyArgs>(args?: SelectSubset<T, ObituaryStatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ObituaryStats and returns the data saved in the database.
     * @param {ObituaryStatCreateManyAndReturnArgs} args - Arguments to create many ObituaryStats.
     * @example
     * // Create many ObituaryStats
     * const obituaryStat = await prisma.obituaryStat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ObituaryStats and only return the `id`
     * const obituaryStatWithIdOnly = await prisma.obituaryStat.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObituaryStatCreateManyAndReturnArgs>(args?: SelectSubset<T, ObituaryStatCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ObituaryStat.
     * @param {ObituaryStatDeleteArgs} args - Arguments to delete one ObituaryStat.
     * @example
     * // Delete one ObituaryStat
     * const ObituaryStat = await prisma.obituaryStat.delete({
     *   where: {
     *     // ... filter to delete one ObituaryStat
     *   }
     * })
     * 
     */
    delete<T extends ObituaryStatDeleteArgs>(args: SelectSubset<T, ObituaryStatDeleteArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ObituaryStat.
     * @param {ObituaryStatUpdateArgs} args - Arguments to update one ObituaryStat.
     * @example
     * // Update one ObituaryStat
     * const obituaryStat = await prisma.obituaryStat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObituaryStatUpdateArgs>(args: SelectSubset<T, ObituaryStatUpdateArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ObituaryStats.
     * @param {ObituaryStatDeleteManyArgs} args - Arguments to filter ObituaryStats to delete.
     * @example
     * // Delete a few ObituaryStats
     * const { count } = await prisma.obituaryStat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObituaryStatDeleteManyArgs>(args?: SelectSubset<T, ObituaryStatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObituaryStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObituaryStatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ObituaryStats
     * const obituaryStat = await prisma.obituaryStat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObituaryStatUpdateManyArgs>(args: SelectSubset<T, ObituaryStatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ObituaryStats and returns the data updated in the database.
     * @param {ObituaryStatUpdateManyAndReturnArgs} args - Arguments to update many ObituaryStats.
     * @example
     * // Update many ObituaryStats
     * const obituaryStat = await prisma.obituaryStat.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ObituaryStats and only return the `id`
     * const obituaryStatWithIdOnly = await prisma.obituaryStat.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ObituaryStatUpdateManyAndReturnArgs>(args: SelectSubset<T, ObituaryStatUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ObituaryStat.
     * @param {ObituaryStatUpsertArgs} args - Arguments to update or create a ObituaryStat.
     * @example
     * // Update or create a ObituaryStat
     * const obituaryStat = await prisma.obituaryStat.upsert({
     *   create: {
     *     // ... data to create a ObituaryStat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ObituaryStat we want to update
     *   }
     * })
     */
    upsert<T extends ObituaryStatUpsertArgs>(args: SelectSubset<T, ObituaryStatUpsertArgs<ExtArgs>>): Prisma__ObituaryStatClient<$Result.GetResult<Prisma.$ObituaryStatPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ObituaryStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObituaryStatCountArgs} args - Arguments to filter ObituaryStats to count.
     * @example
     * // Count the number of ObituaryStats
     * const count = await prisma.obituaryStat.count({
     *   where: {
     *     // ... the filter for the ObituaryStats we want to count
     *   }
     * })
    **/
    count<T extends ObituaryStatCountArgs>(
      args?: Subset<T, ObituaryStatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObituaryStatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ObituaryStat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObituaryStatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObituaryStatAggregateArgs>(args: Subset<T, ObituaryStatAggregateArgs>): Prisma.PrismaPromise<GetObituaryStatAggregateType<T>>

    /**
     * Group by ObituaryStat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObituaryStatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObituaryStatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObituaryStatGroupByArgs['orderBy'] }
        : { orderBy?: ObituaryStatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObituaryStatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObituaryStatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ObituaryStat model
   */
  readonly fields: ObituaryStatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ObituaryStat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObituaryStatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ObituaryStat model
   */
  interface ObituaryStatFieldRefs {
    readonly id: FieldRef<"ObituaryStat", 'String'>
    readonly createdAt: FieldRef<"ObituaryStat", 'DateTime'>
    readonly ipHash: FieldRef<"ObituaryStat", 'String'>
    readonly country: FieldRef<"ObituaryStat", 'String'>
    readonly region: FieldRef<"ObituaryStat", 'String'>
    readonly templateId: FieldRef<"ObituaryStat", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ObituaryStat findUnique
   */
  export type ObituaryStatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * Filter, which ObituaryStat to fetch.
     */
    where: ObituaryStatWhereUniqueInput
  }

  /**
   * ObituaryStat findUniqueOrThrow
   */
  export type ObituaryStatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * Filter, which ObituaryStat to fetch.
     */
    where: ObituaryStatWhereUniqueInput
  }

  /**
   * ObituaryStat findFirst
   */
  export type ObituaryStatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * Filter, which ObituaryStat to fetch.
     */
    where?: ObituaryStatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObituaryStats to fetch.
     */
    orderBy?: ObituaryStatOrderByWithRelationInput | ObituaryStatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObituaryStats.
     */
    cursor?: ObituaryStatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObituaryStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObituaryStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObituaryStats.
     */
    distinct?: ObituaryStatScalarFieldEnum | ObituaryStatScalarFieldEnum[]
  }

  /**
   * ObituaryStat findFirstOrThrow
   */
  export type ObituaryStatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * Filter, which ObituaryStat to fetch.
     */
    where?: ObituaryStatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObituaryStats to fetch.
     */
    orderBy?: ObituaryStatOrderByWithRelationInput | ObituaryStatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ObituaryStats.
     */
    cursor?: ObituaryStatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObituaryStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObituaryStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObituaryStats.
     */
    distinct?: ObituaryStatScalarFieldEnum | ObituaryStatScalarFieldEnum[]
  }

  /**
   * ObituaryStat findMany
   */
  export type ObituaryStatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * Filter, which ObituaryStats to fetch.
     */
    where?: ObituaryStatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ObituaryStats to fetch.
     */
    orderBy?: ObituaryStatOrderByWithRelationInput | ObituaryStatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ObituaryStats.
     */
    cursor?: ObituaryStatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ObituaryStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ObituaryStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ObituaryStats.
     */
    distinct?: ObituaryStatScalarFieldEnum | ObituaryStatScalarFieldEnum[]
  }

  /**
   * ObituaryStat create
   */
  export type ObituaryStatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * The data needed to create a ObituaryStat.
     */
    data: XOR<ObituaryStatCreateInput, ObituaryStatUncheckedCreateInput>
  }

  /**
   * ObituaryStat createMany
   */
  export type ObituaryStatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ObituaryStats.
     */
    data: ObituaryStatCreateManyInput | ObituaryStatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ObituaryStat createManyAndReturn
   */
  export type ObituaryStatCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * The data used to create many ObituaryStats.
     */
    data: ObituaryStatCreateManyInput | ObituaryStatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ObituaryStat update
   */
  export type ObituaryStatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * The data needed to update a ObituaryStat.
     */
    data: XOR<ObituaryStatUpdateInput, ObituaryStatUncheckedUpdateInput>
    /**
     * Choose, which ObituaryStat to update.
     */
    where: ObituaryStatWhereUniqueInput
  }

  /**
   * ObituaryStat updateMany
   */
  export type ObituaryStatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ObituaryStats.
     */
    data: XOR<ObituaryStatUpdateManyMutationInput, ObituaryStatUncheckedUpdateManyInput>
    /**
     * Filter which ObituaryStats to update
     */
    where?: ObituaryStatWhereInput
    /**
     * Limit how many ObituaryStats to update.
     */
    limit?: number
  }

  /**
   * ObituaryStat updateManyAndReturn
   */
  export type ObituaryStatUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * The data used to update ObituaryStats.
     */
    data: XOR<ObituaryStatUpdateManyMutationInput, ObituaryStatUncheckedUpdateManyInput>
    /**
     * Filter which ObituaryStats to update
     */
    where?: ObituaryStatWhereInput
    /**
     * Limit how many ObituaryStats to update.
     */
    limit?: number
  }

  /**
   * ObituaryStat upsert
   */
  export type ObituaryStatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * The filter to search for the ObituaryStat to update in case it exists.
     */
    where: ObituaryStatWhereUniqueInput
    /**
     * In case the ObituaryStat found by the `where` argument doesn't exist, create a new ObituaryStat with this data.
     */
    create: XOR<ObituaryStatCreateInput, ObituaryStatUncheckedCreateInput>
    /**
     * In case the ObituaryStat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObituaryStatUpdateInput, ObituaryStatUncheckedUpdateInput>
  }

  /**
   * ObituaryStat delete
   */
  export type ObituaryStatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
    /**
     * Filter which ObituaryStat to delete.
     */
    where: ObituaryStatWhereUniqueInput
  }

  /**
   * ObituaryStat deleteMany
   */
  export type ObituaryStatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ObituaryStats to delete
     */
    where?: ObituaryStatWhereInput
    /**
     * Limit how many ObituaryStats to delete.
     */
    limit?: number
  }

  /**
   * ObituaryStat without action
   */
  export type ObituaryStatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ObituaryStat
     */
    select?: ObituaryStatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ObituaryStat
     */
    omit?: ObituaryStatOmit<ExtArgs> | null
  }


  /**
   * Model Template
   */

  export type AggregateTemplate = {
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  export type TemplateMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type TemplateMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: string | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type TemplateCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    category: number
    isDefault: number
    createdAt: number
    _all: number
  }


  export type TemplateMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    isDefault?: true
    createdAt?: true
  }

  export type TemplateMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    isDefault?: true
    createdAt?: true
  }

  export type TemplateCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    isDefault?: true
    createdAt?: true
    _all?: true
  }

  export type TemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Template to aggregate.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Templates
    **/
    _count?: true | TemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateMaxAggregateInputType
  }

  export type GetTemplateAggregateType<T extends TemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplate[P]>
      : GetScalarType<T[P], AggregateTemplate[P]>
  }




  export type TemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithAggregationInput | TemplateOrderByWithAggregationInput[]
    by: TemplateScalarFieldEnum[] | TemplateScalarFieldEnum
    having?: TemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateCountAggregateInputType | true
    _min?: TemplateMinAggregateInputType
    _max?: TemplateMaxAggregateInputType
  }

  export type TemplateGroupByOutputType = {
    id: string
    slug: string
    name: string
    category: string
    isDefault: boolean
    createdAt: Date
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  type GetTemplateGroupByPayload<T extends TemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateGroupByOutputType[P]>
        }
      >
    >


  export type TemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    isDefault?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    isDefault?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    isDefault?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    isDefault?: boolean
    createdAt?: boolean
  }

  export type TemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "name" | "category" | "isDefault" | "createdAt", ExtArgs["result"]["template"]>

  export type $TemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Template"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      category: string
      isDefault: boolean
      createdAt: Date
    }, ExtArgs["result"]["template"]>
    composites: {}
  }

  type TemplateGetPayload<S extends boolean | null | undefined | TemplateDefaultArgs> = $Result.GetResult<Prisma.$TemplatePayload, S>

  type TemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TemplateCountAggregateInputType | true
    }

  export interface TemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Template'], meta: { name: 'Template' } }
    /**
     * Find zero or one Template that matches the filter.
     * @param {TemplateFindUniqueArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateFindUniqueArgs>(args: SelectSubset<T, TemplateFindUniqueArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Template that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TemplateFindUniqueOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateFindFirstArgs>(args?: SelectSubset<T, TemplateFindFirstArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Templates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Templates
     * const templates = await prisma.template.findMany()
     * 
     * // Get first 10 Templates
     * const templates = await prisma.template.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateWithIdOnly = await prisma.template.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateFindManyArgs>(args?: SelectSubset<T, TemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Template.
     * @param {TemplateCreateArgs} args - Arguments to create a Template.
     * @example
     * // Create one Template
     * const Template = await prisma.template.create({
     *   data: {
     *     // ... data to create a Template
     *   }
     * })
     * 
     */
    create<T extends TemplateCreateArgs>(args: SelectSubset<T, TemplateCreateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Templates.
     * @param {TemplateCreateManyArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateCreateManyArgs>(args?: SelectSubset<T, TemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Templates and returns the data saved in the database.
     * @param {TemplateCreateManyAndReturnArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Template.
     * @param {TemplateDeleteArgs} args - Arguments to delete one Template.
     * @example
     * // Delete one Template
     * const Template = await prisma.template.delete({
     *   where: {
     *     // ... filter to delete one Template
     *   }
     * })
     * 
     */
    delete<T extends TemplateDeleteArgs>(args: SelectSubset<T, TemplateDeleteArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Template.
     * @param {TemplateUpdateArgs} args - Arguments to update one Template.
     * @example
     * // Update one Template
     * const template = await prisma.template.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateUpdateArgs>(args: SelectSubset<T, TemplateUpdateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Templates.
     * @param {TemplateDeleteManyArgs} args - Arguments to filter Templates to delete.
     * @example
     * // Delete a few Templates
     * const { count } = await prisma.template.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateDeleteManyArgs>(args?: SelectSubset<T, TemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateUpdateManyArgs>(args: SelectSubset<T, TemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates and returns the data updated in the database.
     * @param {TemplateUpdateManyAndReturnArgs} args - Arguments to update many Templates.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, TemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Template.
     * @param {TemplateUpsertArgs} args - Arguments to update or create a Template.
     * @example
     * // Update or create a Template
     * const template = await prisma.template.upsert({
     *   create: {
     *     // ... data to create a Template
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Template we want to update
     *   }
     * })
     */
    upsert<T extends TemplateUpsertArgs>(args: SelectSubset<T, TemplateUpsertArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateCountArgs} args - Arguments to filter Templates to count.
     * @example
     * // Count the number of Templates
     * const count = await prisma.template.count({
     *   where: {
     *     // ... the filter for the Templates we want to count
     *   }
     * })
    **/
    count<T extends TemplateCountArgs>(
      args?: Subset<T, TemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemplateAggregateArgs>(args: Subset<T, TemplateAggregateArgs>): Prisma.PrismaPromise<GetTemplateAggregateType<T>>

    /**
     * Group by Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateGroupByArgs['orderBy'] }
        : { orderBy?: TemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Template model
   */
  readonly fields: TemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Template.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Template model
   */
  interface TemplateFieldRefs {
    readonly id: FieldRef<"Template", 'String'>
    readonly slug: FieldRef<"Template", 'String'>
    readonly name: FieldRef<"Template", 'String'>
    readonly category: FieldRef<"Template", 'String'>
    readonly isDefault: FieldRef<"Template", 'Boolean'>
    readonly createdAt: FieldRef<"Template", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Template findUnique
   */
  export type TemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findUniqueOrThrow
   */
  export type TemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findFirst
   */
  export type TemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findFirstOrThrow
   */
  export type TemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findMany
   */
  export type TemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter, which Templates to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template create
   */
  export type TemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data needed to create a Template.
     */
    data: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
  }

  /**
   * Template createMany
   */
  export type TemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template createManyAndReturn
   */
  export type TemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template update
   */
  export type TemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data needed to update a Template.
     */
    data: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
    /**
     * Choose, which Template to update.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template updateMany
   */
  export type TemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
  }

  /**
   * Template updateManyAndReturn
   */
  export type TemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
  }

  /**
   * Template upsert
   */
  export type TemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The filter to search for the Template to update in case it exists.
     */
    where: TemplateWhereUniqueInput
    /**
     * In case the Template found by the `where` argument doesn't exist, create a new Template with this data.
     */
    create: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
    /**
     * In case the Template was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
  }

  /**
   * Template delete
   */
  export type TemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Filter which Template to delete.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template deleteMany
   */
  export type TemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Templates to delete
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to delete.
     */
    limit?: number
  }

  /**
   * Template without action
   */
  export type TemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ObituaryStatScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    ipHash: 'ipHash',
    country: 'country',
    region: 'region',
    templateId: 'templateId'
  };

  export type ObituaryStatScalarFieldEnum = (typeof ObituaryStatScalarFieldEnum)[keyof typeof ObituaryStatScalarFieldEnum]


  export const TemplateScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    category: 'category',
    isDefault: 'isDefault',
    createdAt: 'createdAt'
  };

  export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ObituaryStatWhereInput = {
    AND?: ObituaryStatWhereInput | ObituaryStatWhereInput[]
    OR?: ObituaryStatWhereInput[]
    NOT?: ObituaryStatWhereInput | ObituaryStatWhereInput[]
    id?: StringFilter<"ObituaryStat"> | string
    createdAt?: DateTimeFilter<"ObituaryStat"> | Date | string
    ipHash?: StringNullableFilter<"ObituaryStat"> | string | null
    country?: StringNullableFilter<"ObituaryStat"> | string | null
    region?: StringNullableFilter<"ObituaryStat"> | string | null
    templateId?: StringFilter<"ObituaryStat"> | string
  }

  export type ObituaryStatOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    ipHash?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    templateId?: SortOrder
  }

  export type ObituaryStatWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ObituaryStatWhereInput | ObituaryStatWhereInput[]
    OR?: ObituaryStatWhereInput[]
    NOT?: ObituaryStatWhereInput | ObituaryStatWhereInput[]
    createdAt?: DateTimeFilter<"ObituaryStat"> | Date | string
    ipHash?: StringNullableFilter<"ObituaryStat"> | string | null
    country?: StringNullableFilter<"ObituaryStat"> | string | null
    region?: StringNullableFilter<"ObituaryStat"> | string | null
    templateId?: StringFilter<"ObituaryStat"> | string
  }, "id">

  export type ObituaryStatOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    ipHash?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    templateId?: SortOrder
    _count?: ObituaryStatCountOrderByAggregateInput
    _max?: ObituaryStatMaxOrderByAggregateInput
    _min?: ObituaryStatMinOrderByAggregateInput
  }

  export type ObituaryStatScalarWhereWithAggregatesInput = {
    AND?: ObituaryStatScalarWhereWithAggregatesInput | ObituaryStatScalarWhereWithAggregatesInput[]
    OR?: ObituaryStatScalarWhereWithAggregatesInput[]
    NOT?: ObituaryStatScalarWhereWithAggregatesInput | ObituaryStatScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ObituaryStat"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ObituaryStat"> | Date | string
    ipHash?: StringNullableWithAggregatesFilter<"ObituaryStat"> | string | null
    country?: StringNullableWithAggregatesFilter<"ObituaryStat"> | string | null
    region?: StringNullableWithAggregatesFilter<"ObituaryStat"> | string | null
    templateId?: StringWithAggregatesFilter<"ObituaryStat"> | string
  }

  export type TemplateWhereInput = {
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    id?: StringFilter<"Template"> | string
    slug?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    category?: StringFilter<"Template"> | string
    isDefault?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
  }

  export type TemplateOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type TemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    name?: StringFilter<"Template"> | string
    category?: StringFilter<"Template"> | string
    isDefault?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
  }, "id" | "slug">

  export type TemplateOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    _count?: TemplateCountOrderByAggregateInput
    _max?: TemplateMaxOrderByAggregateInput
    _min?: TemplateMinOrderByAggregateInput
  }

  export type TemplateScalarWhereWithAggregatesInput = {
    AND?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    OR?: TemplateScalarWhereWithAggregatesInput[]
    NOT?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Template"> | string
    slug?: StringWithAggregatesFilter<"Template"> | string
    name?: StringWithAggregatesFilter<"Template"> | string
    category?: StringWithAggregatesFilter<"Template"> | string
    isDefault?: BoolWithAggregatesFilter<"Template"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
  }

  export type ObituaryStatCreateInput = {
    id?: string
    createdAt?: Date | string
    ipHash?: string | null
    country?: string | null
    region?: string | null
    templateId: string
  }

  export type ObituaryStatUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    ipHash?: string | null
    country?: string | null
    region?: string | null
    templateId: string
  }

  export type ObituaryStatUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
  }

  export type ObituaryStatUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
  }

  export type ObituaryStatCreateManyInput = {
    id?: string
    createdAt?: Date | string
    ipHash?: string | null
    country?: string | null
    region?: string | null
    templateId: string
  }

  export type ObituaryStatUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
  }

  export type ObituaryStatUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: StringFieldUpdateOperationsInput | string
  }

  export type TemplateCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type TemplateUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    category: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type TemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateManyInput = {
    id?: string
    slug: string
    name: string
    category: string
    isDefault?: boolean
    createdAt?: Date | string
  }

  export type TemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ObituaryStatCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    ipHash?: SortOrder
    country?: SortOrder
    region?: SortOrder
    templateId?: SortOrder
  }

  export type ObituaryStatMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    ipHash?: SortOrder
    country?: SortOrder
    region?: SortOrder
    templateId?: SortOrder
  }

  export type ObituaryStatMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    ipHash?: SortOrder
    country?: SortOrder
    region?: SortOrder
    templateId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TemplateCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type TemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type TemplateMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}