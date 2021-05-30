export default class Utils {

  public static shuffle(arr: any[]) {
    return arr.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);
  }

  public static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static chunk(array: any[], size: number) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
      const last = chunked_arr[chunked_arr.length - 1];
      if (!last || last.length === size) {
        chunked_arr.push([array[i]]);
      } else {
        last.push(array[i]);
      }
    }
    return chunked_arr;
  }
}