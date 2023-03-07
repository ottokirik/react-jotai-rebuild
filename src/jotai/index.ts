import { useSyncExternalStore } from "react";

interface Atom<T> {
  get(): T;
  set(newValue: T): void;
  subscribe(callback: (newValue: T) => void): () => void;
}

type AtomGetter<AtomType> = (
  get: <Target>(a: Atom<Target>) => Target
) => AtomType;

export const atom = <AtomType>(
  initValue: AtomType | AtomGetter<AtomType>
): Atom<AtomType> => {
  let value = typeof initValue === "function" ? (null as AtomType) : initValue;
  const subscribers = new Set<(newValue: AtomType) => void>();

  const get = <Target>(atom: Atom<Target>) => {
    let currentValue = atom.get();

    atom.subscribe((newValue) => {
      if (newValue === currentValue) return;

      currentValue = newValue;
      computeValue();
      subscribers.forEach((cb) => cb(value));
    });

    return currentValue;
  };

  const computeValue = () => {
    const newValue =
      typeof initValue === "function"
        ? (initValue as AtomGetter<AtomType>)(get)
        : initValue;

    // Promise
    if (newValue && typeof (newValue as any)?.then === "function") {
      value = null as AtomType;
      (newValue as any)?.then((resolveValue: any) => {
        value = resolveValue;
        subscribers.forEach((cb) => cb(value));
      });
    } else {
      value = newValue;
    }
  };

  computeValue();

  return {
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      subscribers.forEach((cb) => {
        cb(newValue);
      });
    },
    subscribe(callback) {
      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);
      };
    },
  };
};

export const useAtom = <T>(atom: Atom<T>): [T, (newValue: T) => void] => {
  return [useSyncExternalStore(atom.subscribe, atom.get), atom.set];
};

export const useAtomValue = <T>(atom: Atom<T>): T => {
  return useSyncExternalStore(atom.subscribe, atom.get);
};
