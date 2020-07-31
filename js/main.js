
let productId = document.getElementById("productId");
let productName = document.getElementById("productName");
let productBrand = document.getElementById("productBrand");
let productPrice = document.getElementById("productPrice");
let createBtn = document.getElementById("createBtn");
let readBtn = document.getElementById("readBtn");
let updateBtn = document.getElementById("updateBtn");
let deleteAllBtn = document.getElementById("deleteAllBtn");
let list = document.getElementById("list");



let createDB = () => {
    const db = new Dexie("productdatabase");

    db.version(1).stores({
        products: `++id, name, brand, price`
    });
    db.open();

    return db;
}

let db = createDB();


createBtn.onclick = () => {

    let obj = {
        name: productName.value,
        brand: productBrand.value,
        price: productPrice.value
    }

    let validateObj = validate(obj);
    
    if(validateObj) {
        db.products.bulkAdd([obj]);
        createElement();
        productName.value = productBrand.value = productPrice.value = "";
    }

}


let validate = obj => {
    let flag = "";

    for(let i in obj) {
        if(obj[i] != "") {
            flag = true;
        }else {
            flag = false;
        }
    }

    return flag;
}


let createElement = () => {
    db.products.count(item => {
        productId.value = item + 1;
    })

    list.innerHTML = "";
    let index = 1;

    db.products.each(row => {
        let tr = `
        <tr>
            <td>${index++}</td>
            <td>${row.name}</td>
            <td>${row.brand}</td>
            <td>$${row.price}</td>
            <td><span class="editicon" onclick="editItem(${row.id})">&#x270E;</span></td>
            <td><span class="deleteicon" onclick="deleteItem(${row.id})">&#128465;</span></td>
        </tr>`;

    list.innerHTML += tr;
    })

}


let editItem = id => {
    db.products.get(id, (item) => {
        productId.value = item.id;
        productName.value = item.name;
        productBrand.value = item.brand;
        productPrice.value = item.price;
    })
}


updateBtn.onclick = () => {
    let obj = {
        name: productName.value,
        brand: productBrand.value,
        price: productPrice.value
    }

    let validateObj = validate(obj);

    if(validateObj) {
        db.products.update(+productId.value, obj);
        createElement();
        productName.value = productBrand.value = productPrice.value = "";
    }

}


let deleteItem = id => {
    db.products.delete(id);
    createElement();
}


deleteAllBtn.onclick = () => {
    db.products.clear();
    createElement();
}


window.onload = createElement;
