export function reOrderArray<T>(
  oldIndex: number,
  newIndex: number,
  arr: Array<T>
): Array<T> {
  const result: Array<T> = [...arr];

  let counter = oldIndex;
  const temp = result[oldIndex];

  if (oldIndex == newIndex) {
    return result
  }

  if (oldIndex < newIndex) {
    while (counter < newIndex) {
      result[counter] = result[counter + 1];
      counter++;
    }
  }

  if (oldIndex > newIndex) {
    while (counter > newIndex) {
      result[counter] = result[counter - 1];
      counter--;
    }
  }


  result[counter] = temp;
  return result;
  
}
