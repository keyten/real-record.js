type ClassType = Function & { new(...args: any[]): any };

export function RealRecord<K extends string, T>(values: Record<K, T>, keytype: typeof String, valtype: ClassType): Record<string, T>;
export function RealRecord<K extends number, T>(values: Record<K, T>, keytype: typeof Number, valtype: ClassType): Record<number, T>;
export function RealRecord<K extends symbol, T>(values: Record<K, T>, keytype: typeof Symbol, valtype: ClassType): Record<symbol, T>;
export function RealRecord<K extends string | number | symbol, T>(
    values: Record<K, T>,
    keytype: typeof String | typeof Number | typeof Symbol,
    valtype: ClassType | { guard: (val: any) => val is T }
): Record<K, T> {
    const checkKey = (val: string | symbol): val is Exclude<K, number> => {
        switch(keytype) {
          case Number:
            return typeof val === 'string' && String(parseInt(val, 10)) === val;
          case String:
            return typeof val === 'string';
          case Symbol:
            return typeof val === 'symbol';
        }
        return false;
    };

    const checkVal = (val: unknown): val is T => {
      if ('guard' in valtype) {
        return valtype.guard(val);
      }

      if (val === null) {
        return false;
      }
      return Object.getPrototypeOf(val).constructor === valtype;
    }

    return new Proxy(values, {
        get: function(target, name) {
            if (!checkKey(name)) {
              throw new Error(`You must use type ${keytype.name} for keys.`);
            }
            return target[name];
        },

        set: function(target, name, val) {
            if (!checkKey(name)) {
                throw new Error(`You must use type ${keytype.name} for keys.`);
            }
            if (!checkVal(val)) {
                throw new Error('guard' in valtype ? `The type guard doesn't return true for property ${val}.` : `You must use type ${keytype.name} for keys.`);
            }
            target[name] = val;
            // typescript bug that requires returning boolean
            return true;
        }
    });
}
