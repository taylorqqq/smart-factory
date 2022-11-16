import request from "@/services";

export function getFlawMsg(parameter) {
  return request.get("/flaw/msg", parameter);
}
export function startCheck(parameter) {
  return request.post("/masterRoll/startCheck", parameter);
}
export function endCheck(parameter) {
  return request.post("/masterRoll/endCheck", parameter);
}
export function updateDetail(parameter) {
  return request.get("/formula/updateDetail", parameter);
}
export function switchFormula(parameter) {
  return request.post("/formula/switch", parameter);
}
export function deleteFormula(parameter) {
  return request.delete("/formula/delete", parameter);
}
export function addFormula(parameter) {
  return request.post("/formula/add", parameter);
}
export function getFormulaDetail(parameter) {
  return request.get("/formula/detail", parameter);
}
export function getFlawStatistic(parameter) {
  return request.get("/defectRecord/statistic", parameter);
}
export function stopAlarm(parameter) {
  return request.post("/masterRoll/stopAlarm", parameter);
}
export function startAlarm(parameter) {
  return request.post("/masterRoll/startAlarm", parameter);
}
export function getAlarmStatus(parameter) {
  return request.get("/masterRoll/getAlarmStatus", parameter);
}
export function getCurrentMasterRoll(parameter) {
  return request.get("/masterRoll/currentMasterRoll", parameter);
}
export function getCurrentFormula(parameter) {
  return request.get("/formula/currentFormula", parameter);
}
