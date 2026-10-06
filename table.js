let bookings = [];
let dealers = [];

async function loadBookings() {
  try {
    const response = await fetch("./data.json");
    bookings = await response.json();

    renderAllBookings();

    if (bookings.length > 0) {
      const latestBooking = bookings[bookings.length - 1];

      document.getElementById("dealer").value =
        latestBooking.dealer;

      renderDealerBookings(latestBooking.dealer);
    }
  } catch (error) {
    console.error("Failed to load bookings:", error);
  }
}

function renderAllBookings() {
  const table = document.getElementById("allBookingsTable");

  table.innerHTML = bookings
    .map(
      (booking) => `
        <tr>
          <td>${booking.dealer}</td>
          <td>${booking.customer}</td>
          <td>${booking.car}</td>
          <td>${formatDate(booking.starttime)}</td>
          <td>${formatDate(booking.endtime)}</td>
          <td>${formatDate(booking.timestamp)}</td>
        </tr>
      `
    )
    .join("");
}

function renderDealerBookings(dealerName) {
  const table = document.getElementById("dealerBookingsTable");

  const filtered = bookings.filter(
    (booking) => booking.dealer === dealerName
  );

  table.innerHTML = filtered
    .map(
      (booking) => `
        <tr>
          <td>${booking.customer}</td>
          <td>${booking.car}</td>
          <td>${formatDate(booking.starttime)}</td>
          <td>${formatDate(booking.endtime)}</td>
          <td>${formatDate(booking.timestamp)}</td>
        </tr>
      `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadBookings();
});


async function loadDealers() {
  try {
    const response = await fetch("./dealers.json");
    dealers = await response.json();

    const dealerInput = document.getElementById("dealer");
    const results = document.getElementById("results");

    dealerInput.addEventListener("input", () => {
      results.innerHTML = "";

      const search = dealerInput.value.toLowerCase().trim();

      const matches = dealers.filter((dealer) =>
        dealer.name.toLowerCase().includes(search),
      );

      matches.forEach((dealer) => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = dealer.name;

        div.addEventListener("click", () => {
          dealerInput.value = dealer.name;
          results.innerHTML = "";

          //TABLE RELATED
          renderDealerBookings(dealer.name);
        });

        results.appendChild(div);
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target !== dealerInput && !results.contains(e.target)) {
        results.innerHTML = "";
      }
    });
  } catch (error) {
    console.error("Failed to load dealers:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadDealers);

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

document.querySelectorAll("table").forEach(table => {
    const headers = table.querySelectorAll("th");

    headers.forEach((header, columnIndex) => {
        header.style.cursor = "pointer";

        header.addEventListener("click", () => {
            sortTable(table, columnIndex);
        });
    });
});

function sortTable(table, columnIndex) {
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const ascending =
        table.dataset.sortColumn != columnIndex ||
        table.dataset.sortDirection !== "asc";

    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim().toLowerCase();
        const bText = b.cells[columnIndex].textContent.trim().toLowerCase();

        return ascending
            ? aText.localeCompare(bText)
            : bText.localeCompare(aText);
    });

    table.dataset.sortColumn = columnIndex;
    table.dataset.sortDirection = ascending ? "asc" : "desc";

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}