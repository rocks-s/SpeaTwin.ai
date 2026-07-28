let activeGenerationPromise = null;

export function runExclusiveGeneration(task) {
  if (activeGenerationPromise) {
    return activeGenerationPromise;
  }

  activeGenerationPromise = task().finally(() => {
    activeGenerationPromise = null;
  });

  return activeGenerationPromise;
}
