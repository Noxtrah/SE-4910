
var modal = document.getElementById("myModal");
var closeButton = document.getElementsByClassName("close")[0];

// Save button elementini al
var saveButton = document.getElementById("saveBtn");

// Meal plan günleri ve inputları
var mealPlanDays = document.querySelectorAll(".day");
var breakfastInput = document.getElementById("breakfastInput");
var lunchInput = document.getElementById("lunchInput");
var dinnerInput = document.getElementById("dinnerInput");

// Popup açma fonksiyonu
function openModal(day) {
    // Modalı aç
    modal.style.display = "block";

    // Popup açıldığında o günün mevcut öğelerini al ve inputlara yaz
    var items = day.querySelectorAll("li");
    breakfastInput.value = items[0].innerText;
    lunchInput.value = items[1].innerText;
    dinnerInput.value = items[2].innerText;

    // Save buttona click eventi ekle
    saveButton.onclick = function() {
        savePopup(day);
    };
}

// Popup kapatma fonksiyonu
function closeModal() {
    modal.style.display = "none";
}

// Save buttona atanacak fonksiyon
function savePopup(day) {
    // Input değerlerini al
    var breakfastValue = breakfastInput.value;
    var lunchValue = lunchInput.value;
    var dinnerValue = dinnerInput.value;

    // Günün öğelerini güncelle
    var items = day.querySelectorAll("li");
    items[0].innerText = breakfastValue;
    items[1].innerText = lunchValue;
    items[2].innerText = dinnerValue;

    // Modalı kapat
    closeModal();
}

// Her bir gün için click eventi ekle
mealPlanDays.forEach(function(day) {
    day.addEventListener("click", function() {
        openModal(day);
    });
});

// Modalın dışına tıklandığında kapat
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Close buttona click eventi ekle
closeButton.onclick = function() {
    closeModal();
};



// Kaydetme düğmesine tıklanınca
function combineData() {
    // Ana meal-plan divini al
    var mealPlan = document.getElementById("sortable-section");

    // Tüm günlerin li elementlerini al
    var allItems = mealPlan.querySelectorAll(".day .items li");

    // Boş bir dize oluştur
    var combinedString = "";

    // Her bir li elementini dolaş
    allItems.forEach(function(item, index) {
        // Günün adını al
        var day = item.parentNode.parentNode.getAttribute("data-day");

        // Li elementinin içeriğini al
        var itemContent = item.innerText.trim();

        // İçeriği null ise "null" olarak ayarla
        if (itemContent === "") {
            itemContent = " ";
        }

        // Virgül ekleyerek her bir yemek ismini ekleyerek birleştir
        combinedString += itemContent;

        // Son öğe değilse virgül ekle
        if (index < allItems.length - 1) {
            combinedString += ",";
        }

        // Eğer son öğe değilse günleri : ile ayır
        if (index % 3 === 2 && index < allItems.length - 1) {
            combinedString += ":";
        }

    });

    // Final stringi döndür
    return combinedString;
}


 async function saveMealPlan() {
 
    var MealPlanFinalString = combineData();
    console.log(MealPlanFinalString);  // doğru formatta string veriyor

    //Kullanıcı oturum açtığında veya kimlik doğrulama başarılı olduğunda alınan token
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    // Token var mı kontrol edelim
    if (!JWTAccessToken) {
        console.error('Access token not found. Please log in first.');
        return;
    }

    // denenmedi
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/planner/save-planner';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JWTAccessToken

            },
            body: (MealPlanFinalString),

        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to save meal plan. Status: ${response.status}. Message: ${errorMessage}`);
        }

        const responseBody = await response.text();
        let responseData;
       
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


//çalışıyor
window.onload = function() {
    getMealPlan();
};



async function saveToPlans() {
    // Haftanın günlerini bir diziye al
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    // Tüm günler için verileri topla

    //Kullanıcı oturum açtığında veya kimlik doğrulama başarılı olduğunda alınan token
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    // Token var mı kontrol edelim
    if (!JWTAccessToken) {
        console.error('Access token not found. Please log in first.');
        return;
    }

    
    var allData = "";
    days.forEach(function(day, index) {
        // Gün elementini seç
        var dayElement = document.querySelector('[data-day="' + day + '"]');
        if (!dayElement) return; // Gün elementi bulunamazsa geç
       
        // Günün öğünlerini al
        var breakfast = dayElement.querySelector('.breakfast').innerText.trim();
        var lunch = dayElement.querySelector('.lunch').innerText.trim();
        var dinner = dayElement.querySelector('.dinner').innerText.trim();
        
        // Veriyi oluştur ve tüm verilere ekle
        var dayData = breakfast + ", " + lunch + ", " + dinner;
    
        // Son güne noktalı virgül eklenmeli
        if (index === days.length - 1) {
            dayData += ";";
        } else {
            dayData += ": ";
        }            
        allData += dayData;
    });

    console.log(allData)

    // Veriyi sunucuya göndermek için POST isteği yap
    const apiUrl = 'https://recipiebeckend.azurewebsites.net/planner/save-one-week';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JWTAccessToken

            },
            body: (allData),

        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to save meal plan. Status: ${response.status}. Message: ${errorMessage}`);
        }

        const responseBody = await response.text();
        let responseData;
       
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


