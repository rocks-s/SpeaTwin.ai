export function getScriptPreview(script) {
  if (!script) {
    return "";
  }

  if (script.length <= 16) {
    return script;
  }

  return `${script.slice(0, 16)}...`;
}
