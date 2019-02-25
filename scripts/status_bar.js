"use strict";

function Status_bar() {
  Debug_log("Status_bar was been created.");
}

Status_bar.Show_default_message = function() {
  const msg = "Cards List";
  Status_bar.Show_message(msg);
};

Status_bar.Show_message = function(in_msg) {
  const status_bar = Status_bar.Get();
  status_bar.innerHTML = in_msg;
  status_bar.classList.remove("error");
  
  Debug_log(`Status_bar message = "${in_msg}"`);
};

Status_bar.Show_error_message = function(in_msg) {
  const status_bar = Status_bar.Get();
  status_bar.innerHTML = in_msg;
  status_bar.classList.add("error");
  
  Debug_log(`Status_bar error = "${in_msg}"`);
};

Status_bar.Get = function() {
  return Get_element_by_id("status-bar");
};
