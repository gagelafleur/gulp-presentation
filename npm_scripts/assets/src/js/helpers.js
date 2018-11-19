function $(id){
  return document.getElementById(id);
}

function $$(tag,index){
  index = (typeof index !== 'undefined') ?  index : 0;
  return document.getElementsByTagName(tag)[index];
}

function $$$(className,index){
  index = (typeof index !== 'undefined') ?  index : 0;
  return document.getElementsByClassName(className)[index];
}

function create(tag){
  return document.createElement(tag);
}
