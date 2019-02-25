"use strict";

function HTMLCardsList() {
  Debug_log("HTMLCardsList was been created.");
}

HTMLCardsList.Update = function() {
  HTMLCardsList.Clear();
  HTMLCardsList.Render();
};

HTMLCardsList.Clear = function() {
  Debug_log("Clear HTMLCardsList...");
  const parent_node = HTMLCardsList.Get_parent_node();

 	while (parent_node.lastChild) {
 	  if (parent_node.lastChild.type == "button") {
 	    break;
 	  }
 	  let id = parent_node.lastChild.id; 
    parent_node.removeChild(parent_node.lastChild);
    Debug_log(id + " was deleted.");
  }
  
  Debug_log("HTMLCardsList was been cleared.");
};

HTMLCardsList.Render = function() {
  Debug_log("Render HTMLCardsList...")
  
  let card_numbers_array = CardsList.Get_reversed_card_number_array();
  for (let card_number of card_numbers_array) {
    HTMLCardsList.Render_card(card_number);  
  }
  
  Debug_log("HTMLCardsList is rendered.")
};

HTMLCardsList.Render_card = function(in_card_number) {
  const card_id = HTMLCardsList.Get_card_id(in_card_number);
  Debug_log(`Render ${card_id} ...`)
  CardsList.Debug_card_print(in_card_number)
  
  const html_card = HTMLCardsList.Get_template_card_node_clone();
  html_card.id = card_id;
  
  const type = CardsList.Get_card_type(in_card_number);
  html_card.classList.add(type);
  
  const number = CardsList.Get_pretty_formatted_card_number(in_card_number);
  html_card.getElementsByClassName("card-number")[0].innerHTML = number;
  
  const comment_node = html_card.getElementsByClassName("card-comment")[0];
  let cutted_comment;
  if (CardsList.Is_card_with_comment(in_card_number)) {
    cutted_comment = CardsList.Get_cutted_card_comment(in_card_number);
    comment_node.innerHTML = cutted_comment;
  }
  else {
    comment_node.remove();  
  }
  
  html_card.onclick = function() {
    Debug_log(`${card_id} onclick event fired.`);  
    HTMLCardsList.Select_card(in_card_number);
    App.Show_selected_card_info();
  };
  
  HTMLCardsList.Get_parent_node().appendChild(html_card);
  Debug_log(`Card: type = ${type}; number = ${number}; comment = ${cutted_comment}`);
  Debug_log(`${card_id} was rendered.`)
};

HTMLCardsList.Get_template_card_node_clone = function() {
  return Get_element_by_id("card-template").cloneNode(true);
}

HTMLCardsList.Get_parent_node = function() {
  return Get_element_by_id("cards-list");  
};


HTMLCardsList.Select_last_added_card = function() {
  HTMLCardsList.Select_card(CardsList.Get_last_added_card_number());
};

HTMLCardsList.Select_card = function (in_card_number) {
  Debug_log(`Select card with ${in_card_number} number...`);
  HTMLCardsList.Unselect_card();
  
  const id = HTMLCardsList.Get_card_id(in_card_number);
  const card = Get_element_by_id(id);
  card.classList.add(HTMLCardsList.Get_selected_card_class_name());
  Debug_log(`Card with ${in_card_number} number is been selected.`);
};

HTMLCardsList.Unselect_card = function() {
  Debug_log("Unselect card...");
  const card = HTMLCardsList.Get_selected_card();
  if (card === undefined) {
    Debug_log("Selected card is not found.");
  }
  else {
    const pretty_number = CardsList.Get_pretty_formatted_card_number(HTMLCardsList.Get_selected_card_number());
    card.classList.remove(HTMLCardsList.Get_selected_card_class_name());
    Debug_log(`Card with ${pretty_number} number was been unselected.`);
  }
};

HTMLCardsList.Get_selected_card_number = function() {
  const card = HTMLCardsList.Get_selected_card();
  return HTMLCardsList.Get_card_number(card);
};

HTMLCardsList.Get_card_number = function(in_card) {
  return in_card.id.split("-").pop();
};


HTMLCardsList.Get_card_id = function(in_card_number) {
  return HTMLCardsList.Get_cards_id_prefix() + in_card_number;
};

HTMLCardsList.Get_cards_id_prefix = function() {
  return "card-";
};


HTMLCardsList.Get_selected_card = function() {
  return Get_elements_by_class(HTMLCardsList.Get_selected_card_class_name())[0];
};

HTMLCardsList.Get_selected_card_class_name = function() {
  return "card-selected";
};
