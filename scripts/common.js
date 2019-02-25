"use strict";

function Debug_log(in_obj) {
  app_settings.IS_DEBUG && Log(in_obj);
}

var Log = console.log;


function Get_element_by_id(in_id) {
  return document.getElementById(in_id);
}

function Get_elements_by_class(in_class) {
 return document.getElementsByClassName(in_class);
}