//çalışıyor get
async function getMealPlan() {
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    if (!JWTAccessToken) {
        console.error('Access token not found. Please log in first.');
        return null;
    }

    const apiUrl = 'https://recipiebeckend.azurewebsites.net/planner/get-current-data';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JWTAccessToken
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch meal plan. Status: ${response.status}. Message: ${errorMessage}`);
        }

        const mealPlanData = await response.json();
        console.log('Meal plan fetched successfully:', mealPlanData);

        // Fill the current data
        fillCurrentData(mealPlanData);

        return mealPlanData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

//çalışıyor get
function fillCurrentData(data) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Iterate through each day
    days.forEach((day, index) => {
        const items = document.querySelectorAll(`[data-day="${day}"] .items li`);
        const meals = data[index];

        // Fill the meals for the day
        items.forEach((item, i) => {
            if (meals !== null && meals !== undefined && meals[i] !== null && meals[i] !== undefined) {
                item.innerText = meals[i];
            } else {
                item.innerText = ""; // If value is null or undefined, leave inner text empty
            }
        });
    });
}





async function clearAll() {
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    if (!JWTAccessToken) {
        console.error('Access token not found. Please log in first.');
        return;
    }

    const apiUrl = 'https://recipiebeckend.azurewebsites.net/planner/clear-meal-planner';
    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': JWTAccessToken
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to clear all data. Status: ${response.status}. Message: ${errorMessage}`);
        }

        console.log('All data cleared successfully');
        // HTML'deki tüm yemek listelerini temizle
        const itemsLists = document.querySelectorAll('.items');
        itemsLists.forEach(itemsList => {
            itemsList.innerHTML = '';
        });
    } catch (error) {
        console.error('There was a problem with the clear operation:', error);
    }
}

// önceki haftaları getir ve tablo yap
// function getPreWeeks() {
//     // var url = "https://run.mocky.io/v3/16b0da6a-962a-427e-a721-78ac82870cb4";
//     var url = "https://recipiebeckend.azurewebsites.net/planner/get-pre-weeks";

//     fetch(url)
//     .then(response => response.text())
//     .then(data => {
//         console.log("Data: " , data);
//         var weeklyPlannerDiv = document.getElementById("weekly_planner");
//         weeklyPlannerDiv.innerHTML = createWeeklyPlannerTable(data);
//     })
//     .catch(error => console.error('Error fetching data:', error));
// }

