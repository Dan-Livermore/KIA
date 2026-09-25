// Initiates Variables For Form Inputs
let dealer;
let customer;
let car;
let startTime;
let endTime;
let statusMessage = document.getElementById("status");

let dealers = [];
let cars = [];
let blacklist = [];

async function loadDealersForValidation() {
  const response = await fetch("./dealers.json");
  dealers = await response.json();
}

async function loadCarsForValidation() {
  const response = await fetch("./cars.json");
  cars = await response.json();
}

async function loadBlacklistForValidation() {
  const response = await fetch("./blacklist.json");
  blacklist = await response.json();
}

async function validateForm() {
  statusMessage.style.color = "red";
  // When called get the data for submission
  getData();
  await loadDealersForValidation();
  await loadCarsForValidation();
  await loadBlacklistForValidation();
  // Fetches existing bookings to be used to prevent duplication
  const response = await fetch("data.json");
  if (!response.ok) {
    statusMessage.textContent = "Could not load existing bookings.";
    return false;
  }
  const bookings = await response.json();
  return (
    validateEmpty() &&
    validateDuplicates(bookings) &&
    validateDealers() &&
    validateCars() &&
    validateCustomers() &&
    validateStartTime() &&
    validateEndTime()
  );
}

function getData() {
  // Gets data that is going to be submitted
  dealer = document.getElementById("dealer").value.trim().toLowerCase();
  customer = document.getElementById("customer").value.trim();
  car = document.getElementById("car").value.trim();
  startTime = new Date(document.getElementById("start-time").value).getTime();
  endTime = new Date(document.getElementById("end-time").value).getTime();
}

function validateEmpty() {
  // Dealer must exist
  if (dealer.length === 0) {
    statusMessage.textContent = "Please enter the name of a dealer.";
    return false;
  }
  // Customer Name must exist
  if (customer.length === 0) {
    statusMessage.textContent = "Please enter a customer name.";
    return false;
  }
  // Car Name must exist
  if (car.length === 0) {
    statusMessage.textContent = "Please enter the model of the vehicle.";
    return false;
  }
  // Start Time must exist
  if (isNaN(startTime)) {
    statusMessage.textContent = "Please enter a valid start time";
    return false;
  }
  // End Time must exist
  if (isNaN(endTime)) {
    statusMessage.textContent = "Please enter a valid end time";
    return false;
  }
  return true;
}

function validateDuplicates(bookings) {
  const bookingTime = startTime;

  // Exact duplicate: same location, customer, car, and time
  const duplicate = bookings.some((booking) => {
    return (
      booking.dealer === dealer &&
      booking.customer === customer &&
      booking.car === car &&
      new Date(booking.starttime).getTime() === bookingTime
    );
  });

  if (duplicate) {
    statusMessage.textContent =
      "A booking already exists for this customer and vehicle at this time and location.";
    return false;
  }

  // Customer already has a booking at this location at this time
  const clash = bookings.some((booking) => {
    const existingStart = new Date(booking.starttime).getTime();
    const existingEnd = new Date(booking.endtime).getTime();

    return (
      booking.dealer === dealer &&
      booking.customer === customer &&
      booking.car === car &&
      existingStart < endTime &&
      existingEnd > startTime
    );
  });

  if (clash) {
    statusMessage.textContent =
      "This customer already has a booking at this store for this time.";
    return false;
  }

  return true;
}

function validateDealers() {
  // Dealer on list
  const existingDealer = dealers.some(
    (item) => item.name.toLowerCase() === dealer,
  );
  if (!existingDealer) {
    statusMessage.textContent = "Select a dealer from the list.";
    return false;
  }
  return true;
}

function validateCars() {
  // Car on list
  const existingCars = cars.some((item) => item.name === car);
  if (!existingCars) {
    statusMessage.textContent = "Select a car from the list.";
    return false;
  }
  return true;
}

function validateCustomers() {
  // Customer Name doesn't contain non letters
  const validChars = /^[A-Za-zÀ-ÿ\s'-]+$/;
  if (!validChars.test(customer)) {
    statusMessage.textContent =
      "Customer name can only include letters, spaces, apostrophies and hyphens.";
    return false;
  }

  // Customer Name must be shorter than 100 characters
  if (customer.length > 100) {
    statusMessage.textContent = "Customer name must be under 100 characters.";
    return false;
  }

  // Check blacklist
  const containsBlockedWord = blacklist.some((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(customer),
  );

  if (containsBlockedWord) {
    statusMessage.textContent = "Customer name contains blocked language.";
    return false;
  }

  // Capitalise and return data
  customer = customer
    .replace(/[<>]/g, "")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
  document.getElementById("customer").value = customer;
  //customer = customer.replace(/^(mr|mrs|miss|ms|mx|dr)\s+/i, "");

  return true;
}

function validateStartTime() {
  // Start time not in past
  var now = Date.now() - 60000; // Minus 1 minute to allow for slow internet
  if (startTime < now) {
    statusMessage.textContent = "Start time can not be in the past.";
    return false;
  }
  // Start time not too far into the future
  if (startTime > now + 2592000000) {
    statusMessage.textContent =
      "You can not create bookings over 30 days in advance.";
    return false;
  }

  // Booking must be in work day (not before 8am)
  const startHour = new Date(startTime).getHours();

  if (startHour < 8) {
    statusMessage.textContent = "Bookings must not start before 08:00.";
  return false;
  }

  return true;
}

function validateEndTime() {
  // End time is not before start time
  if (endTime < startTime) {
    statusMessage.textContent = "The booking can not end before it starts.";
    return false;
  }
  // Booking can't be too short
  if (endTime < startTime + 1800000) {
    statusMessage.textContent = "The booking must be at least 30 minutes long.";
    return false;
  }
  // Booking can't be over one day
  if (endTime > startTime + 86400000) {
    statusMessage.textContent = "The booking must be less than 24 hours long.";
    return false;
  }

  // Booking must finish before 18:00
  const endHour = new Date(endTime).getHours();

  if (endHour > 18 || (endHour === 18 && endDate.getMinutes() > 0)) {
    statusMessage.textContent =
      "Bookings must finish by 18:00.";
    return false;
  }
  return true;
}
