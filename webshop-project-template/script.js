var state = {
    products: [
        {
            id: uuidv4(),
            name: "Teszt termék 1",
            price: 2500,
            isInStock: true,
        },
        {
            id: uuidv4(),
            name: "Teszt termék 2",
            price: 3000,
            isInStock: true,
        },
        {
            id: uuidv4(),
            name: "Teszt termék 3",
            price: 3500,
            isInStock: true,
        },
        {
            id: uuidv4(),
            name: "Teszt termék 4",
            price: 4000,
            isInStock: false,
        }
    ],
    editedId: ''
};

function renderEditProduct() {
   
    if(state.editedId === "") {
        document.querySelector("#edit-product").innerHTML = "";
        return;
    }
   
    var foundProduct;
    for (var product of state.products) {
        if (product.id === state.editedId) {
            foundProduct = product;
            break;
        }
    }

    var editFormHTML = `
    <h3>Termék szerkesztése</h3>
    <form id="update-product" class="p-5">
            <label class="w-100">
              Név:
              <input class="form-control" type="text" name="name" value="${foundProduct.name}">
            </label>
            <label class="w-100">
              Ár:
              <input class="form-control" type="number" name="price" value="${foundProduct.price}">
            </label>
            <label class="w-100">
              Van készleten?
              <input class="form-control" type="checkbox" name="isInStock" ${foundProduct.isInStock ? "checked" : ""}>
            </label>
            <button class="btn btn-primary" type="submit">Küldés</button>
        </form>
    `;

    document.querySelector("#edit-product").innerHTML = editFormHTML;

    document.querySelector("#update-product").onsubmit = function (event) {
        event.preventDefault();

        var price = Number(event.target.elements.price.value);
        var name = event.target.elements.name.value;
        var isInStock = event.target.elements.isInStock.checked;

        var foundIndex;
        for (var index = 0; index < state.products.length; index++) {
            if (state.products[index].id === state.editedId) {
                foundIndex = index;
                break;
            }
        }


        state.products[foundIndex] = {
            id: state.editedId,
            name: name,
            price: price,
            isInStock: isInStock,
          };
          state.editedId ="";

        
        renderProducts();
        renderEditProduct();
    }

}

//lista készítése, rajzolása - ezt kell berakni minden funkcióba, hogy újrarajzolja a listát változás után
function renderProducts() {
    var productListTemplate = "";

    for (var product of state.products) {
        productListTemplate += `
    <div class="card m-2 p-2 ${product.isInStock === false ? 'bg-danger' : ''}">
    <p>${product.name}</p>
    <p>${product.price}</p>
    <button class="btn btn-warning float-right mb-2 edit-product" data-productid=${product.id}>
    Szerkeztés</button>
    <button class="btn btn-danger float-right delete-product" data-productid=${product.id}>
    Törlés</button>
    </div>
    `;
    }

    document.querySelector("#product-list-component").innerHTML = productListTemplate;

    for (var editBtn of document.querySelectorAll(".edit-product")) {
        editBtn.onclick = function (event) {
            var id = event.target.dataset.productid;
            state.editedId = id;
            renderEditProduct();
        }
    }


    for (var deleteBtn of document.querySelectorAll(".delete-product")) {
        deleteBtn.onclick = function (event) {

            var id = event.target.dataset.productid;

            var foundIndex;

            for (var index = 0; index < state.products.length; index++) {
                if (state.products[index].id === id) {
                    foundIndex = index;
                    break;
                }
            }

            state.products.splice(foundIndex, 1);

            renderProducts();
        }
    }
}


document.querySelector("#create-product").onsubmit = function (event) {
    event.preventDefault();

    var name = event.target.elements.name.value;
    var price = Number(event.target.elements.price.value);
    var isInStock = event.target.elements.isInStock.checked;

    console.log(name, price, isInStock);

    state.products.push(
        {
            id: uuidv4(),
            name: name,
            price: price,
            isInStock: isInStock
        },
    );

    renderProducts();
}


//random ID generator StackOverFlowról
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

window.onload = renderProducts;