function getPreWeeks() {
    var url = "https://run.mocky.io/v3/16b0da6a-962a-427e-a721-78ac82870cb4";
    const JWTAccessToken = sessionStorage.getItem('accessToken');

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': JWTAccessToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text(); // Assuming the response is JSON
    })
    .then(data => {
        console.log("Data:", data);
        var weeklyPlannerDiv = document.getElementById("weekly_planner");
        weeklyPlannerDiv.innerHTML = createWeeklyPlannerTable(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}


var weeksData; // Global değişken olarak tanımlıyoruz

function createWeeklyPlannerTable(data) {
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var meals = ['Breakfast', 'Lunch', 'Dinner'];
    weeksData = data.split(';'); // Global weeksData değişkenini tanımlıyoruz

    var tableHtml = "";

    for (var w = 0; w < weeksData.length-1 ; w++) {
        var daysData = weeksData[w].split(':');
        tableHtml += "<section class='meal-plan' id='sortable-section'>";

        for (var i = 0; i < daysData.length; i++) {
            var mealsList = daysData[i].split(',');
            tableHtml += "<div class='day' data-day='" + days[i] + "'>";
            tableHtml += "<h3>" + days[i] + " <span class='add-item'></span></h3>";
            tableHtml += "<ul class='items' id='" + days[i].toLowerCase() + "Items'>";

            for (var j = 0; j < mealsList.length; j++) {
                tableHtml += "<li class='" + meals[j].toLowerCase() + "'>" + mealsList[j] + "</li>";
            }

            tableHtml += "</ul></div>";
        }

        tableHtml += "<button class='use-week-button' data-week='" + (w + 1) + "' onclick='populateMealPlan(" + (w + 1) + ")'>Use this week</button>";
        tableHtml += "</section>";

        if (w < weeksData.length - 1 && weeksData[w + 1].trim() !== "") {
            tableHtml += "<div class='week-divider'></div>";
        }
    }

    return tableHtml;
}

function populateMealPlan(weekNumber) {
    // Haftanın tablosunu seç
    var mealPlanDays = document.querySelectorAll('.meal-plan .day');

    mealPlanDays.forEach(function(day, index) {
        var mealsList = weeksData[weekNumber - 1].split(':')[index].split(',');

        var mealPlanItems = day.querySelectorAll('.items li');

        mealsList.forEach(function(meal, i) {
            mealPlanItems[i].innerText = meal;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupBackButton();
});

function setupBackButton() {
    const backButton = document.getElementById('back-arrow-button');

    backButton.addEventListener('click', () => {
        window.history.back();
        // window.history.go(-1);
    });
}

// $(document).ready(function(){

// // ADDING A NEW ITEM TO THE LIST

//     // Define the callback function
//     var addItem = function() {

//     // Declare a variable to capture the input text value
//     var $input = $('.submission-line__input').val();
//     // If the input text field isn't empty, add it to the list as a new item
//     if ($input) {
//         $('.list').prepend('<li class="list__item"><a class="list__delete-btn">X</a>' + $input + '<a class="list__check-btn">✔</a></li>');
//     }
//     // Clear the input text field
//     $('.submission-line__input').val("");
//     };

//     // Add a new item to the list by clicking "Add" button
//     $('.submission-line__btn').on('click', function(event){
//     // (prevents form submit button unwanted default action)
//     event.preventDefault();
//     // run the callback function
//     addItem();
//     });

//     // Add a new item to the list by hitting "Enter"
//     $('.submission-line__input').keypress(function(event){
//     if (event.which === 13) {
//         // run the callback function
//         addItem();
//     }
//     });

// // DELETING AN ITEM FROM THE LIST

//     // Clicking an item's delete button:
//     $('.list').on('click', '.list__delete-btn', function(){
//     // removes that item from the list
//     $(this).parent().fadeOut(300, function(){
//         $(this).remove();
//     });
//     });

// // CHECKING AN ITEM OFF FROM THE LIST

//     // Clicking an item's check button:
//     $('.list').on('click', '.list__check-btn', function(event){
//     // grays everything out
//     $(this).parent().toggleClass('list__item--checked');
//     $(this).siblings().toggleClass('list__delete-btn--checked');
//     $(this).toggleClass('list__check-btn--checked');

//     // moves the element to either the bottom or top of the list
//     var $listItem = $(this).parent();
//     if ($listItem.hasClass('list__item--checked')) {
//         $('.list').append($listItem);
//     } else {
//         $('.list').prepend($listItem);
//     }
//     });

// // MAKING LIST ITEMS SORTABLE

//     $('.list').sortable({
//         distance: 2,
//         revert: 300,
//         cancel: ".list__item--checked"
//     });

// });
