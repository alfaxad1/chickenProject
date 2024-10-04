document.addEventListener('DOMContentLoaded', function () {
  const saleTypeSelect = document.getElementById('sale-type');
  const chickenSaleFields = document.getElementById('chicken-sale-fields');
  const eggsSaleFields = document.getElementById('eggs-sale-fields');
  const salesForm = document.getElementById('sales-form');
  const salesData = document.getElementById('sales-data');
  chickenSaleFields.style.display = 'block';
  eggsSaleFields.style.display = 'none';

  let customer_id = 0;
  let chicken_type = "";
  let quantity_sold = 0;
  let price_per_piece = 0;
  let number_of_pieces = 0;
  let total_price_chicken = 0;
  let price_per_tray = 0;
  let total_price_eggs = 0;
  let date = "";
  let sale_type = "chicken";

  // Handle sale type change
  saleTypeSelect.addEventListener('change', function () {
    if (this.value === 'chicken') {
      sale_type = 'chicken';
      chickenSaleFields.style.display = 'block';
      eggsSaleFields.style.display = 'none';
    } else {
      sale_type = 'eggs';
      chickenSaleFields.style.display = 'none';
      eggsSaleFields.style.display = 'block';
    }
  });

  // Handle sales form submission
  salesForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form data based on sale type
    let saleData;
    if (saleTypeSelect.value === 'chicken') {
      customer_id = document.getElementById('customer-id-chicken').value;
      chicken_type = document.getElementById('type-of-chicken').value;
      price_per_piece = parseFloat(document.getElementById('price-per-piece').value);
      number_of_pieces = parseInt(document.getElementById('number-of-pieces').value);
      total_price_chicken = price_per_piece * number_of_pieces;
      date = document.getElementById('chicken-sale-date').value;
      saleData = {
        customer_id,
        chicken_type,
        price_per_piece,
        number_of_pieces,
        total_price_chicken,
        date,
        sale_type
      };
    } else {
      customer_id = document.getElementById('customer-id-eggs').value;
      quantity_sold = parseInt(document.getElementById('quantity-trays').value);
      price_per_tray = parseFloat(document.getElementById('price-per-tray').value);
      total_price_eggs = price_per_tray * quantity_sold;
      date = document.getElementById('eggs-sale-date').value;
      saleData = {
        customer_id,
        quantity_sold,
        price_per_tray,
        total_price_eggs,
        date,
        sale_type
      };
    }

    // Save to database
    fetch('http://localhost:3000/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Display saved Sales
        displaySales();
        // Clear form
        salesForm.reset();
        saleTypeSelect.value = ''; // Reset sale type selection
        chickenSaleFields.style.display = 'none';
        eggsSaleFields.style.display = 'none';
      });
  });

  function displaySales() {
    const salesData = document.getElementById('sales-data');
    if (salesData) {
      salesData.remove();
    } else {
      fetch('http://localhost:3000/api/sales')
        .then(response => response.json())
        .then(sales => {
          const salesTable = document.createElement('div');
          salesTable.id = 'sales-data';
          salesTable.innerHTML = `
            <h3>Saved Sales</h3>
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Type/Quantity</th>
                  <th>Price per Unit</th>
                  <th>Total Price (Ksh)</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="sales-table-body"></tbody>
            </table>
          `;
          document.body.appendChild(salesTable);
          const tableBody = document.getElementById("sales-table-body");
  
          sales.forEach(sale => {
            const row = document.createElement('tr');
            if (sale.sale_type === 'chicken') {
              row.innerHTML = `
                <td><input type="text" id="sale-customer-${sale.id}" value="${sale.customer_id}" disabled></td>
                <td><input type="text" id="sale-type-${sale.id}" value="${sale.chicken_type}" disabled></td>
                <td><input type="number" id="sale-price-per-piece-${sale.id}" value="${sale.price_per_piece}" disabled></td>
                <td><input type="number" id="sale-total-price-${sale.id}" value="${sale.total_price_chicken}" disabled></td>
                <td><input type="date" id="sale-date-${sale.id}" value="${sale.date}" disabled></td>
                <td>
                  <button onclick="enableEditingSale(${sale.id})">Edit</button>
                  <button id="save-btn-sale-${sale.id}" onclick="saveSale(${sale.id})" style="display:none;">Save</button>
                  <button onclick="deleteSale(${sale.id})">Delete</button>
                </td>
              `;
            } else {
              row.innerHTML = `
                <td><input type="text" id="sale-customer-${sale.id}" value="${sale.customer_id}" disabled></td>
                <td><input type="number" id="sale-quantity-${sale.id}" value="${sale.quantity_sold}" disabled></td>
                <td><input type="number" id="sale-price-per-tray-${sale.id}" value="${sale.price_per_tray}" disabled></td>
                <td><input type="number" id="sale-total-price-${sale.id}" value="${sale.total_price_eggs}" disabled></td>
                <td><input type="date" id="sale-date-${sale.id}" value="${sale.date}" disabled></td>
                <td>
                  <button onclick="enableEditingSale(${sale.id})">Edit</button>
                  <button id="save-btn-sale-${sale.id}" onclick="saveSale(${sale.id})" style="display:none;">Save</button>
                  <button onclick="deleteSale(${sale.id})">Delete</button>
                </td>
              `;
            }
            tableBody.appendChild(row);
          });
        })
        .catch(error => console.error("Error: ", error));
    }
  }

  // Function to enable editing a sale
  function enableEditingSale(id) {
    console.log("Enable Editing for Sale ID:", id); // Debugging: Check if function is triggered
    // Enable the input fields for editing
    document.getElementById(`sale-customer-${id}`).disabled = false;
    if (document.getElementById(`sale-type-${id}`)) {
      document.getElementById(`sale-type-${id}`).disabled = false;
    }
    if (document.getElementById(`sale-price-per-piece-${id}`)) {
      document.getElementById(`sale-price-per-piece-${id}`).disabled = false;
    }
    if (document.getElementById(`sale-quantity-${id}`)) {
      document.getElementById(`sale-quantity-${id}`).disabled = false;
    }
    if (document.getElementById(`sale-price-per-tray-${id}`)) {
      document.getElementById(`sale-price-per-tray-${id}`).disabled = false;
    }
    document.getElementById(`sale-date-${id}`).disabled = false;
    // Show the Save button
    document.getElementById(`save-btn-sale-${id}`).style.display = "inline";
  }

  // Function to save a sale
  function saveSale(id) {
    console.log("Saving Sale ID:", id); // Debugging: Check if save function is triggered
    let updatedData;
    if (document.getElementById(`sale-type-${id}`)) {
      updatedData = {
        customer_id: document.getElementById(`sale-customer-${id}`).value,
        chicken_type: document.getElementById(`sale-type-${id}`).value,
        price_per_piece: parseFloat(document.getElementById(`sale-price-per-piece-${id}`).value),
        number_of_pieces: parseInt(document.getElementById(`sale-quantity-${id}`).value),
        total_price_chicken: parseFloat(document.getElementById(`sale-total-price-${id}`).value),
        date: document.getElementById(`sale-date-${id}`).value,
        sale_type: 'chicken'
      };
    } else {
      updatedData = {
        customer_id: document.getElementById(`sale-customer-${id}`).value,
        quantity_sold: parseInt(document.getElementById(`sale-quantity-${id}`).value),
        price_per_tray: parseFloat(document.getElementById(`sale-price-per-tray-${id}`).value),
        total_price_eggs: parseFloat(document.getElementById(`sale-total-price-${id}`).value),
        date: document.getElementById(`sale-date-${id}`).value,
        sale_type: 'eggs'
      };
    }
    fetch(`http://127.0.0.1:3000/api/sales/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        displaySales(); // Refresh the display
      })
      .catch(error => console.error('Error:', error));
  }

  // Function to delete a sale
  window.deleteSale = function(id) {
    const confirmed = confirm("Do you want to delete this sale?");
    if (confirmed) {
      fetch(`http://127.0.0.1:3000/api/sales/${id}`, {
        method: 'DELETE'
      })
        .then((response) => response.json())
        .then(data => {
          console.log(data.message);
          displaySales();
        })
        .catch(error => {
          console.error('Error:', error);
          displaySales();
        });
      location.reload(true );
    }
  }

  // Add a button to display saved sales
  const savedSalesButton = document.createElement('button');
  savedSalesButton.textContent = 'Saved Sales';
  savedSalesButton.onclick = function() {
    const salesData = document.getElementById('sales-data');
    if (salesData) {
      salesData.remove();
    } else {
      displaySales();
    }
  };
  document.body.appendChild(savedSalesButton);
});