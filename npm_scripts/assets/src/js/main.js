var body = $$('body');
var apiKey = 'AIzaSyCxfWV_nUqEF4omxbak_RgavmpldJv_S4A';
var apiURL = 'https://www.google.com/maps/embed/v1/place?';
var maxDepth = 3;
var selectStartingPositition = -320;

//code to create and initialize event to be triggered manually.
var changeEvent = new Event('change');
changeEvent.initEvent("change", false, true);


//init function creates the first select and appends it to the page
//also sets eventlisteners and updates select and map if there is data in localStorage
function init() {

  var container = create('div');
  styleSelectContainer(container);

  var firstPrompt = create('p').appendChild(document.createTextNode(data['level-1'].prompt));

  var firstSelect = create('select');
  firstSelect.name = 'firstSelect';
  if (firstSelect.addEventListener) {
    firstSelect.addEventListener("change", function(event) {
      updateSelects(event);
    }, true);
  } else {

    if (firstSelect.addEventListener) {
      firstSelect.attachEvent("onchange", function(event) {
        updateSelects(event);
      });
    }

  }

  if(window.localStorage) {
    firstLocal = localStorage.getItem('choice1');
  } else {
    firstLocal = GetCookie('choice1');
  }

  var selectedIndex = 0;
  var selectedValue = '';

  for (var x = 0; x < data['level-1'].select.options.length; x++) {

    var option = create('option');
    option.value = data['level-1'].select.options[x].value;
    option.appendChild(document.createTextNode(data['level-1'].select.options[x].label));
    if (typeof(firstLocal) !== 'undefined' && firstLocal === data['level-1'].select.options[x].value) {

      selectedIndex = x;
      selectedValue = data['level-1'].select.options[x].label;

    }
    firstSelect.appendChild(option);

  }

  container.appendChild(firstPrompt);
  container.appendChild(firstSelect);
  firstSelect.selectedIndex = selectedIndex;

  body.appendChild(container);

  if (selectedValue !== '') {
    codeAddress(selectedValue, 4);
    firstSelect.dispatchEvent(changeEvent);
  }

}

//updateSelects handles appending new selects to the page
//if a select is changed that is not the last one on the page it removes
//selects up to the correct level and generates a new one.
//if maximum depth has been reach is displays the form.
function updateSelects(event) {

  var selectsOnPage = document.getElementsByTagName('select').length;

  //if the select changed was the last select on the page
  if (event.target === $$('select', selectsOnPage - 1)) {

    if (event.target.value.length > 0 && selectsOnPage + 1 <= maxDepth) {
      createSelect(selectsOnPage + 1, event.target.value);
    }
    var queryUpdate = event.target.options[event.target.selectedIndex].firstChild.nodeValue;
    codeAddress(queryUpdate, selectsOnPage * 4);
    if(window.localStorage) {
      localStorage.setItem('choice' + selectsOnPage, event.target.options[event.target.selectedIndex].value);
    } else {
      SetCookie('choice' + selectsOnPage, event.target.options[event.target.selectedIndex].value);
    }


  } else {

    elementToRemove = $$$('select-container', document.getElementsByClassName('select-container').length - 1);

    if(window.localStorage) {
      localStorage.removeItem('choice' + selectsOnPage);
    } else {
      DeleteCookie('choice' + selectsOnPage);
    }
    slideSelect(elementToRemove, true, event);

  }

  if (selectsOnPage == maxDepth) {
    formOnPage = $$$('formContainer');
    if (formOnPage) {
      body.removeChild(formOnPage);
    }
    createForm(event.target.options[event.target.selectedIndex].firstChild.nodeValue);

  } else {

    formOnPage = $$$('formContainer');
    if (formOnPage) {
      body.removeChild(formOnPage);
    }

  }

}

function createSelect(level, key) {

  var container = create('div');
  styleSelectContainer(container);

  var prompt = create('p').appendChild(document.createTextNode(data['level-' + level][key].prompt));

  var select = create('select');
  //select.name = 'firstSelect';
  select.addEventListener("change", function(event) {
    updateSelects(event);
  }, true);
  var nextLevel = level + 1;

  if(window.localStorage) {
    localChoice = localStorage.getItem('choice' + level);
  } else {
    localChoice = GetCookie('choice' + level);
  }

  var selectedIndex = 0;
  var selectedValue = '';

  for (var x = 0; x < data['level-' + level][key].select.options.length; x++) {

    var option = create('option');
    option.value = data['level-' + level][key].select.options[x].value;
    option.appendChild(document.createTextNode(data['level-' + level][key].select.options[x].label));

    if (typeof(localChoice) !== 'undefined' && localChoice === data['level-' + level][key].select.options[x].value) {

      selectedIndex = x;
      selectedValue = data['level-' + level][key].select.options[x].label;

    }
    select.appendChild(option);


  }

  container.appendChild(prompt);
  container.appendChild(select);
  container.style.left = selectStartingPositition + 'px';
  body.appendChild(container);
  select.selectedIndex = selectedIndex;
  slideSelect(container, false, null);
  if (selectedValue !== '') {
    codeAddress(selectedValue, 8);
    var tempEvent = new Event('change');
    tempEvent.initEvent("change", false, true);
    select.dispatchEvent(tempEvent);
  }

}


