function deleteExpense(id) {
  const confirmed = confirm("Do you want to delete this expense?")
  if(confirmed) {
    fetch(`http://127.0.0.1:3000/api/expenses/${id}`, {
      method: 'DELETE'
    } )
    .then((response) => response.json())
    .then(data => {
      console.log(data.message);
      displayExpenses();
    })
    .catch(error => {
     displayExpenses();
    })
    location.reload(true)
  }
   
 }
document.addEventListener("DOMContentLoaded", function () {
  const expensesForm = document.getElementById("expenses-form");
  const expensesData = document.getElementById("expenses-data");

  // Handle expenses form submission
  expensesForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form data
    const expenseType = document.getElementById("expense-type").value;
    const cost = document.getElementById("expense-cost").value;
    const date = document.getElementById("expense-date").value;

    // Debugging: Log form data
    console.log("Expense Type:", expenseType);
    console.log("Cost:", cost);
    console.log("Date:", date);

    // Save to the database
    fetch("http://127.0.0.1:3000/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenseType, cost, date }),
    })
      .then((response) => {
        console.log("Respone: ", response)
        return response.json()
      })
      .then((data) => {
        console.log("Response from server:", data.message);
        // Display saved expenses
        displayExpenses();
        // Clear form
        expensesForm.reset();
      })
      .catch((error) => {
        console.error("Error saving expense:", error);
      });
  });

  

  function displayExpenses() {
    fetch("http://localhost:3000/api/expenses")
      .then((response) => response.json())
      .then((expenses) => {
        expensesData.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Cost (Ksh)</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="expenses-table-body"></tbody>
          </table>
        `;
  
        const tableBody = document.getElementById("expenses-table-body");
  
        expenses.forEach((expense) => {
          const row = document.createElement("tr");
  
          row.innerHTML = `
            <td><input type="text" id="expense-type-${expense.id}" value="${expense.Type}" disabled></td>
            <td><input type="number" id="expense-cost-${expense.id}" value="${expense.Price}" disabled></td>
            <td><input type="date" id="expense-date-${expense.id}" value="${expense.Date}" disabled></td>
            <td>
              <button onclick="enableEditing(${expense.id})">Edit</button>
              <button id="save-btn-${expense.id}" onclick="saveExpense(${expense.id})" style="display:none;">Save</button>
              <button onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
          `;
  
          tableBody.appendChild(row);
        });
      });
  }
  
  
  

  // Initial display of expenses
  displayExpenses();

  
});
function updateExpense(id) {
  const updatedData = {
    type: document.getElementById(`expense-type-${id}`).value,
    cost: document.getElementById(`expense-cost-${id}`).value,
    date: document.getElementById(`expense-date-${id}`).value
  };

  fetch(`http://127.0.0.1:3000/api/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data.message);
    displayExpenses();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
function enableEditing(id) {
  // Enable the input fields for editing
  document.getElementById(`expense-type-${id}`).disabled = false;
  document.getElementById(`expense-cost-${id}`).disabled = false;
  document.getElementById(`expense-date-${id}`).disabled = false;

  // Show the Save button
  document.getElementById(`save-btn-${id}`).style.display = "inline";

  // Optionally, you could hide the Update button if you don't want both visible
  // event.target.style.display = "none"; // Uncomment this line to hide the Update button
}
function saveExpense(id) {
  const updatedData = {
    type: document.getElementById(`expense-type-${id}`).value,
    cost: document.getElementById(`expense-cost-${id}`).value,
    date: document.getElementById(`expense-date-${id}`).value
  };

  fetch(`http://127.0.0.1:3000/api/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data.message);
    displayExpenses();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}