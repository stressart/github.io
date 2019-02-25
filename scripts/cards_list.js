"use strict";

function CardsList() {
  CardsList.cards_map = new Map();
  CardsList.storage_key = "cards_list";
  Debug_log("CardsList was been created.");
}

CardsList.Debug_add_cards = function(in_cards_count) {
  Debug_log("Debug add cards...");
  const cards_count = in_cards_count || 1;
  for (let i = 1; i <= cards_count; i++) {
    const comment = CardsList.Debug_get_random_comment();
    CardsList.Add_card(i.toString(), comment);    
  }
  Debug_log(`${cards_count} cards was been added for debug.`);
};

CardsList.Debug_get_random_comment = function() {
  const comment_length = Math.floor(Math.random() * (app_settings.CARD_COMMENT_MAX_LENGTH + 1));
  Debug_log("Random comment length = " + comment_length);
   
  let comment = "";
  for (let i = 0; i <= comment_length; i++) {
    comment += CardsList.Debug_get_random_symbol(); 
  }
 
  Debug_log("Random comment = " + comment);
  return comment;
};

CardsList.Debug_get_random_symbol = function() {
  const possible = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const symbol = possible.charAt(Math.floor(Math.random() * possible.length));
  return symbol;
};

CardsList.Add_card = function(in_card_number, in_card_comment) {
  Debug_log(`Add card with ${in_card_number} number to CardsList...`);
  
  if (CardsList.Is_card_exist(in_card_number)) {
    throw new CardsListAddCardException(in_card_number);  
  }
  
  this.cards_map.set(in_card_number, in_card_comment);
  Debug_log(`Card with ${in_card_number} number was added to CardsList.`);
  Debug_log(`Card: number = ${in_card_number}, comment = ${in_card_comment}`);
  
  Debug_log("Save CardsList after card adding...");
  try {
    CardsList.Save();
  }
  catch (e) {
    Debug_log("ERROR: while CardsList was been saving.");
    
    this.cards_map.delete(in_card_number);
    
    e.message = `ERROR: Card with  ${in_card_number} number was not added to CardsList. ` + e.message;
    Debug_log(e.message);
    
    throw e;
  }
};

function CardsListAddCardException(in_card_number) {
  this.name = "CardsListAddCardException";
  this.message = `Card with ${in_card_number} number is already exist.`;
}


CardsList.Delete_card = function(in_card_number) {
  if (this.cards_map.delete(in_card_number)) {
    Debug_log(`Card with ${in_card_number} number was deleted.`);   
  }
  else {
    throw new CardsListDeleteCardException(in_card_number);   
  }

  Debug_log("Save CardsList after card deleting...");
  CardsList.Save();
};

function CardsListDeleteCardException(in_card_number) {
  this.name = "CardsListDeleteCardException";
  this.message = `CardsList exception: card with ${in_card_number} number does not exist.`;
}


CardsList.Save = function() {
  Debug_log("Save CardsList to localStorage...");
  if (CardsList.Is_empty()) {
    Debug_log("Nothing to save: CardsList is empty.");
    CardsList.Clear();
  }
  else {
    try {
      localStorage.setItem(this.storage_key, CardsList.ToJson());
      Debug_log(`CardsList was saved in localStorage with '${this.storage_key}' key.`);
    }
    catch (e) {
      if (Is_local_storage_quota_reached_exception(e)) {
        Debug_log(`ERROR: CardsList was not saved in localStorage with '${this.storage_key}' key.`);
        throw new LocalStorageQuotaReachedException();
      }
      else {
        throw e;
      }
    }
  }
};

CardsList.Clear = function() {
  const key = this.storage_key
  localStorage.removeItem(key);
  Debug_log(`'${key}' key was deleted from localStorage.`);
};

function Is_local_storage_quota_reached_exception(in_e) {
  return  ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(in_e.name);  
}

function LocalStorageQuotaReachedException () {
  this.message = "localStorage quota was been reached.";
  this.name = "LocalStorageQuotaReachedException";
}

