let dealer;
let customer;
let car;
let startTime;
let endTime;

async function validateForm() {
  // When called get the data for submission
  getData();

  // Fetches existing bookings to be used to prevent duplication


  return (
    validateEmpty() &&
    validateDuplicates() &&
    validateDealers() &&
    validateCars() &&
    validateCustomers() &&
    validateStartTime() &&
    validateEndTime()
  );
}

function getData() {
  // Gets data that is going to be submitted
  dealer = document.getElementById("dealer").value.trim();
  customer = document.getElementById("customer").value.trim();
  car = document.getElementById("car").value.trim();
  startTime = new Date(document.getElementById("start-time").value);
  endTime = new Date(document.getElementById("end-time").value);
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
  if (startTime.length === 0) {
    statusMessage.textContent = "Please enter a valid start time";
    return false;
  }
  // End Time must exist
  if (endTime.length === 0) {
    statusMessage.textContent = "Please enter a valid end time";
    return false;
  }
  return true;
}

function validateDuplicates() {
  // Fetch previous json data
  // Filter by location
  // Filter by customer name
  // If location and customer and car are the same make return   statusMessage.textContent = "This booking already exists.");
}

function validateDealers() {
  // Dealer on list
  const existingDealer = dealers.some((item) => item.name === dealer);
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
  const validChars = /^[A-Za-z\s'-]+$/;
  if (!validChars.test(customer)) {
    statusMessage.textContent = "Customer name can only include letters, spaces, apostrophies and hyphens.";
    return false;
  }

  // Customer Name must be shorter than 100 characters
  if (customer.length > 100) {
    statusMessage.textContent = "Customer name must be under 100 characters.";
    return false;
  }

  // Capitalise and return data
  customer = customer.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");
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

  if(startTime > now + 2592000000){
    statusMessage.textContent = "You can not create bookings over 30 days in advance.";
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
    if (endTime < startTime + 86400000) {
    statusMessage.textContent = "The booking must be less than 24 hours long.";
    return false;
    }
  return true;
}

// More overlapping protection