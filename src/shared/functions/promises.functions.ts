/* eslint-disable prettier/prettier */
/**
 * Resolves multiple promises and returns an array of their results.
 *
 * @param promises - An array of promises to resolve.
 * @returns A promise that resolves to an array of the results from the input promises.
 */
export function resolveMultiplePromises(promises: Promise<any>[]): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
        Promise.all(promises)
            .then((results) => {
                resolve(results);
            })
            .catch((error) => {
                reject(error);
                console.error(error);

            });
    })
}

export function resolveMultiplePromisesInIntervals(payload: { promises: any[], interval: number }): Promise<any[]> {
    const { promises, interval } = payload;

    return new Promise<any[]>((resolve, reject) => {
        const results: any[] = [];
        let currentIndex = 0;

        function processBatch() {
            // Get the next batch of promises
            const batch = promises.slice(currentIndex, currentIndex + interval);

            if (batch.length === 0) {
                // If no more promises, resolve with all results
                resolve(results);
                return;
            }

            // Resolve the current batch
            Promise.all(batch)
                .then(batchResults => {
                    results.push(...batchResults);
                    currentIndex += interval;
                    processBatch(); // Process the next batch
                })
                .catch(error => {
                    reject(error);
                    console.error(error);
                });
        }

        processBatch(); // Start processing the first batch
    });
}


