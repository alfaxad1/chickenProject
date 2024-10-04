function deletePurchase(id) {
    const confirmed = confirm("Do you want to delete this purchase?")
    if(confirmed) {
      fetch(`http://127.0.0.1:3000/api/purchases/${id}`, {
        method: 'DELETE'
      } )
      .then((response) => response.json())
      .then(data => {
        console.log(data.message);
        displayPurchases();
      })
      .catch(error => {
       displayPurchases();
      })
      location.reload(true)
    }
     
   }
document.addEventListener('DOMContentLoaded', function() {
    const purchaseForm = document.getElementById('purchase-form');
    const purchasesData = document.getElementById('purchases-data');

    // Handle purchase form submission
    purchaseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const product = document.getElementById('product').value;
        const qty = document.getElementById('quantity').value;
        const price = document.getElementById('cost').value;
        const date = document.getElementById('purchase-date').value;

        // Save to local storage or database
        fetch('http://localhost:3000/api/purchases', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({product, qty, price, date})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message)
            // Display saved purchases
                displayPurchases();

        // Clear form
         purchaseForm.reset();
        })
        .catch(error => console.error("Error: ", error));
        // let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        // purchases.push({ product, quantity, cost, date });
        // localStorage.setItem('purchases', JSON.stringify(purchases));

        
    });

    function displayPurchases() {
      fetch('http://localhost:3000/api/purchases')
        .then(response => response.json())
        .then(purchases => {
          purchasesData.innerHTML = `
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity (kg)</th>
                  <th>Cost (Ksh)</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="purchases-table-body"></tbody>
            </table>
          `;
    
          const tableBody = document.getElementById("purchases-table-body");
    
          purchases.forEach(purchase => {
            const row = document.createElement('tr');
    
            row.innerHTML = `
              <td><input type="text" id="purchase-product-${purchase.id}" value="${purchase.product_name}" disabled></td>
              <td><input type="number" id="purchase-quantity-${purchase.id}" value="${purchase.quantity}" disabled></td>
              <td><input type="number" id="purchase-price-${purchase.id}" value="${purchase.price}" disabled></td>
              <td><input type="date" id="purchase-date-${purchase.id}" value="${purchase.purchase_date}" disabled></td>
              <td>
                <button onclick="enableEditingPurchase(${purchase.id})">Edit</button>
                <button id="save-btn-purchase-${purchase.id}" onclick="savePurchase(${purchase.id})" style="display:none;">Save</button>
                <button onclick="deletePurchase(${purchase.id})">Delete</button>
              </td>
            `;
    
            tableBody.appendChild(row);
          });
        })
        .catch(error => console.error("Error: ", error));
    }
    

    function enableEditingPurchase(id) {
      console.log("Enable Editing for ID:", id); // Debugging: Check if function is triggered
    
      // Enable the input fields for editing
      document.getElementById(`purchase-product-${id}`).disabled = false;
      document.getElementById(`purchase-quantity-${id}`).disabled = false;
      document.getElementById(`purchase-price-${id}`).disabled = false;
      document.getElementById(`purchase-date-${id}`).disabled = false;
    
      // Show the Save button
      document.getElementById(`save-btn-purchase-${id}`).style.display = "inline";
    }
    
    function savePurchase(id) {
      console.log("Saving Purchase ID:", id); // Debugging: Check if save function is triggered
    
      const updatedData = {
        product_name: document.getElementById(`purchase-product-${id}`).value,
        quantity: document.getElementById(`purchase-quantity-${id}`).value,
        price: document.getElementById(`purchase-price-${id}`).value,
        purchase_date: document.getElementById(`purchase-date-${id}`).value
      };
    
      fetch(`http://127.0.0.1:3000/api/purchases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        displayPurchases(); // Refresh the display
      })
      .catch(error => console.error('Error:', error));
    }
   
    // Initial display of purchases
   displayPurchases();
});

