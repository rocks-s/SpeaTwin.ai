export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read photo file."));
    reader.readAsDataURL(file);
  });
}

export async function dataUrlToFile(dataUrl, fileName, mimeType) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: mimeType });
}
