function doGet(e: GoogleAppsScript.Events.DoGet) {
  const { name } = e.parameter; //GET Parameter
  return ContentService.createTextOutput(`Hello ${name}`);
}

interface IBody{
  name: string;
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const body = JSON.parse(e.postData.contents) as IBody //POST Body
  return ContentService.createTextOutput(`Hello ${body.name}`);
}