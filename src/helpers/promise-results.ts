export async function promiseResults<T>(
  results: PromiseSettledResult<T>[]
): Promise<T[]> {
  return (
    results
      // figure out this
      .filter((result): result is PromiseFulfilledResult<T> => {
        if (result.status === "rejected") {
          console.error("Risk evaluation partial failure:", result.reason);
          return false;
        }
        return true;
      })
      .map((result) => result.value)
  );
}
