function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  const { name } = e.parameter;
  return ContentService.createTextOutput(`Hello ${name}`);
}
