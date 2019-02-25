"use strict";

function App() {
  Debug_log("Run application...");
  
  try {
    new Status_bar();
    Status_bar.Show_default_message();
    
    new CardsList();
    CardsList.Load();
    
    new HTMLCardsList();
    if (!CardsList.Is_empty()) {
      HTMLCardsList.Render();
    }
    
    App.Set_elements();
  }
  catch (e) {
    Debug_log(e.message);
    Status_bar.Show_error_message(e.message);
  }
  
  Debug_log("Application is running.");
}

App.Set_elements = function() {
  Debug_log("Set elements...");
  
  const input_card_number = App.Get_creating_card_number_input();
  input_card_number.maxLength = app_settings.CARD_NUMBER_MAX_LENGTH;
  input_card_number.placeholder = `${app_settings.CARD_NUMBER_MAX_LENGTH} digits card number`;
  
  const textarea_card_comment = App.Get_creating_card_comment_textarea();
  textarea_card_comment.maxLength = app_settings.CARD_COMMENT_MAX_LENGTH;
  textarea_card_comment.placeholder = `optional comment[${app_settings.CARD_COMMENT_MAX_LENGTH} symbols]`;
  
  Debug_log("Elements is set.");
};



App.Show_creating_panel = function() {
  Debug_log("Show creating panel...");
  App.Get_show_creating_panel_button().blur();
  
  HTMLCardsList.Unselect_card();
  
  App.Hide_element_by_id("card-info");
  App.Hide_deleting_confirmation_for_info_panel();
  
  App.Show_element_by_id("card-creating");
  App.Clear_card_creating_inputs();
  App.Disable_creating_card_button();
  
  App.Show_panel();  
};

App.Get_show_creating_panel_button = function() {
  return Get_element_by_id("button-show-creating-panel");
};

App.Enable_creating_card_button = function() {
  App.Get_creating_card_button().disabled = false;  
};

App.Disable_creating_card_button = function() {
  App.Get_creating_card_button().disabled = true;  
};

App.Get_creating_card_button = function() {
  return Get_element_by_id("button-create-card");  
};


App.Show_selected_card_info = function() {
  const card_number = HTMLCardsList.Get_selected_card_number();
  App.Show_card_info(card_number);
};

App.Show_card_info = function(in_card_number) {
  Debug_log(`Show info for card with ${in_card_number} number...`);
  App.Show_info_panel(in_card_number);
};

App.Show_info_panel = function(in_card_number) {
  Debug_log("Show info panel...");
  
  App.Hide_element_by_id("card-creating");
  
  Get_element_by_id("card-info-number").innerHTML = CardsList.Get_pretty_formatted_card_number(in_card_number);
  Get_element_by_id("card-info-comment").innerHTML = CardsList.Get_card_comment(in_card_number);
  App.Hide_deleting_confirmation_for_info_panel();
  App.Show_element_by_id("card-info");

  App.Show_panel();
};

App.Show_deleting_confirmation_for_info_panel = function() {
  App.Show_element_by_id("card-deleting-confirmation");
  Debug_log("Deleting confirmation of info panel is shown.");
};

App.Hide_deleting_confirmation_for_info_panel = function() {
  App.Hide_element_by_id("card-deleting-confirmation");
  Debug_log("Deleting confirmation of info panel is hidden.");
};

App.Show_panel = function() {
  App.Unset_main_part_full_width();
  App.Show_panel_node();
  Debug_log("Panel is shown.");
};

App.Hide_panel = function() {
  Debug_log("Hide panel...");
  HTMLCardsList.Unselect_card();
  App.Set_main_part_full_width();
  App.Hide_panel_node();
  
  Status_bar.Show_default_message();
  Debug_log("Panel is hidden.");
};

App.Set_main_part_full_width = function() {
  App.Get_main_part_node().classList.add(App.Get_main_part_full_width_class());
};

App.Unset_main_part_full_width = function() {
  App.Get_main_part_node().classList.remove(App.Get_main_part_full_width_class());  
};

App.Get_main_part_full_width_class = function() {
  return "full-width";
};

App.Get_main_part_node = function() {
  return Get_element_by_id(App.Get_main_pard_node_id());
};

App.Get_main_pard_node_id = function() {
  return "main-part";
};

