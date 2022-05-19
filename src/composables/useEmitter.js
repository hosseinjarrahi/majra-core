import mitt from "mitt";

let emitter = mitt();
const lockedListeners = [];

export const listen = (event, fn, lock = false) => {
  event = Array.isArray(event) ? event : [event];
  for (const e of event) {
    emitter.on(e, fn);
    lock && lockedListeners.push(fn);
  }
};

export const event = (event, args) => {
  emitter.emit(event, args);
};

let fns = [];
export const runAfterPageChanged = (fn) => {
  fns.push(fn);
};

let fns2 = [];
export const runAfterPageLoaded = (fn) => {
  fns2.push(fn);
};

let fns3 = [];
export const runBeforeMajraInit = (fn) => {
  fns3.push(fn);
};

export const clear = (callback) => {
  emitter.all.clear();
  callback && callback();
  listen("beforeMajraInit", (args) => {
    fns3.forEach((fn) => fn(args));
    fns3 = [];
  });
  listen("majraMounted", (args) => {
    fns.forEach((fn) => fn(args));
    fns = [];
  });
  listen("majraDataLoaded", (args) => {
    fns2.forEach((fn) => fn(args));
    fns2 = [];
  });
  for (let fn of lockedListeners) listen(fn);
};

export function useEmitter() {
  return { listen, event, clear, emitter };
}
