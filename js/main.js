const API = "http://localhost:8000/product";

// ? Сохранение тегов в переменные
let block_info = document.getElementById("block_info");
let cardIn = document.getElementById("cardIn");
let closeIn = document.getElementById("closeIn");
let cardP = document.getElementById("textin");

// инпуты и кнопки для создания новых данных
let inpDetails = document.querySelector(".section__add_details");
let inpPrice = document.querySelector(".section__add_price");
let inpQuantity = document.querySelector(".section__add_quantity");
let inpSales = document.querySelector(".section__add_sales");
let inpCategory = document.querySelector(".section__add_category");
let inpUrl = document.querySelector(".section__add_url");
let btnAdd = document.querySelector(".section__add_btn-add");

// тег для отображения данных в браузере
let sectionRead = document.getElementById("section__read");

// инпуты и кнопки для редактирования
let inpEditDetails = document.querySelector(".window__edit_details");
let inpEditPrice = document.querySelector(".window__edit_price");
let inpEditQuantity = document.querySelector(".window__edit_quantity");
let inpEditSales = document.querySelector(".window__edit_sales");
let inpEditCategory = document.querySelector(".window__edit_category");
let inpEditUrl = document.querySelector(".window__edit_url");
let btnEditSave = document.querySelector(".window__edit_btn-save");
let mainModal = document.querySelector(".main-modal");
let btnEditClose = document.querySelector(".window__edit_close");

//  инпут и переменная для поиска
let inpSearch = document.querySelector(".nav__right_inp-search");
let searchValue = inpSearch.value;

// кнопки для пагинации
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let currentPage = 1;

// ! =========== Кодовое слово ==========
// let pinCode = prompt("Введите кодовое слово:");
// let section__add = document.querySelector(".section__add");
// let admin_panel_arr = document.getElementsByClassName("admin-panel");

// if (pinCode !== "Mirdin") {
//   // setTimeout(() => {
//   //   for (let i of admin_panel_arr) {
//   //     console.log(i);
//   //     i.style.display = "none";
//   //   }
//   // }, 100);
//   section__add.style.display = "none";
// } else {
//   // setTimeout(() => {
//   //   for (let i of admin_panel_arr) {
//   //     console.log(i);
//   //     i.style.display = "block";
//   //   }
//   // }, 1000);
//   section__add.style.display = "block";
// }

// ! =========== Create Start ===========
function createProduct(obj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  }).then(() => readProducts());
}

btnAdd.addEventListener("click", () => {
  // проверка на заполненность полей
  if (
    !inpDetails.value.trim() ||
    !inpPrice.value.trim() ||
    !inpCategory.value.trim() ||
    !inpQuantity.value.trim() ||
    !inpSales.value.trim() ||
    !inpUrl.value.trim()
  ) {
    alert("Заполните поле");
    return;
  }
  let obj = {
    details: inpDetails.value,
    price: inpPrice.value,
    quantity: inpQuantity.value,
    category: inpCategory.value,
    sales: inpSales.value,
    urlImg: inpUrl.value,
  };
  createProduct(obj);
  inpDetails.value = "";
  inpPrice.value = "";
  inpQuantity.value = "";
  inpCategory.value = "";
  inpSales.value = "";
  inpUrl.value = "";
});
// ? =========== Create End =============

