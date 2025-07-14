/*
    # Coded With 🧡 By Youssef Almodhesh
*/

let overlay = document.querySelector(".overlay");
let addItem = document.querySelector(".add-item");
let closeModal = document.querySelector(".close-modal");
let saveModal = document.querySelector(".save-modal");
let alerts = document.querySelector(".alerts");
let itemsTable = document.querySelector(".items-table");
let noDataAlert = document.querySelector(".no-data-alert");
let itemsCount = document.querySelector(".items-count");

let items = document.getElementById("items");
let iName = document.getElementById("iName");
let description = document.getElementById("description");
let category = document.getElementById("category");
let price = document.getElementById("price");
let imgUrl = document.getElementById("imgUrl");

let iId = 0;

const checkOrder = () => {
    let i = items.children;
    itemsCount.innerHTML = i.length;
    
    if (i.length == 0) {
        itemsTable.classList.add("d-none");
        noDataAlert.classList.remove("d-none");
    } else {
        itemsTable.classList.remove("d-none");
        noDataAlert.classList.add("d-none");
        Array.from(i).forEach((e, index) => {            
            e.querySelector("#order").innerHTML = index+1;
        });
    }
}

checkOrder();

const loadLocalStorage = (itemId=null, itemName=null, itemDescription=null, itemCategory=null, itemPrice=null, itemImgUrl=null) => {
    if (localStorage.items == undefined) localStorage.setItem("items", "[]");
    let allItems = JSON.parse(localStorage.items);
    if (itemId == null) {
        items.innerHTML = "";
        let indx = 0;
        for (const i of allItems) {
            let tRow = document.createElement("tr");
            tRow.id = "item-"+i.id;
            tRow.innerHTML = `<td id="order">1</td>
                            <td id="td-iName">${i.name}</td>
                            <td id="td-description">${i.description}</td>
                            <td id="td-category">${i.category}</td>
                            <td id="td-price">${i.price}$</td>
                            <td><img src="${i.img}" alt="${i.name}" onerror="this.src = './assets/img/error.png';"></td>
                            <td>
                                <button type="button" class="item-action edit-item" onclick="editItem(${i.id})"><i class="bi bi-pencil-square"></i></button>
                                &nbsp;<button type="button" class="item-action delete-item" onclick="delItem(${i.id})"><i class="bi bi-trash3"></i></button>
                            </td>`;
            items.appendChild(tRow);
            indx = i.id;
        }
        iId = indx+1;
    } else {
        allItems.push({id: iId, name:itemName, description: itemDescription, category: itemCategory, price: itemPrice, img: itemImgUrl});
        localStorage.setItem("items", JSON.stringify(allItems));

        loadLocalStorage();
    }

    checkOrder();
}

loadLocalStorage();

const alertFunc = (t, m) => {
    let a;

    let alertElement = document.createElement("div");
    
    if (t == "error") {
        a = "bg-danger";
    } else if (t == "success") {
        a = "bg-success";
    }

    alertElement.innerHTML = m;

    alertElement.classList.add("alert", "swiperight", a);

    alertElement.onanimationend = function (e) {            
        if (e.animationName == "swiperight") {
            alertElement.classList.replace("swiperight", "swipeleft");
        } else {
            alertElement.remove();
        }
    }

    alerts.appendChild(alertElement);
}

const clearFields = () => {
    iName.value = "";
    description.value = "";
    category.selectedIndex = 0;
    price.value = "";
    imgUrl.value = "";
}

const delItem = (i) => {
    document.getElementById("item-"+i).remove();
    alertFunc("success", "Item has been deleted successfully");

    let allItems = JSON.parse(localStorage.items);
    for (let index = 0; index < allItems.length; index++) {
        if (allItems[index].id == i) allItems.splice(index, 1);
    }
    localStorage.setItem("items", JSON.stringify(allItems));

    loadLocalStorage();
}

const editItem = (i) => {
    let td = document.getElementById("item-"+i);
    
    let tdItems = {
        iName: td.querySelector("#td-iName").textContent,
        description: td.querySelector("#td-description").textContent,
        category: td.querySelector("#td-category").textContent,
        price: td.querySelector("#td-price").textContent,
        imgUrl: td.querySelector("img").src
    };
    
    iName.value = tdItems.iName;
    description.value = tdItems.description;
    price.value = parseInt(tdItems.price);
    imgUrl.value = tdItems.imgUrl;
    
    let c = 0;
    for (const e of category.querySelectorAll("option")) {
        if (e.value == tdItems.category) {
            category.selectedIndex = c;
            break;
        }
        c++;
    }
    
    toggleOverlay();
    saveModal.setAttribute("data-edit", i);
}

let toggleOverlay = () => {
    overlay.onanimationend = null;
    saveModal.removeAttribute("data-edit");

    if (overlay.classList.contains("d-none")) {
        overlay.classList.remove("d-none");
        overlay.classList.remove("fadeout-animation");
        overlay.classList.add("fadein-animation");
    } else {
        overlay.classList.remove("fadein-animation");
        overlay.classList.add("fadeout-animation");
        overlay.onanimationend = () => {
            overlay.classList.add("d-none");
        }
    }
}

let fields = () => {
    let fields = {
        iName: iName.value.trim(),
        description: description.value.trim(),
        category: (category.value == "none") ? "": category.value,
        price: price.value.trim(),
        imgUrl: imgUrl.value.trim()
    }
    for (const item in fields) {
        if (!fields[item]) return false;
    }
    return fields;
}

addItem.addEventListener("click", toggleOverlay);
closeModal.addEventListener("click", () => {
    toggleOverlay();
    clearFields();
});

saveModal.addEventListener("click", function () {
    let inputFields = fields();
    if (inputFields) {
        if (this.hasAttribute("data-edit")) {
                let td = +this.getAttribute("data-edit");
                
                let allItems = JSON.parse(localStorage.items);
                for (let index = 0; index < allItems.length; index++) {
                    if (allItems[index].id == td) {
                        allItems[index].name = inputFields.iName;
                        allItems[index].description = inputFields.description;
                        allItems[index].category = inputFields.category;
                        allItems[index].price = inputFields.price;
                        allItems[index].img = inputFields.imgUrl;
                    }
                }
                localStorage.setItem("items", JSON.stringify(allItems));
                loadLocalStorage();

                alertFunc("success", "Item has been updated successfully");
        } else {
            loadLocalStorage(iId, inputFields.iName, inputFields.description, inputFields.category, inputFields.price, inputFields.imgUrl);
            alertFunc("success", "Item has been added successfully");
        }

        checkOrder();
        clearFields();
        toggleOverlay();
    } else {
        alertFunc("error", "Please fill all required fields.");
    }
});