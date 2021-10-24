export function debounce<T extends Function >(
  fn: T,
  timer: number
) {
  let timeoutId: NodeJS.Timeout;
  let triggered = false;
  console.log("Returning debounced function")
  let func = function (...args: any) {
    if (triggered) {

      console.log(`Clearing timeout : ${timeoutId}`)
      clearTimeout(timeoutId);
      triggered=false
    }

    timeoutId = setTimeout(() => {
      triggered = true;
      fn.call(null, ...args);
    }, timer);
    console.log(`Triggered with timeout: ${timeoutId}`)
  };

  return <T>(<any>func)
}
