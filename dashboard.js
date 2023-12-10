
const placeholder = '<span class="searchPlaceholder">Search...</span>'

//The tags currently displayed
const currentTags = ["ingredients: apple"];

//Tags the user can choose from
const tags = ["ingredients"]

window.onload = () => {
	//Initialization
	let input = document.getElementById("searchInput")
	input.addEventListener("input", handleChange);
	input.addEventListener("keydown", blockEnter);
	getRidOfScrollbar()
	
	//Can be used to prefill the search bar with tags in currentTags
	updateTags()
	input.innerHTML = placeholder;
	input.blur()
	input.addEventListener("focus", handleFocus);
	
}

//The search bar needs to be scrollable, but we don't want to see that ugly scrollbar
function getRidOfScrollbar() {
	var inputWrapper = document.getElementById('inputWrapper');
	inputWrapper.style.paddingBottom = inputWrapper.offsetHeight - inputWrapper.clientHeight + "px";
}

function handleFocus(event) {
	let input = document.getElementById("searchInput")
	if (input.children.length > 0) {
		input.innerHTML = ''
		input.removeEventListener("focus", handleFocus);
	}
}

//When pressing enter, prevent it from creating a newline, finish tag instead
function blockEnter(event) {
	if (event.key === "Enter") {
		event.preventDefault();
		if (event.target.classList.contains('tagEditor')) {
			saveTag(event);
		} else {
			handleChange(event);
		}
	}
}

//Checks if the user typed a new tag, and if so, adds it to currentTags
function handleChange(event) {
	let str = event.target.innerText;
	for (let tag of tags) {
		let regexp;
		if (event.key === 'Enter') {
			//When `Enter` was pressed we do not have to check for a comma or a space
			regexp = new RegExp(`@${tag} ([^ ,\u00A0]+)`);
		} else {
			regexp = new RegExp(`@${tag} ([^ ,\u00A0]+)[ ,\u00A0]`);
		}
		if (regexp.test(str)) {
			//User typed a new tag, add it to currentTags
			let selected = str.match(regexp)[1];
			currentTags.push(tag + ": " + selected)
			event.target.innerText = event.target.innerText.replace(regexp, "");
			updateTags()
		}
	}
	
}

//Renders the tags in currentTags in the search bar
function updateTags() {
	let displayStr = "";
	for (let tag of currentTags) {
		displayStr += `<div class='tag'><button class="tagText" onclick="editTag(event)">${tag}</button><button class="x-button" onclick="deleteTag(event)">\u2716</button></div>`
	}
	document.getElementById("tagWrapper").innerHTML = displayStr;
	
	//Focus the input
	input = document.getElementById('searchInput')
	input.focus();
	let range = document.createRange();
	range.selectNodeContents(input);
	range.collapse(false);
	let selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

//When user clicked on a tag, make that tag editable
function editTag(event) {
	let text = event.target.innerText
	let index = currentTags.indexOf(text)
	event.target.parentElement.innerHTML = `<span>${text.substring(0,text.indexOf(':')+1)}&nbsp;</span><span onkeydown="blockEnter(event)" class="tagEditor" id="tag${index}" contenteditable>${text.substring(text.indexOf(':')+1)}</span><button class="x-button" onclick="deleteTag(event)">\u2716</button>`
	let newInput = document.getElementById('tag' + index)
	
	newInput.focus()
  	window.getSelection().collapse(newInput.firstChild, newInput.innerHTML.length);
}

//User is done with editing tag, so save it and re-render the tags.
function saveTag(event) {
	let index = parseInt(event.target.id.substring(3),10);
	currentTags[index] = event.target.previousSibling.innerText + event.target.innerText;
	updateTags();
}

//Deletes a tag
function deleteTag(event) {
	currentTags.splice(currentTags.indexOf(event.target.previousSibling.innerText),1);
	updateTags();
}

function toggleFavorite(element) {
    if (element.classList.contains('favorited')) {
      element.classList.remove('favorited');
    } else {
      element.classList.add('favorited');
    }
  }
  
  function hoverStar(element) {
    // Mouse üzerine gelindiğinde işaret değiştirme
    element.style.cursor = 'pointer';
  }
  
  function setRating(rating) {
    const stars = document.querySelectorAll('.star');
  
    for (let i = 0; i < stars.length; i++) {
      if (i < rating) {
        stars[i].innerHTML = '★'; // Seçilen yıldızları yıldız simgesiyle doldur
        stars[i].style.color = 'gold'; // Sarı renk yap
      } else {
        stars[i].innerHTML = '☆'; // Diğer yıldızları boş bırak
        stars[i].style.color = 'black'; // Siyah renk yap
      }
    }
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let selectedDay = null;
  
  function selectDay(day) {
    selectedDay = day;
    const dayDivs = document.querySelectorAll('.day');
    dayDivs.forEach(div => {
      div.classList.remove('selected');
    });
    document.getElementById(day).classList.add('selected');
  }
  
  function addMeal() {
    const input = document.getElementById('searchMeal');
    const inputValue = input.value.trim();
  
    if (inputValue !== '' && selectedDay !== null) {
      const dayList = document.getElementById(`${selectedDay}List`);
  
      const listItem = document.createElement('li');
      listItem.textContent = inputValue;
  
      dayList.appendChild(listItem);
      input.value = '';
    }
  }
  
  
  

  
  
    