//createForm sets up the form and appends it at the bottom of the page
function createForm(query) {

  var formContainer = create('div');
  formContainer.className = 'formContainer';
  formContainer.style.backgroundColor = '#233E2A';
  formContainer.style.color = '#fff';
  formContainer.style.height = '250px';
  formContainer.style.width = '400px';
  formContainer.style.padding = '25px';
  formContainer.style.marginBottom = '25px';


  var form = create('form');

  var nameLabel = create('label');
  nameLabel.appendChild(document.createTextNode('Name:  '));

  var nameInput = create('input');
  nameInput.type = 'text';
  nameInput.name = 'name';

  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  form.appendChild(create('br'));
  form.appendChild(create('br'));

  var emailLabel = create('label');
  emailLabel.appendChild(document.createTextNode('Email:  '));

  var emailInput = create('input');
  emailInput.type = 'text';
  emailInput.name = 'email';

  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(create('br'));
  form.appendChild(create('br'));

  var link = create('p');
  link.style.wordWrap = 'break-word';


  link.appendChild(document.createTextNode('Link: https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query)));
  form.appendChild(link);

  var hiddenInput = create('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = 'mapLink';
  hiddenInput.value = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
  form.appendChild(hiddenInput);

  var parkInput = create('input');
  parkInput.type = 'hidden';
  parkInput.name = 'parkName';
  parkInput.value = query;
  form.appendChild(parkInput);

  var submit = create('input');
  submit.type = 'submit';
  submit.value = "Submit";

  form.appendChild(submit);

  form.method = 'POST';
  form.enctype = 'multipart/form-data';
  form.autocomplete = 'off';

  if (form.addEventListener) {
    form.addEventListener("submit", function(event) {
      sendEmail(event);
    }, true);
  } else {

    if (form.addEventListener) {
      form.attachEvent("onchange", function(event) {
        sendEmail(event);
      });
    }
  }

  formContainer.appendChild(form);

  body.appendChild(formContainer);


}

//sendEmail performs basic validation and submits the form if there are no errors
function sendEmail(event) {


  errors = false;
  if (document.getElementsByName('name')[0].value === '') {

    document.getElementsByName('name')[0].style.border = 'solid red 1px';
    errors = true;

  }

  if (document.getElementsByName('email')[0].value === '') {

    document.getElementsByName('email')[0].style.border = 'solid red 2px';
    errors = true;

  }

  if (!errors) {
    submit();
  }

}

//helper function for styling selects
function styleSelectContainer(container) {

  container.className = 'select-container';
  container.style.backgroundColor = '#233E2A';
  container.style.color = '#fff';
  container.style.height = '60px';
  container.style.width = '250px';
  container.style.padding = '25px';
  container.style.marginBottom = '25px';

}

//slideSelect sildes the select in or out based on the visivle flag
//if a select is being slid off the page it is also destroyed
function slideSelect(element, visible, event) {

  var duration = 5;

  if (visible) {

    left = parseInt(element.style.left);
    left -= 1;
    element.style.left = left + 'px';
    if (parseInt(element.style.left) > selectStartingPositition) {
      setTimeout(function() {
        slideSelect(element, visible, event);
      }, duration);
    } else {
      destroySelect(element, event.target);
    }

  } else {

    left = parseInt(element.style.left);
    left += 1;
    element.style.left = left + 'px';
    if (parseInt(element.style.left) < 0) {
      setTimeout(function() {
        slideSelect(element, visible, event);
      }, duration);
    }

  }

}

//removes a select element from the page
function destroySelect(element, changedSelect) {

  body.removeChild(element);
  changedSelect.dispatchEvent(changeEvent);

}

//function to update the map viewport based on selections
function codeAddress(location, zoom) {

  geocoder.geocode({
    'address': location
  }, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      map.setZoom(zoom);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}