App.Show_panel_node = function() {
  App.Show_element_by_id(App.Get_panel_node_id());    
};

App.Hide_panel_node = function() {
  App.Hide_element_by_id(App.Get_panel_node_id());  
};

App.Get_panel_node = function() {
  return Get_element_by_id(App.Get_panel_node_id());
};

App.Get_panel_node_id = function() {
  return "side-panel";
};

App.Show_element_by_id = function(in_id) {
  Get_element_by_id(in_id).classList.remove(App.Get_hidden_element_class());  
};

App.Hide_element_by_id = function(in_id) {
  Get_element_by_id(in_id).classList.add(App.Get_hidden_element_class());   
};

App.Get_hidden_element_class = function() {
  return "hidden";
};

App.Validate_card_input = function() {
  App.Disable_creating_card_button();
  Status_bar.Show_default_message();
  
  const input_card_number = App.Get_creating_card_number_input();
    let number = input_card_number.value.replace(/\D/g,"");
  input_card_number.value = number;
  input_card_number.classList.add("error");
  
  if (number.length != app_settings.CARD_NUMBER_MAX_LENGTH) {
    input_card_number.classList.remove("error");
    return;
  }
  
  let msg;
  const pretty_number = CardsList.Get_pretty_formatted_card_number(number);
  
  if (CardsList.Is_valid_card_number(number)) {
    Debug_log(`Inputted ${pretty_number} number is valid.`);
  }
  else {
    msg = `Inputted ${pretty_number} number is invalid.`;
    Debug_log(msg);
    Status_bar.Show_error_message(msg);
    return;
  }
    
  const type = CardsList.Get_card_type(number);
  if (CardsList.Is_valid_card_type(number)) {
    Debug_log(`${type} (${pretty_number}) is valid type.`); 
  }
  else {
    msg = `${type} (${pretty_number}) is invalid type. Valid types: ${VALID_TYPES.join(", ")}.`;
    Debug_log(msg);
    Status_bar.Show_error_message(msg); 
    return;
  }
      
  if (CardsList.Is_card_exist(number)) {
    msg = `Card with ${pretty_number} number already exists.`;
    Debug_log(msg);
    Status_bar.Show_error_message(msg);
    return;
  }
  else {
    Debug_log(`Card with ${pretty_number} number does not exist.`);
    App.Enable_creating_card_button();
  }
  input_card_number.classList.remove("error");
};


App.Create_card = function() {
  Debug_log("Creating card...");
  
  try {
    App.Disable_creating_card_button();
    App.Add_card();
    HTMLCardsList.Update();
    HTMLCardsList.Select_last_added_card();
    App.Show_selected_card_info();
  }
  catch(e) {
    Debug_log(e.message);
    Status_bar.Show_error_message(e.message);
  }
  
  const pretty_number = CardsList.Get_pretty_formatted_card_number(CardsList.Get_last_added_card_number());
  const msg = `Card with ${pretty_number} number was been created.`;
  Debug_log(msg);
  Status_bar.Show_message(msg);
};

App.Add_card = function() {
  const card_number = App.Get_creating_card_number_input().value;
  const card_comment = App.Get_creating_card_comment_textarea().value;
  
  CardsList.Add_card(card_number, card_comment);  
};

App.Clear_card_creating_inputs = function() {
  App.Get_creating_card_number_input().value = null;
  App.Get_creating_card_number_input().classList.remove("error");
  
  App.Get_creating_card_comment_textarea().value = null;
};

App.Get_creating_card_number_input = function() {
  return Get_element_by_id("input-creating-card-number");  
};

App.Get_creating_card_comment_textarea = function() {
  return Get_element_by_id("textarea-creating-card-comment"); 
};


App.Delete_card = function() {
  Debug_log("Deleting card...");
  let number, pretty_number;
  try {
    number = HTMLCardsList.Get_selected_card_number();
    pretty_number = CardsList.Get_pretty_formatted_card_number(number);
    CardsList.Delete_card(number);
    HTMLCardsList.Update();
    App.Hide_panel();
  }
  catch(e) {
    Debug_log(e.message);
    Status_bar.Show_error_message(e.message);
  }
  
  const msg = `Card with ${pretty_number} number was been deleted.`;
  Debug_log(msg);
  Status_bar.Show_message(msg);  
};


new App();
