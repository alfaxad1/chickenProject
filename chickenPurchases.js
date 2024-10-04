document.addEventListener('DOMContentLoaded', function () {
    // Function to display chicken purchases
    function displayChickenPurchases() {
      const chickenPurchasesData = document.getElementById('chicken-purchases-data');
      if (chickenPurchasesData) {
        chickenPurchasesData.remove();
      } else {
        fetch('http://localhost:3000/api/chicken-purchases')
          .then(response => response.json())
          .then(chickenPurchases => {
            const chickenPurchasesTable = document.createElement('div');
            chickenPurchasesTable.id = 'chicken-purchases-data';
            chickenPurchasesTable.innerHTML = `
              <h3>Saved Chicken Purchases</h3>
              <table>
                <thead>
                  <tr>
                    <th>Supplier ID</th>
                    <th>Chicken Type</th>
                    <th>Price per Piece</th>
                    <th>No. of Pieces</th>
                    <th>Total Price</th>
                    <th>Purchase Date</th>
                  </tr>
                </thead>
                <tbody id="chicken-purchases-table-body"></tbody>
              </table>
            `;
            document.body.appendChild(chickenPurchasesTable);
            const tableBody = document.getElementById("chicken-purchases-table-body");
  
            chickenPurchases.forEach(chickenPurchase => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${chickenPurchase.supplier_id}</td>
                <td>${chickenPurchase.chicken_type}</td>
                <td>${chickenPurchase.price_per_piece}</td>
                <td>${chickenPurchase.no_of_pieces}</td>
                <td>${chickenPurchase.total_price}</td>
                <td>${chickenPurchase.purchase_date}</td>
              `;
              tableBody.appendChild(row);
            });
          })
          .catch(error => console.error("Error: ", error));
      }
    }
  
    // Create "Saved Chicken Purchases" button
    const savedChickenPurchasesButton = document.createElement('button');
    savedChickenPurchasesButton.textContent = 'Saved Chicken Purchases';
    savedChickenPurchasesButton.onclick = function() {
      const chickenPurchasesData = document.getElementById('chicken-purchases-data');
      if (chickenPurchasesData) {
        chickenPurchasesData.remove();
      } else {
        displayChickenPurchases();
      }
    };
    document.body.appendChild(savedChickenPurchasesButton);
  
    // Function to save a chicken purchase
    function saveChickenPurchase() {
      const supplierId = document.getElementById('supplier-id').value;
      const chickenType = document.getElementById('type-of-chicken').value;
      const pricePerPiece = parseFloat(document.getElementById('price-per-piece').value);
      const numberOfPieces = parseInt(document.getElementById('number-of-pieces').value);
      const totalPrice = pricePerPiece * numberOfPieces;
      const purchaseDate = document.getElementById('purchase-date').value;
  
      fetch('http://localhost:3000/api/chicken-purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          chicken_type: chickenType,
          price_per_piece: pricePerPiece,
          no_of_pieces: numberOfPieces,
          total_price: totalPrice,
          purchase_date: purchaseDate
        })
      })
        .then(response => response.json())
        .then(data => console.log("Chicken purchase saved successfully:", data))
        .catch(error => console.error("Error saving chicken purchase:", error));
    }
  
    // Add event listener to save button
    document.getElementById('chickenPurchases-form').addEventListener('submit', function(event) {
      event.preventDefault();
      saveChickenPurchase();
    });
  });