// ! ============ Read Start ============
function readProducts() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`)
    .then(res => res.json())
    .then(data => {
      sectionRead.innerHTML = "";
      data.forEach(product => {
        a = product.price;
        b = product.sales;
        c = (a * b) / 100;
        v = a - c;

        sectionRead.innerHTML += `
        <div class="card">
        <h2>${product.category}</h2>
        <img
          class="card__bg"
          src=${product.urlImg}
          alt=${product.category}
        />
        <br>
        <div id="info_block">
          <span class="card__price">Цена : ${product.price} сом</span>
          <br>
          <span class="card__sales">Скидка : ${product.sales} %</span>
          <br>
          <span class="card__ps">Цена со скидкой : ${v} сом </span>
        </div>
        <p>
          ${product.details}
        </p>
        <div class="admin-panel">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1345/1345823.png"
            alt="delete"
            width="30"
            id=${product.id}
            class="read__del"
            onclick="deleteProduct(${product.id})"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
            alt="edit"
            width="30"
            onclick="handleEditBtn(${product.id})"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/3720/3720101.png"
            alt="edit"
            width="30"
            onclick="Info(${product.id})"
          />
        </div> 
      </div>
        `;
      });
    });
  pageTotal();
}

readProducts();
// ? ============ Read End ============
// ! ============ Delete Start ===========
// todo вариант 1 для удаления
// document.addEventListener("click", (e) => {
//   let del_class = [...e.target.classList];
//   if (del_class[0] === "read__del") {
//     console.log(e.target.id);
//     fetch(`${API}/${e.target.id}`, {
//       method: "DELETE",
//     }).then(() => readProducts());
//   }
// });

// todo вариант 2 для удаления
function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => readProducts());
}
// ? ============ Delete End ===========

// ! =============== Edit Sart ===========
function editProduct(id, editedObj) {
  // проверка на заполненность полей
  if (
    !inpEditDetails.value.trim() ||
    !inpEditPrice.value.trim() ||
    !inpEditCategory.value.trim() ||
    !inpEditQuantity.value.trim() ||
    !inpEditSales.value.trim() ||
    !inpEditUrl.value.trim()
  ) {
    alert("Заполните поле");
    return;
  }
  fetch(`${API}/${id}`, {
    method: "PATCH", // PUT - меняет объект целиком. PATCH - меняет только те ключи, которые нужны
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedObj),
  }).then(() => readProducts());
}

let editId = "";
function handleEditBtn(id) {
  mainModal.style.display = "block";
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(productObj => {
      inpEditDetails.value = productObj.details;
      inpEditPrice.value = productObj.price;
      inpEditQuantity.value = productObj.quantity;
      inpEditSales.value = productObj.sales;
      inpEditCategory.value = productObj.category;
      inpEditUrl.value = productObj.urlImg;
      editId = productObj.id;
      console.log(productObj);
    });
}

btnEditClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});

btnEditSave.addEventListener("click", () => {
  let editedObj = {
    details: inpEditDetails.value,
    price: inpEditPrice.value,
    quantity: inpEditQuantity.value,
    category: inpEditCategory.value,
    urlImg: inpEditUrl.value,
    sales: inpEditSales.value,
  };
  editProduct(editId, editedObj);
  mainModal.style.display = "none";
});
// ? =============== Edit End ===========
// ! ============ Info Start ==============
function Info(id) {
  block_info.style.display = "flex";
  cardIn.style.display = "flex";
  // cardP.style.display = "flex";
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(product => {
      cardIn.innerHTML += `
      <img src="${product.urlImg}"alt="edit"/>
      <p id="textin">Oписание : ${product.details}</p>
      <p id="textin">Цена : ${product.price} сом</p>
      <p id="textin">Количество : ${product.quantity}</p>
      <p id="textin">Категория : ${product.category}</p>
      <p id="textin">Скидка : ${product.sales} %</p>
      <p id="textin">Цена co скидкой : ${v} сом</p>`;
    });
  closeIn.addEventListener("click", () => {
    block_info.style.display = "none";
    cardIn.innerHTML = "";
  });
}

// ? ============ Info Start =============

// ! ============ Search Start ==========
inpSearch.addEventListener("input", e => {
  searchValue = e.target.value;
  readProducts();
});
// ? ============ Search End ==========

// ! ========== Paginate Start =========
let countPage = 1;
function pageTotal() {
  fetch(`${API}?q=${searchValue}`)
    .then(res => res.json())
    .then(data => {
      countPage = Math.ceil(data.length / 6);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});
// ? ========== Paginate End ==========