CardsList.Load = function() {
  Debug_log("Load CardsList from localStorage...");
  if (CardsList.Is_save_exists_in_local_storage()) {
    Debug_log(`Save with '${this.storage_key}' key exists in localStorage.`);
    
    let storage_arr;
    try {
      const storage_json = localStorage.getItem(this.storage_key);
      Debug_log("storage_json = " + storage_json);
      CardsList.Get_from_json(storage_json);
    }
    catch (e) {
      throw new LocaStorageItemParsingException(this.storage_key);
    }
    
    if (CardsList.Is_empty()) {
      Debug_log(`Nothing was saved in localStorage with '${this.storage_key}' key.`);
    }
    else {
      CardsList.Debug_print();
      Debug_log(`CardsList was loaded from localStorage with '${this.storage_key}' key.`);
    }   
  }
  else {
    Debug_log(`'${this.storage_key}' key not found in localStorage.`);
  }
};

function LocaStorageItemParsingException(in_key) {
  this.message = `localStorage item parsing exception with item.key = "${in_key}"`;
  this.name = "LocaStorageItemParsingException";
}

CardsList.Is_save_exists_in_local_storage = function() {
  return CardsList.Get_local_storage_keys().includes(this.storage_key) ;
};

CardsList.Get_local_storage_keys = function(){
  const keys_arr = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys_arr.push(localStorage.key(i));
  }
  Debug_log("local_storage_keys = " + JSON.stringify(keys_arr));
  return keys_arr;
};

CardsList.Is_empty = function() {
  return CardsList.Get_cards_count() == 0;
};


CardsList.Get_last_added_card_number = function() {
  const m = this.cards_map; 
  return Array.from(m)[m.size-1][0];
};


CardsList.Get_cards_count = function() {
  return this.cards_map.size;
};

CardsList.Get_reversed_card_number_array = function() {
  const card_array = [];
  let i = 0;
  for (let card_number of CardsList.Get_card_numbers_array()) {
    card_array[i] = card_number;
    i++;
  }
  
  return card_array.reverse();
};

CardsList.Get_card_numbers_array = function() {
  return this.cards_map.keys();
};

CardsList.Is_card_exist = function(in_card_number) {
  return this.cards_map.has(in_card_number);
};

CardsList.Debug_print = function() {
  Debug_log("CardsList:");
  Debug_log("storage_key = " + this.storage_key);
  Debug_log("cards = " + CardsList.toString());
};

CardsList.toString = function() {
  return CardsList.ToJson();
};

CardsList.ToJson = function() {
    return JSON.stringify([...this.cards_map]);
};

CardsList.Get_from_json = function(in_json_string) {
   this.cards_map = new Map(JSON.parse(in_json_string));
};


CardsList.Debug_card_print = function(in_card_number) {
  Debug_log(CardsList.Card_to_string(in_card_number));
};

CardsList.Card_to_string = function(in_card_number) {
  const type = CardsList.Get_card_type(in_card_number);
  const comment = CardsList.Get_card_comment(in_card_number);
  
  return `Card: type = ${type}; number = ${in_card_number}; comment = ${comment}`;
};

CardsList.Is_valid_card_type = function(in_card_number) {
  return app_settings.VALID_TYPES.includes(CardsList.Get_card_type(in_card_number));
};

CardsList.Get_card_type = function(in_card_number) {
  let type = new CreditCard().getCreditCardNameByNumber(in_card_number);
  if (type == 'Credit card is invalid!') {
    type = "unknown";
  }
  Debug_log(`Card type with ${in_card_number} number is ${type}.`)
  return type;
};

CardsList.Is_valid_card_number = function(in_card_number) {
  return new CreditCard().isValid(in_card_number);
};

CardsList.Get_pretty_formatted_card_number = function(in_card_number) {
  return in_card_number.toString().replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'');
};

CardsList.Get_cutted_card_comment = function(in_card_number) {
  const comment_lenght = 25;
  return CardsList.Get_card_comment(in_card_number).substring(0, comment_lenght);
};

CardsList.Is_card_with_comment = function(in_card_number) {
  return CardsList.Get_card_comment(in_card_number) !== undefined;  
};

CardsList.Get_card_comment = function(in_card_number) {
  let  comment = this.cards_map.get(in_card_number);
  if (comment === undefined) {
    comment = null;
  }
  Debug_log("Get_card_comment = " + comment);
  return comment;
};
