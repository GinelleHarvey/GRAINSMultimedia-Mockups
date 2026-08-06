/* ==================================================
   THE 386 EXCHANGE INTERACTIVE CALENDAR
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var calendarGrid = document.getElementById("calendar-grid");

  if (!calendarGrid) {
    return;
  }

  var monthHeading = document.getElementById("calendar-month");
  var previousButton = document.getElementById("previous-month");
  var nextButton = document.getElementById("next-month");
  var todayButton = document.getElementById("today-button");
  var upcomingEvents = document.getElementById("upcoming-events");
  var eventDetails = document.getElementById("event-details");
  var filterButtons = document.querySelectorAll(".calendar-filter");

  var today = new Date();
  var currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var activeFilter = "all";
  var visibleEvents = [];

  var categoryNames = {
    community: "Community",
    support: "Resources",
    volunteer: "Volunteer",
    opportunity: "Opportunities"
  };

  var monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  });

  var shortMonthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short"
  });

  var fullDateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  function getEventsForMonth(year, month) {
    var events = [
      {
        day: 5,
        title: "Community Resource Fair",
        time: "10:00 AM–1:00 PM",
        location: "Community Hub – Main Hall",
        category: "community",
        description:
          "Meet local service providers and learn about housing, food, transportation, and family resources."
      },
      {
        day: 9,
        title: "Furniture Donation Drive",
        time: "9:00 AM–12:00 PM",
        location: "Exchange Collection Point",
        category: "support",
        description:
          "Drop off clean, usable furniture and household items for sample community listings."
      },
      {
        day: 14,
        title: "Volunteer Orientation",
        time: "6:00 PM–7:00 PM",
        location: "Online Demonstration Session",
        category: "volunteer",
        description:
          "Learn how volunteers could support events, donation pickups, deliveries, and community outreach."
      },
      {
        day: 20,
        title: "Career & Skills Workshop",
        time: "1:00 PM–3:00 PM",
        location: "Learning Room B",
        category: "opportunity",
        description:
          "A sample workshop featuring résumé preparation, interview practice, and local opportunity resources."
      },
      {
        day: 24,
        title: "Family Resource Day",
        time: "11:00 AM–2:00 PM",
        location: "Neighborhood Activity Center",
        category: "community",
        description:
          "A demonstration family event with resource information, activities, and community connections."
      },
      {
        day: 28,
        title: "Community Supply Exchange",
        time: "3:30 PM–6:00 PM",
        location: "Exchange Welcome Center",
        category: "support",
        description:
          "Bring or browse school, home, and personal-care supplies shared through the demonstration exchange."
      }
    ];

    events.forEach(function (event) {
      event.date = new Date(year, month, event.day);
    });

    return events;
  }

  function getFilteredEvents() {
    var allEvents = getEventsForMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    );

    if (activeFilter === "all") {
      return allEvents;
    }

    return allEvents.filter(function (event) {
      return event.category === activeFilter;
    });
  }

  function isSameDate(firstDate, secondDate) {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  function createCalendarEventButton(event) {
    var button = document.createElement("button");

    button.type = "button";
    button.className =
      "calendar-event calendar-event-" + event.category;
    button.textContent = event.title;

    button.setAttribute(
      "aria-label",
      event.title +
        ", " +
        fullDateFormatter.format(event.date) +
        ", " +
        event.time
    );

    button.addEventListener("click", function () {
      showEventDetails(event);
    });

    return button;
  }

  function renderCalendar() {
    visibleEvents = getFilteredEvents();
    monthHeading.textContent = monthFormatter.format(currentMonth);
    calendarGrid.innerHTML = "";

    var year = currentMonth.getFullYear();
    var month = currentMonth.getMonth();
    var firstDayIndex = new Date(year, month, 1).getDay();
    var gridStart = new Date(year, month, 1 - firstDayIndex);

    for (var index = 0; index < 42; index += 1) {
      var cellDate = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index
      );

      var dayCell = document.createElement("div");
      var dateNumber = document.createElement("span");
      var eventsContainer = document.createElement("div");

      var dayEvents = visibleEvents.filter(function (event) {
        return isSameDate(event.date, cellDate);
      });

      dayCell.className = "calendar-day";
      dayCell.setAttribute("role", "gridcell");
      dayCell.setAttribute(
        "aria-label",
        fullDateFormatter.format(cellDate)
      );

      if (cellDate.getMonth() !== month) {
        dayCell.classList.add("is-outside-month");
      }

      if (isSameDate(cellDate, today)) {
        dayCell.classList.add("is-today");
        dayCell.setAttribute("aria-current", "date");
      }

      dateNumber.className = "calendar-day-number";
      dateNumber.textContent = String(cellDate.getDate());

      eventsContainer.className = "calendar-day-events";

      dayEvents.forEach(function (event) {
        eventsContainer.appendChild(
          createCalendarEventButton(event)
        );
      });

      dayCell.appendChild(dateNumber);
      dayCell.appendChild(eventsContainer);
      calendarGrid.appendChild(dayCell);
    }

    renderUpcomingEvents();
    resetEventDetails();
  }

  function renderUpcomingEvents() {
    upcomingEvents.innerHTML = "";

    if (!visibleEvents.length) {
      var emptyMessage = document.createElement("p");

      emptyMessage.className = "empty-events";
      emptyMessage.textContent =
        "No sample events match this filter. Choose another category to see more.";

      upcomingEvents.appendChild(emptyMessage);
      return;
    }

    visibleEvents.forEach(function (event) {
      var button = document.createElement("button");
      var dateBlock = document.createElement("span");
      var monthLabel = document.createElement("small");
      var dayLabel = document.createElement("strong");
      var copy = document.createElement("span");
      var title = document.createElement("strong");
      var time = document.createElement("small");

      button.type = "button";
      button.className = "upcoming-event";
      button.setAttribute(
        "aria-label",
        "Open details for " + event.title
      );

      dateBlock.className = "upcoming-date";
      monthLabel.textContent =
        shortMonthFormatter.format(event.date);
      dayLabel.textContent = String(event.day);

      dateBlock.appendChild(monthLabel);
      dateBlock.appendChild(dayLabel);

      copy.className = "upcoming-copy";
      title.textContent = event.title;
      time.textContent = event.time;

      copy.appendChild(title);
      copy.appendChild(time);

      button.appendChild(dateBlock);
      button.appendChild(copy);

      button.addEventListener("click", function () {
        showEventDetails(event);
      });

      upcomingEvents.appendChild(button);
    });
  }

  function showEventDetails(event) {
    eventDetails.innerHTML = "";

    var heading = document.createElement("h2");
    var description = document.createElement("p");
    var meta = document.createElement("div");
    var dateLine = document.createElement("span");
    var timeLine = document.createElement("span");
    var locationLine = document.createElement("span");
    var category = document.createElement("span");

    heading.id = "event-details-heading";
    heading.textContent = event.title;
    description.textContent = event.description;

    meta.className = "event-detail-meta";

    dateLine.innerHTML =
      "<b>Date:</b> " + fullDateFormatter.format(event.date);

    timeLine.innerHTML =
      "<b>Time:</b> " + event.time;

    locationLine.innerHTML =
      "<b>Place:</b> " + event.location;

    meta.appendChild(dateLine);
    meta.appendChild(timeLine);
    meta.appendChild(locationLine);

    category.className = "event-category-label";
    category.textContent =
      categoryNames[event.category] || event.category;

    eventDetails.appendChild(heading);
    eventDetails.appendChild(description);
    eventDetails.appendChild(meta);
    eventDetails.appendChild(category);
  }

  function resetEventDetails() {
    eventDetails.innerHTML = "";

    var heading = document.createElement("h2");
    var message = document.createElement("p");

    heading.id = "event-details-heading";
    heading.textContent = "Choose an event";

    message.textContent =
      "Click any event on the calendar or in the monthly list to see more information here.";

    eventDetails.appendChild(heading);
    eventDetails.appendChild(message);
  }

  previousButton.addEventListener("click", function () {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );

    renderCalendar();
  });

  nextButton.addEventListener("click", function () {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );

    renderCalendar();
  });

  todayButton.addEventListener("click", function () {
    currentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    renderCalendar();
  });

  filterButtons.forEach(function (button) {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("is-active"))
    );

    button.addEventListener("click", function () {
      activeFilter =
        button.getAttribute("data-filter") || "all";

      filterButtons.forEach(function (filterButton) {
        var isActive = filterButton === button;

        filterButton.classList.toggle(
          "is-active",
          isActive
        );

        filterButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      renderCalendar();
    });
  });

  renderCalendar();
});


/* ==================================================
   THE 386 EXCHANGE SCHEDULE FORM
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var scheduleForm = document.getElementById("schedule-form");

  if (!scheduleForm) {
    return;
  }

  var activityField = document.getElementById("schedule-type");
  var formatField = document.getElementById("schedule-format");
  var dateField = document.getElementById("schedule-date");
  var timeField = document.getElementById("schedule-time");
  var flexibleField = document.getElementById("schedule-flexible");

  var summaryActivity = document.getElementById("summary-activity");
  var summaryDate = document.getElementById("summary-date");
  var summaryTime = document.getElementById("summary-time");
  var summaryFormat = document.getElementById("summary-format");

  var confirmation = document.getElementById(
    "schedule-confirmation"
  );

  var confirmationActivity = document.getElementById(
    "confirmation-activity"
  );

  var confirmationDate = document.getElementById(
    "confirmation-date"
  );

  var confirmationTime = document.getElementById(
    "confirmation-time"
  );

  var confirmationFormat = document.getElementById(
    "confirmation-format"
  );

  var newRequestButton = document.getElementById(
    "new-schedule-request"
  );

  var dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  function getTodayValue() {
    var today = new Date();
    var year = String(today.getFullYear());
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  function formatSelectedDate(dateValue) {
    if (!dateValue) {
      return "Not selected";
    }

    var dateParts = dateValue.split("-");

    if (dateParts.length !== 3) {
      return "Not selected";
    }

    var selectedDate = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2])
    );

    if (Number.isNaN(selectedDate.getTime())) {
      return "Not selected";
    }

    return dateFormatter.format(selectedDate);
  }

  function getActivityValue() {
    return activityField.value || "Not selected";
  }

  function getFormatValue() {
    return formatField.value || "Not selected";
  }

  function getDateValue() {
    var selectedDate = formatSelectedDate(dateField.value);

    if (
      selectedDate !== "Not selected" &&
      flexibleField.checked
    ) {
      return selectedDate + " — Flexible";
    }

    return selectedDate;
  }

  function getTimeValue() {
    if (!timeField.value) {
      return "Not selected";
    }

    if (flexibleField.checked) {
      return timeField.value + " — Flexible";
    }

    return timeField.value;
  }

  function updateScheduleSummary() {
    summaryActivity.textContent = getActivityValue();
    summaryDate.textContent = getDateValue();
    summaryTime.textContent = getTimeValue();
    summaryFormat.textContent = getFormatValue();
  }

  dateField.min = getTodayValue();

  [
    activityField,
    formatField,
    dateField,
    timeField,
    flexibleField
  ].forEach(function (field) {
    field.addEventListener("change", updateScheduleSummary);
  });

  dateField.addEventListener("input", updateScheduleSummary);

  scheduleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!scheduleForm.checkValidity()) {
      scheduleForm.reportValidity();
      return;
    }

    confirmationActivity.textContent = getActivityValue();
    confirmationDate.textContent = getDateValue();
    confirmationTime.textContent = getTimeValue();
    confirmationFormat.textContent = getFormatValue();

    scheduleForm.hidden = true;
    confirmation.hidden = false;

    confirmation.focus();

    if (
      !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      confirmation.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      confirmation.scrollIntoView({
        block: "start"
      });
    }
  });

  newRequestButton.addEventListener("click", function () {
    scheduleForm.reset();

    confirmation.hidden = true;
    scheduleForm.hidden = false;

    updateScheduleSummary();

    activityField.focus();

    if (
      !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      scheduleForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      scheduleForm.scrollIntoView({
        block: "start"
      });
    }
  });

  scheduleForm.addEventListener("reset", function () {
    window.setTimeout(updateScheduleSummary, 0);
  });

  updateScheduleSummary();
});

/* ==================================================
   THE 386 EXCHANGE PAYMENT FORM
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var paymentForm = document.getElementById("payment-form");

  if (!paymentForm) {
    return;
  }

  var purposeField = document.getElementById("payment-purpose");

  var amountFields = document.querySelectorAll(
    'input[name="sample-payment-amount"]'
  );

  var methodFields = document.querySelectorAll(
    'input[name="sample-payment-method"]'
  );

  var customAmountContainer = document.getElementById(
    "custom-payment-container"
  );

  var customAmountField = document.getElementById(
    "custom-payment-amount"
  );

  var paymentMethodMessage = document.getElementById(
    "payment-method-message"
  );

  var summaryPurpose = document.getElementById(
    "summary-payment-purpose"
  );

  var summaryAmount = document.getElementById(
    "summary-payment-amount"
  );

  var summaryMethod = document.getElementById(
    "summary-payment-method"
  );

  var summaryTotal = document.getElementById(
    "summary-payment-total"
  );

  var paymentConfirmation = document.getElementById(
    "payment-confirmation"
  );

  var confirmationPurpose = document.getElementById(
    "confirmation-payment-purpose"
  );

  var confirmationAmount = document.getElementById(
    "confirmation-payment-amount"
  );

  var confirmationMethod = document.getElementById(
    "confirmation-payment-method"
  );

  var newPaymentButton = document.getElementById(
    "new-payment-request"
  );

  var currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  function getSelectedRadioValue(fields) {
    var selectedField = Array.from(fields).find(function (field) {
      return field.checked;
    });

    return selectedField ? selectedField.value : "";
  }

  function getPurposeValue() {
    return purposeField.value || "Not selected";
  }

  function getAmountValue() {
    var selectedAmount = getSelectedRadioValue(amountFields);

    if (!selectedAmount) {
      return "";
    }

    if (selectedAmount === "custom") {
      var customAmount = Number(customAmountField.value);

      if (
        !customAmountField.value ||
        Number.isNaN(customAmount) ||
        customAmount <= 0
      ) {
        return "";
      }

      return currencyFormatter.format(customAmount);
    }

    return currencyFormatter.format(Number(selectedAmount));
  }

  function getMethodValue() {
    return getSelectedRadioValue(methodFields);
  }

  function updateCustomAmountField() {
    var selectedAmount = getSelectedRadioValue(amountFields);
    var customIsSelected = selectedAmount === "custom";

    customAmountContainer.hidden = !customIsSelected;
    customAmountField.required = customIsSelected;

    if (!customIsSelected) {
      customAmountField.setCustomValidity("");
    }
  }

  function updatePaymentMethodMessage() {
    var selectedMethod = getMethodValue();

    if (selectedMethod === "Credit or Debit Card") {
      paymentMethodMessage.textContent =
        "A completed website could securely connect to a card payment provider. No card information is requested in this demonstration.";
      return;
    }

    if (selectedMethod === "PayPal") {
      paymentMethodMessage.textContent =
        "A completed website could direct the user to PayPal. No PayPal account is connected to this demonstration.";
      return;
    }

    if (selectedMethod === "Bank Payment") {
      paymentMethodMessage.textContent =
        "A completed website could provide a secure bank-payment option. No bank information is requested or stored here.";
      return;
    }

    paymentMethodMessage.textContent =
      "Select a demonstration payment method. You will not be asked to enter real card or banking information.";
  }

  function updatePaymentSummary() {
    var amount = getAmountValue();
    var method = getMethodValue();

    summaryPurpose.textContent = getPurposeValue();
    summaryAmount.textContent = amount || "Not selected";
    summaryMethod.textContent = method || "Not selected";
    summaryTotal.textContent = amount || "$0.00";
  }

  purposeField.addEventListener("change", updatePaymentSummary);

  amountFields.forEach(function (field) {
    field.addEventListener("change", function () {
      updateCustomAmountField();
      updatePaymentSummary();

      if (field.value === "custom" && field.checked) {
        customAmountField.focus();
      }
    });
  });

  customAmountField.addEventListener("input", function () {
    var customAmount = Number(customAmountField.value);

    if (
      customAmountField.value &&
      !Number.isNaN(customAmount) &&
      customAmount > 10000
    ) {
      customAmountField.setCustomValidity(
        "Please enter a sample amount of $10,000 or less."
      );
    } else {
      customAmountField.setCustomValidity("");
    }

    updatePaymentSummary();
  });

  methodFields.forEach(function (field) {
    field.addEventListener("change", function () {
      updatePaymentMethodMessage();
      updatePaymentSummary();
    });
  });

  paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    updateCustomAmountField();

    if (!paymentForm.checkValidity()) {
      paymentForm.reportValidity();
      return;
    }

    var amount = getAmountValue();
    var method = getMethodValue();

    confirmationPurpose.textContent = getPurposeValue();
    confirmationAmount.textContent = amount || "$0.00";
    confirmationMethod.textContent =
      method || "Demonstration method";

    paymentForm.hidden = true;
    paymentConfirmation.hidden = false;

    paymentConfirmation.focus();

    if (
      !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      paymentConfirmation.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      paymentConfirmation.scrollIntoView({
        block: "start"
      });
    }
  });

  newPaymentButton.addEventListener("click", function () {
    paymentForm.reset();

    paymentConfirmation.hidden = true;
    paymentForm.hidden = false;

    updateCustomAmountField();
    updatePaymentMethodMessage();
    updatePaymentSummary();

    purposeField.focus();

    if (
      !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      paymentForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      paymentForm.scrollIntoView({
        block: "start"
      });
    }
  });

  paymentForm.addEventListener("reset", function () {
    window.setTimeout(function () {
      updateCustomAmountField();
      updatePaymentMethodMessage();
      updatePaymentSummary();
    }, 0);
  });

  updateCustomAmountField();
  updatePaymentMethodMessage();
  updatePaymentSummary();
});


/* ==================================================
   THE 386 EXCHANGE SHELTER DIRECTORY
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var shelterList = document.getElementById("shelter-list");

  if (!shelterList) {
    return;
  }

  var searchField = document.getElementById("shelter-search");
  var typeField = document.getElementById("shelter-type");
  var availabilityField = document.getElementById(
    "shelter-availability"
  );

  var resetButton = document.getElementById(
    "reset-shelter-filters"
  );

  var emptyResetButton = document.getElementById(
    "empty-reset-shelter-filters"
  );

  var resultCount = document.getElementById(
    "shelter-result-count"
  );

  var emptyState = document.getElementById(
    "shelter-empty-state"
  );

  var shelterCards = Array.from(
    document.querySelectorAll("[data-shelter-card]")
  );

  var detailsButtons = Array.from(
    document.querySelectorAll(".shelter-details-button")
  );

  var detailsPanel = document.getElementById(
    "shelter-details-panel"
  );

  var selectedHeading = document.getElementById(
    "selected-shelter-heading"
  );

  var selectedDescription = document.getElementById(
    "selected-shelter-description"
  );

  var selectedInformation = document.getElementById(
    "selected-shelter-information"
  );

  var selectedType = document.getElementById(
    "selected-shelter-type"
  );

  var selectedArea = document.getElementById(
    "selected-shelter-area"
  );

  var selectedStatus = document.getElementById(
    "selected-shelter-status"
  );

  var selectedHours = document.getElementById(
    "selected-shelter-hours"
  );

  var selectedServices = document.getElementById(
    "selected-shelter-services"
  );

  function normalizeValue(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function updateResultCount(numberOfResults) {
    var listingWord =
      numberOfResults === 1 ? "listing" : "listings";

    resultCount.textContent =
      "Showing " +
      numberOfResults +
      " fictional " +
      listingWord;
  }

  function clearSelectedShelter() {
    shelterCards.forEach(function (card) {
      card.classList.remove("is-selected");
    });

    detailsButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", "false");
    });

    selectedHeading.textContent = "Choose a sample listing";

    selectedDescription.textContent =
      "Select “View Sample Details” on any listing to see its sample services, intake hours, and location information here.";

    selectedInformation.hidden = true;
  }

  function applyShelterFilters() {
    var searchValue = normalizeValue(searchField.value);
    var typeValue = typeField.value;
    var availabilityValue = availabilityField.value;
    var visibleCount = 0;
    var selectedCardWasHidden = false;

    shelterCards.forEach(function (card) {
      var cardSearchValue = normalizeValue(
        card.dataset.search +
          " " +
          card.dataset.name
      );

      var matchesSearch =
        !searchValue ||
        cardSearchValue.indexOf(searchValue) !== -1;

      var matchesType =
        typeValue === "all" ||
        card.dataset.type === typeValue;

      var matchesAvailability =
        availabilityValue === "all" ||
        card.dataset.availability === availabilityValue;

      var shouldShow =
        matchesSearch &&
        matchesType &&
        matchesAvailability;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      } else if (card.classList.contains("is-selected")) {
        selectedCardWasHidden = true;
      }
    });

    if (selectedCardWasHidden) {
      clearSelectedShelter();
    }

    updateResultCount(visibleCount);

    emptyState.hidden = visibleCount !== 0;
  }

  function resetShelterFilters() {
    searchField.value = "";
    typeField.value = "all";
    availabilityField.value = "all";

    applyShelterFilters();
    searchField.focus();
  }

  searchField.addEventListener("input", applyShelterFilters);
  typeField.addEventListener("change", applyShelterFilters);

  availabilityField.addEventListener(
    "change",
    applyShelterFilters
  );

  resetButton.addEventListener("click", resetShelterFilters);

  emptyResetButton.addEventListener(
    "click",
    resetShelterFilters
  );

  detailsButtons.forEach(function (button) {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", function () {
      var selectedCard = button.closest(
        "[data-shelter-card]"
      );

      shelterCards.forEach(function (card) {
        card.classList.remove("is-selected");
      });

      detailsButtons.forEach(function (otherButton) {
        otherButton.setAttribute("aria-pressed", "false");
      });

      if (selectedCard) {
        selectedCard.classList.add("is-selected");
      }

      button.setAttribute("aria-pressed", "true");

      selectedHeading.textContent =
        button.dataset.shelterName;

      selectedDescription.textContent =
        button.dataset.shelterDescription;

      selectedType.textContent =
        button.dataset.shelterType;

      selectedArea.textContent =
        button.dataset.shelterArea;

      selectedStatus.textContent =
        button.dataset.shelterStatus;

      selectedHours.textContent =
        button.dataset.shelterHours;

      selectedServices.textContent =
        button.dataset.shelterServices;

      selectedInformation.hidden = false;

      detailsPanel.focus({
        preventScroll: true
      });

      if (window.innerWidth < 992) {
        if (
          !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
        ) {
          detailsPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        } else {
          detailsPanel.scrollIntoView({
            block: "start"
          });
        }
      }
    });
  });

  applyShelterFilters();
});


/* ==================================================
   THE 386 EXCHANGE RENTAL DIRECTORY
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var rentalList = document.getElementById("rental-list");

  if (!rentalList) {
    return;
  }

  var searchField = document.getElementById("rental-search");
  var typeField = document.getElementById("rental-type");
  var priceField = document.getElementById("rental-price");

  var resetButton = document.getElementById(
    "reset-rental-filters"
  );

  var emptyResetButton = document.getElementById(
    "empty-reset-rental-filters"
  );

  var resultCount = document.getElementById(
    "rental-result-count"
  );

  var emptyState = document.getElementById(
    "rental-empty-state"
  );

  var rentalCards = Array.from(
    document.querySelectorAll("[data-rental-card]")
  );

  var detailsButtons = Array.from(
    document.querySelectorAll(".rental-details-button")
  );

  var detailsPanel = document.getElementById(
    "rental-details-panel"
  );

  var selectedHeading = document.getElementById(
    "selected-rental-heading"
  );

  var selectedDescription = document.getElementById(
    "selected-rental-description"
  );

  var selectedInformation = document.getElementById(
    "selected-rental-information"
  );

  var selectedType = document.getElementById(
    "selected-rental-type"
  );

  var selectedArea = document.getElementById(
    "selected-rental-area"
  );

  var selectedRent = document.getElementById(
    "selected-rental-rent"
  );

  var selectedStatus = document.getElementById(
    "selected-rental-status"
  );

  var selectedDeposit = document.getElementById(
    "selected-rental-deposit"
  );

  var selectedUtilities = document.getElementById(
    "selected-rental-utilities"
  );

  var selectedFeatures = document.getElementById(
    "selected-rental-features"
  );

  function normalizeValue(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function updateResultCount(numberOfResults) {
    var listingWord =
      numberOfResults === 1 ? "listing" : "listings";

    resultCount.textContent =
      "Showing " +
      numberOfResults +
      " fictional " +
      listingWord;
  }

  function clearSelectedRental() {
    rentalCards.forEach(function (card) {
      card.classList.remove("is-selected");
    });

    detailsButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", "false");
    });

    selectedHeading.textContent =
      "Choose a sample listing";

    selectedDescription.textContent =
      "Select “View Sample Details” on any rental to see its sample rent, deposit, utilities, features, and availability here.";

    selectedInformation.hidden = true;
  }

  function applyRentalFilters() {
    var searchValue = normalizeValue(searchField.value);
    var typeValue = typeField.value;
    var priceValue = priceField.value;

    var maximumPrice =
      priceValue === "all"
        ? Infinity
        : Number(priceValue);

    var visibleCount = 0;
    var selectedCardWasHidden = false;

    rentalCards.forEach(function (card) {
      var cardSearchValue = normalizeValue(
        card.dataset.search +
          " " +
          card.dataset.name
      );

      var cardPrice = Number(card.dataset.price);

      var matchesSearch =
        !searchValue ||
        cardSearchValue.indexOf(searchValue) !== -1;

      var matchesType =
        typeValue === "all" ||
        card.dataset.type === typeValue;

      var matchesPrice =
        cardPrice <= maximumPrice;

      var shouldShow =
        matchesSearch &&
        matchesType &&
        matchesPrice;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      } else if (card.classList.contains("is-selected")) {
        selectedCardWasHidden = true;
      }
    });

    if (selectedCardWasHidden) {
      clearSelectedRental();
    }

    updateResultCount(visibleCount);
    emptyState.hidden = visibleCount !== 0;
  }

  function resetRentalFilters() {
    searchField.value = "";
    typeField.value = "all";
    priceField.value = "all";

    applyRentalFilters();
    searchField.focus();
  }

  searchField.addEventListener(
    "input",
    applyRentalFilters
  );

  typeField.addEventListener(
    "change",
    applyRentalFilters
  );

  priceField.addEventListener(
    "change",
    applyRentalFilters
  );

  resetButton.addEventListener(
    "click",
    resetRentalFilters
  );

  emptyResetButton.addEventListener(
    "click",
    resetRentalFilters
  );

  detailsButtons.forEach(function (button) {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", function () {
      var selectedCard = button.closest(
        "[data-rental-card]"
      );

      rentalCards.forEach(function (card) {
        card.classList.remove("is-selected");
      });

      detailsButtons.forEach(function (otherButton) {
        otherButton.setAttribute(
          "aria-pressed",
          "false"
        );
      });

      if (selectedCard) {
        selectedCard.classList.add("is-selected");
      }

      button.setAttribute("aria-pressed", "true");

      selectedHeading.textContent =
        button.dataset.rentalName;

      selectedDescription.textContent =
        button.dataset.rentalDescription;

      selectedType.textContent =
        button.dataset.rentalType;

      selectedArea.textContent =
        button.dataset.rentalArea;

      selectedRent.textContent =
        button.dataset.rentalRent;

      selectedStatus.textContent =
        button.dataset.rentalStatus;

      selectedDeposit.textContent =
        button.dataset.rentalDeposit;

      selectedUtilities.textContent =
        button.dataset.rentalUtilities;

      selectedFeatures.textContent =
        button.dataset.rentalFeatures;

      selectedInformation.hidden = false;

      detailsPanel.focus({
        preventScroll: true
      });

      if (window.innerWidth < 992) {
        if (
          !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
        ) {
          detailsPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        } else {
          detailsPanel.scrollIntoView({
            block: "start"
          });
        }
      }
    });
  });

  applyRentalFilters();
});



/* ==================================================
   THE 386 EXCHANGE DONATION DEMONSTRATION
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var donationForm = document.getElementById(
    "donation-form"
  );

  if (!donationForm) {
    return;
  }

  var formCard = document.getElementById(
    "donation-form-card"
  );

  var donorName = document.getElementById(
    "donor-name"
  );

  var categoryField = document.getElementById(
    "donation-category"
  );

  var quantityField = document.getElementById(
    "donation-quantity"
  );

  var itemsField = document.getElementById(
    "donation-items"
  );

  var conditionField = document.getElementById(
    "donation-condition"
  );

  var timingField = document.getElementById(
    "donation-timing"
  );

  var methodNote = document.getElementById(
    "donation-method-note"
  );

  var formStatus = document.getElementById(
    "donation-form-status"
  );

  var needButtons = Array.from(
    document.querySelectorAll(".donate-need-button")
  );

  var methodFields = Array.from(
    document.querySelectorAll(
      'input[name="donation-method"]'
    )
  );

  var previewCard = document.getElementById(
    "donation-preview-card"
  );

  var previewEmpty = document.getElementById(
    "donation-preview-empty"
  );

  var previewDetails = document.getElementById(
    "donation-preview-details"
  );

  var previewName = document.getElementById(
    "donation-preview-name"
  );

  var previewCategory = document.getElementById(
    "preview-category"
  );

  var previewItems = document.getElementById(
    "preview-items"
  );

  var previewQuantity = document.getElementById(
    "preview-quantity"
  );

  var previewCondition = document.getElementById(
    "preview-condition"
  );

  var previewTiming = document.getElementById(
    "preview-timing"
  );

  var previewMethod = document.getElementById(
    "preview-method"
  );

  var resetDonationButton = document.getElementById(
    "start-another-donation"
  );

  function useReducedMotion() {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  function getSelectedMethod() {
    var selectedMethod = document.querySelector(
      'input[name="donation-method"]:checked'
    );

    if (!selectedMethod) {
      return "";
    }

    return selectedMethod.value;
  }

  function updateMethodNote() {
    var selectedMethod = getSelectedMethod();

    if (selectedMethod === "Pickup requested") {
      methodNote.textContent =
        "A participating organization would review the item size and location before confirming whether pickup is available.";
    } else {
      methodNote.textContent =
        "A participating organization would provide the approved drop-off location.";
    }
  }

  function clearSelectedNeed() {
    needButtons.forEach(function (button) {
      button.classList.remove("is-selected");
      button.setAttribute("aria-pressed", "false");
    });
  }

  needButtons.forEach(function (button) {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", function () {
      clearSelectedNeed();

      button.classList.add("is-selected");
      button.setAttribute("aria-pressed", "true");

      categoryField.value =
        button.dataset.donationCategory || "";

      itemsField.value =
        button.dataset.donationItems || "";

      formStatus.textContent =
        "The sample need was added to the form.";

      if (window.innerWidth < 992) {
        if (useReducedMotion()) {
          formCard.scrollIntoView({
            block: "start"
          });
        } else {
          formCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }

      itemsField.focus({
        preventScroll: true
      });
    });
  });

  categoryField.addEventListener("change", function () {
    var matchingButton = needButtons.find(
      function (button) {
        return (
          button.dataset.donationCategory ===
          categoryField.value
        );
      }
    );

    clearSelectedNeed();

    if (matchingButton) {
      matchingButton.classList.add("is-selected");

      matchingButton.setAttribute(
        "aria-pressed",
        "true"
      );
    }
  });

  methodFields.forEach(function (field) {
    field.addEventListener(
      "change",
      updateMethodNote
    );
  });

  donationForm.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      if (!donationForm.checkValidity()) {
        donationForm.reportValidity();
        return;
      }

      var donorDisplayName =
        donorName.value.trim() || "Donor";

      previewName.textContent =
        donorDisplayName + "'s donation preview";

      previewCategory.textContent =
        categoryField.value;

      previewItems.textContent =
        itemsField.value.trim();

      previewQuantity.textContent =
        quantityField.value;

      previewCondition.textContent =
        conditionField.value;

      previewTiming.textContent =
        timingField.value;

      previewMethod.textContent =
        getSelectedMethod();

      previewEmpty.hidden = true;
      previewDetails.hidden = false;

      formStatus.textContent =
        "Your sample donation preview is ready.";

      previewCard.focus({
        preventScroll: true
      });

      if (window.innerWidth < 992) {
        if (useReducedMotion()) {
          previewCard.scrollIntoView({
            block: "start"
          });
        } else {
          previewCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    }
  );

  resetDonationButton.addEventListener(
    "click",
    function () {
      donationForm.reset();
      clearSelectedNeed();

      previewDetails.hidden = true;
      previewEmpty.hidden = false;

      formStatus.textContent = "";

      updateMethodNote();

      donorName.focus();

      if (window.innerWidth < 992) {
        if (useReducedMotion()) {
          formCard.scrollIntoView({
            block: "start"
          });
        } else {
          formCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    }
  );

  updateMethodNote();
});


/* ==================================================
   THE 386 EXCHANGE VOLUNTEER DEMONSTRATION
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var volunteerList = document.getElementById(
    "volunteer-opportunity-list"
  );

  if (!volunteerList) {
    return;
  }

  var searchField = document.getElementById(
    "volunteer-search"
  );

  var typeField = document.getElementById(
    "volunteer-type"
  );

  var commitmentField = document.getElementById(
    "volunteer-commitment"
  );

  var resetFilterButton = document.getElementById(
    "reset-volunteer-filters"
  );

  var emptyResetButton = document.getElementById(
    "empty-reset-volunteer-filters"
  );

  var resultsStatus = document.getElementById(
    "volunteer-results-status"
  );

  var emptyState = document.getElementById(
    "volunteer-empty-state"
  );

  var opportunityCards = Array.from(
    document.querySelectorAll(".volunteer-opportunity")
  );

  var selectButtons = Array.from(
    document.querySelectorAll(".volunteer-select-button")
  );

  var selectedCard = document.getElementById(
    "selected-volunteer-card"
  );

  var selectedEmpty = document.getElementById(
    "selected-volunteer-empty"
  );

  var selectedDetails = document.getElementById(
    "selected-volunteer-details"
  );

  var selectedRoleName = document.getElementById(
    "selected-role-name"
  );

  var selectedRoleOrganization = document.getElementById(
    "selected-role-organization"
  );

  var selectedRoleType = document.getElementById(
    "selected-role-type"
  );

  var selectedRoleCommitment = document.getElementById(
    "selected-role-commitment"
  );

  var selectedRoleSchedule = document.getElementById(
    "selected-role-schedule"
  );

  var selectedRoleLocation = document.getElementById(
    "selected-role-location"
  );

  var interestCard = document.getElementById(
    "volunteer-interest-card"
  );

  var interestForm = document.getElementById(
    "volunteer-interest-form"
  );

  var volunteerName = document.getElementById(
    "volunteer-name"
  );

  var volunteerRole = document.getElementById(
    "volunteer-role"
  );

  var volunteerAvailability = document.getElementById(
    "volunteer-availability"
  );

  var volunteerInterests = document.getElementById(
    "volunteer-interests"
  );

  var formStatus = document.getElementById(
    "volunteer-form-status"
  );

  var previewCard = document.getElementById(
    "volunteer-preview-card"
  );

  var previewName = document.getElementById(
    "preview-volunteer-name"
  );

  var previewRole = document.getElementById(
    "preview-volunteer-role"
  );

  var previewAvailability = document.getElementById(
    "preview-volunteer-availability"
  );

  var previewInterests = document.getElementById(
    "preview-volunteer-interests"
  );

  var resetFormButton = document.getElementById(
    "start-another-volunteer-interest"
  );

  function useReducedMotion() {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  function scrollToElement(element) {
    if (useReducedMotion()) {
      element.scrollIntoView({
        block: "start"
      });
    } else {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function getCardByRole(roleName) {
    return opportunityCards.find(function (card) {
      return card.dataset.role === roleName;
    });
  }

  function updateResults() {
    var searchTerm = searchField.value
      .trim()
      .toLowerCase();

    var selectedType = typeField.value;
    var selectedCommitment = commitmentField.value;
    var visibleCount = 0;

    opportunityCards.forEach(function (card) {
      var searchableText = [
        card.dataset.role,
        card.dataset.organization,
        card.dataset.typeLabel,
        card.dataset.commitmentLabel,
        card.dataset.location,
        card.dataset.schedule,
        card.dataset.search
      ]
        .join(" ")
        .toLowerCase();

      var matchesSearch =
        !searchTerm ||
        searchableText.includes(searchTerm);

      var matchesType =
        selectedType === "all" ||
        card.dataset.type === selectedType;

      var matchesCommitment =
        selectedCommitment === "all" ||
        card.dataset.commitment === selectedCommitment;

      var shouldShow =
        matchesSearch &&
        matchesType &&
        matchesCommitment;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (visibleCount === 1) {
      resultsStatus.textContent =
        "Showing 1 sample opportunity";
    } else {
      resultsStatus.textContent =
        "Showing " +
        visibleCount +
        " sample opportunities";
    }

    volunteerList.hidden = visibleCount === 0;
    emptyState.hidden = visibleCount !== 0;
  }

  function resetFilters() {
    searchField.value = "";
    typeField.value = "all";
    commitmentField.value = "all";

    updateResults();
    searchField.focus();
  }

  function clearSelection() {
    opportunityCards.forEach(function (card) {
      card.classList.remove("is-selected");
    });

    selectButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", "false");

      button.innerHTML =
        'Choose This Role <span aria-hidden="true">&rarr;</span>';
    });

    selectedDetails.hidden = true;
    selectedEmpty.hidden = false;
  }

  function showSelectedOpportunity(card, moveFocus) {
    clearSelection();

    card.classList.add("is-selected");

    var button = card.querySelector(
      ".volunteer-select-button"
    );

    if (button) {
      button.setAttribute("aria-pressed", "true");

      button.innerHTML =
        'Role Selected <span aria-hidden="true">&#10003;</span>';
    }

    volunteerRole.value =
      card.dataset.role || "";

    selectedRoleName.textContent =
      card.dataset.role || "Volunteer role";

    selectedRoleOrganization.textContent =
      card.dataset.organization || "";

    selectedRoleType.textContent =
      card.dataset.typeLabel || "";

    selectedRoleCommitment.textContent =
      card.dataset.commitmentLabel || "";

    selectedRoleSchedule.textContent =
      card.dataset.schedule || "";

    selectedRoleLocation.textContent =
      card.dataset.location || "";

    selectedEmpty.hidden = true;
    selectedDetails.hidden = false;

    formStatus.textContent =
      "The volunteer role was added to the form.";

    if (moveFocus) {
      if (window.innerWidth < 992) {
        scrollToElement(interestCard);

        volunteerName.focus({
          preventScroll: true
        });
      } else {
        selectedCard.focus({
          preventScroll: true
        });
      }
    }
  }

  opportunityCards.forEach(function (card) {
    var button = card.querySelector(
      ".volunteer-select-button"
    );

    if (!button) {
      return;
    }

    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", function () {
      showSelectedOpportunity(card, true);
    });
  });

  searchField.addEventListener(
    "input",
    updateResults
  );

  typeField.addEventListener(
    "change",
    updateResults
  );

  commitmentField.addEventListener(
    "change",
    updateResults
  );

  resetFilterButton.addEventListener(
    "click",
    resetFilters
  );

  emptyResetButton.addEventListener(
    "click",
    resetFilters
  );

  volunteerRole.addEventListener("change", function () {
    var matchingCard = getCardByRole(
      volunteerRole.value
    );

    if (matchingCard) {
      showSelectedOpportunity(
        matchingCard,
        false
      );
    } else {
      clearSelection();
      formStatus.textContent = "";
    }
  });

  interestForm.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      if (!interestForm.checkValidity()) {
        interestForm.reportValidity();
        return;
      }

      previewName.textContent =
        volunteerName.value.trim();

      previewRole.textContent =
        volunteerRole.value;

      previewAvailability.textContent =
        volunteerAvailability.value;

      previewInterests.textContent =
        volunteerInterests.value.trim();

      previewCard.hidden = false;

      formStatus.textContent =
        "Your volunteer interest preview is ready.";

      previewCard.focus({
        preventScroll: true
      });

      if (window.innerWidth < 992) {
        scrollToElement(previewCard);
      }
    }
  );

  resetFormButton.addEventListener(
    "click",
    function () {
      interestForm.reset();
      clearSelection();

      previewCard.hidden = true;
      formStatus.textContent = "";

      if (window.innerWidth < 992) {
        scrollToElement(volunteerList);
      }

      var firstVisibleButton = selectButtons.find(
        function (button) {
          return !button.closest(
            ".volunteer-opportunity"
          ).hidden;
        }
      );

      if (firstVisibleButton) {
        firstVisibleButton.focus({
          preventScroll: true
        });
      }
    }
  );

  updateResults();
});


/* =========================================================
   OPPORTUNITIES PAGE
   ========================================================= */

(function () {
  "use strict";

  function initializeOpportunitiesPage() {
    const opportunitiesPage = document.querySelector(".opportunities-page");

    if (!opportunitiesPage) {
      return;
    }

    const searchInput = document.getElementById("opportunity-search");
    const typeFilter = document.getElementById("opportunity-type");
    const arrangementFilter = document.getElementById(
      "opportunity-arrangement"
    );

    const resetFiltersButton = document.getElementById(
      "reset-opportunity-filters"
    );

    const emptyResetButton = document.getElementById(
      "empty-reset-opportunity-filters"
    );

    const resultsStatus = document.getElementById(
      "opportunity-results-status"
    );

    const opportunityList = document.getElementById("opportunity-list");
    const emptyState = document.getElementById("opportunity-empty-state");

    const listings = Array.from(
      document.querySelectorAll(".opportunity-listing")
    );

    const selectedCard = document.getElementById(
      "selected-opportunity-card"
    );

    const selectedEmpty = document.getElementById(
      "selected-opportunity-empty"
    );

    const selectedDetails = document.getElementById(
      "selected-opportunity-details"
    );

    const selectedName = document.getElementById(
      "selected-opportunity-name"
    );

    const selectedOrganization = document.getElementById(
      "selected-opportunity-organization"
    );

    const selectedType = document.getElementById(
      "selected-opportunity-type"
    );

    const selectedArrangement = document.getElementById(
      "selected-opportunity-arrangement"
    );

    const selectedSchedule = document.getElementById(
      "selected-opportunity-schedule"
    );

    const selectedLocation = document.getElementById(
      "selected-opportunity-location"
    );

    const selectedCompensation = document.getElementById(
      "selected-opportunity-compensation"
    );

    const interestForm = document.getElementById(
      "opportunity-interest-form"
    );

    const opportunitySelect = document.getElementById(
      "applicant-opportunity"
    );

    const formStatus = document.getElementById(
      "opportunity-form-status"
    );

    const previewCard = document.getElementById(
      "opportunity-preview-card"
    );

    const previewName = document.getElementById(
      "preview-applicant-name"
    );

    const previewOpportunity = document.getElementById(
      "preview-applicant-opportunity"
    );

    const previewAvailability = document.getElementById(
      "preview-applicant-availability"
    );

    const previewExperience = document.getElementById(
      "preview-applicant-experience"
    );

    const startAnotherButton = document.getElementById(
      "start-another-opportunity-interest"
    );

    function normalizeText(value) {
      return String(value || "")
        .toLowerCase()
        .trim();
    }

    function updateResults() {
      const searchValue = normalizeText(searchInput.value);
      const selectedTypeValue = typeFilter.value;
      const selectedArrangementValue = arrangementFilter.value;

      let visibleCount = 0;

      listings.forEach(function (listing) {
        const searchableText = normalizeText(
          [
            listing.dataset.search,
            listing.dataset.role,
            listing.dataset.organization,
            listing.dataset.location
          ].join(" ")
        );

        const matchesSearch =
          searchValue === "" || searchableText.includes(searchValue);

        const matchesType =
          selectedTypeValue === "all" ||
          listing.dataset.type === selectedTypeValue;

        const matchesArrangement =
          selectedArrangementValue === "all" ||
          listing.dataset.arrangement === selectedArrangementValue;

        const shouldShow =
          matchesSearch && matchesType && matchesArrangement;

        listing.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (visibleCount === 1) {
        resultsStatus.textContent = "Showing 1 sample opportunity";
      } else {
        resultsStatus.textContent =
          "Showing " + visibleCount + " sample opportunities";
      }

      opportunityList.hidden = visibleCount === 0;
      emptyState.hidden = visibleCount !== 0;
    }

    function resetFilters() {
      searchInput.value = "";
      typeFilter.value = "all";
      arrangementFilter.value = "all";

      updateResults();
      searchInput.focus();
    }

    function selectOpportunity(listing, moveToCard) {
      if (!listing) {
        return;
      }

      listings.forEach(function (currentListing) {
        const selectButton = currentListing.querySelector(
          ".opportunity-select-button"
        );

        currentListing.classList.remove("is-selected");

        if (selectButton) {
          selectButton.innerHTML =
            'View Opportunity <span aria-hidden="true">&rarr;</span>';
        }
      });

      listing.classList.add("is-selected");

      const selectedButton = listing.querySelector(
        ".opportunity-select-button"
      );

      if (selectedButton) {
        selectedButton.innerHTML =
          'Selected <span aria-hidden="true">&#10003;</span>';
      }

      selectedEmpty.hidden = true;
      selectedDetails.hidden = false;

      selectedName.textContent = listing.dataset.role;
      selectedOrganization.textContent =
        listing.dataset.organization;

      selectedType.textContent =
        listing.dataset.typeLabel || listing.dataset.type;

      selectedArrangement.textContent =
        listing.dataset.arrangementLabel ||
        listing.dataset.arrangement;

      selectedSchedule.textContent = listing.dataset.schedule;
      selectedLocation.textContent = listing.dataset.location;
      selectedCompensation.textContent =
        listing.dataset.compensation;

      opportunitySelect.value = listing.dataset.role;

      formStatus.textContent =
        listing.dataset.role + " has been added to the interest form.";

      formStatus.classList.remove("is-error");
      formStatus.classList.add("is-success");

      if (
        moveToCard &&
        window.matchMedia("(max-width: 991px)").matches
      ) {
        selectedCard.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }

    searchInput.addEventListener("input", updateResults);
    typeFilter.addEventListener("change", updateResults);
    arrangementFilter.addEventListener("change", updateResults);

    resetFiltersButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    listings.forEach(function (listing) {
      const selectButton = listing.querySelector(
        ".opportunity-select-button"
      );

      if (!selectButton) {
        return;
      }

      selectButton.addEventListener("click", function () {
        selectOpportunity(listing, true);
      });
    });

    opportunitySelect.addEventListener("change", function () {
      const selectedListing = listings.find(function (listing) {
        return listing.dataset.role === opportunitySelect.value;
      });

      if (selectedListing) {
        selectOpportunity(selectedListing, false);
      }
    });

    interestForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!interestForm.checkValidity()) {
        interestForm.reportValidity();

        formStatus.textContent =
          "Please complete every required field.";

        formStatus.classList.remove("is-success");
        formStatus.classList.add("is-error");

        return;
      }

      const applicantName = document
        .getElementById("applicant-name")
        .value.trim();

      const applicantOpportunity = opportunitySelect.value;

      const applicantAvailability = document.getElementById(
        "applicant-availability"
      ).value;

      const applicantExperience = document
        .getElementById("applicant-experience")
        .value.trim();

      previewName.textContent = applicantName;
      previewOpportunity.textContent = applicantOpportunity;
      previewAvailability.textContent = applicantAvailability;
      previewExperience.textContent = applicantExperience;

      previewCard.hidden = false;

      formStatus.textContent =
        "Your demonstration interest preview is ready. Nothing was submitted.";

      formStatus.classList.remove("is-error");
      formStatus.classList.add("is-success");

      previewCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      previewCard.focus({
        preventScroll: true
      });
    });

    startAnotherButton.addEventListener("click", function () {
      interestForm.reset();
      previewCard.hidden = true;

      listings.forEach(function (listing) {
        const selectButton = listing.querySelector(
          ".opportunity-select-button"
        );

        listing.classList.remove("is-selected");

        if (selectButton) {
          selectButton.innerHTML =
            'View Opportunity <span aria-hidden="true">&rarr;</span>';
        }
      });

      selectedEmpty.hidden = false;
      selectedDetails.hidden = true;

      formStatus.textContent = "";
      formStatus.classList.remove("is-error", "is-success");

      interestForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      document.getElementById("applicant-name").focus({
        preventScroll: true
      });
    });

    updateResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeOpportunitiesPage
    );
  } else {
    initializeOpportunitiesPage();
  }
})();
/* =========================================================
   ITEMS NEEDED PAGE
   ========================================================= */

(function () {
  "use strict";

  function initializeItemsNeededPage() {
    const itemsNeededPage = document.querySelector(
      ".items-needed-page"
    );

    if (!itemsNeededPage) {
      return;
    }

    const searchInput = document.getElementById(
      "needed-item-search"
    );

    const categoryFilter = document.getElementById(
      "needed-item-category"
    );

    const urgencyFilter = document.getElementById(
      "needed-item-urgency"
    );

    const resetFiltersButton = document.getElementById(
      "reset-needed-item-filters"
    );

    const emptyResetButton = document.getElementById(
      "empty-reset-needed-item-filters"
    );

    const resultsStatus = document.getElementById(
      "needed-item-results-status"
    );

    const itemList = document.getElementById(
      "needed-item-list"
    );

    const emptyState = document.getElementById(
      "needed-item-empty-state"
    );

    const listings = Array.from(
      document.querySelectorAll(".needed-item-listing")
    );

    const categoryShortcuts = Array.from(
      document.querySelectorAll(
        "[data-needed-category-shortcut]"
      )
    );

    const offerButtons = Array.from(
      document.querySelectorAll(".needed-offer-button")
    );

    function normalizeText(value) {
      return String(value || "")
        .toLowerCase()
        .trim();
    }

    function updateResults() {
      const searchValue = normalizeText(searchInput.value);
      const categoryValue = categoryFilter.value;
      const urgencyValue = urgencyFilter.value;

      let visibleCount = 0;

      listings.forEach(function (listing) {
        const searchableText = normalizeText(
          [
            listing.dataset.search,
            listing.textContent
          ].join(" ")
        );

        const matchesSearch =
          searchValue === "" ||
          searchableText.includes(searchValue);

        const matchesCategory =
          categoryValue === "all" ||
          listing.dataset.category === categoryValue;

        const matchesUrgency =
          urgencyValue === "all" ||
          listing.dataset.urgency === urgencyValue;

        const shouldShow =
          matchesSearch &&
          matchesCategory &&
          matchesUrgency;

        listing.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (visibleCount === 1) {
        resultsStatus.textContent =
          "Showing 1 sample request";
      } else {
        resultsStatus.textContent =
          "Showing " + visibleCount + " sample requests";
      }

      itemList.hidden = visibleCount === 0;
      emptyState.hidden = visibleCount !== 0;
    }

    function resetFilters() {
      searchInput.value = "";
      categoryFilter.value = "all";
      urgencyFilter.value = "all";

      updateResults();
      searchInput.focus();
    }

    searchInput.addEventListener("input", updateResults);
    categoryFilter.addEventListener("change", updateResults);
    urgencyFilter.addEventListener("change", updateResults);

    resetFiltersButton.addEventListener(
      "click",
      resetFilters
    );

    emptyResetButton.addEventListener(
      "click",
      resetFilters
    );

    categoryShortcuts.forEach(function (shortcut) {
      shortcut.addEventListener("click", function () {
        categoryFilter.value =
          shortcut.dataset.neededCategoryShortcut;

        searchInput.value = "";
        urgencyFilter.value = "all";

        updateResults();

        document
          .querySelector(".items-needed-listing-card")
          .scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      });
    });

    offerButtons.forEach(function (button) {
      const category =
        button.dataset.donationCategory || "";

      const item =
        button.dataset.donationItem || "";

      const destination = new URL(
        "donate.html",
        window.location.href
      );

      destination.searchParams.set(
        "category",
        category
      );

      destination.searchParams.set(
        "item",
        item
      );

      destination.searchParams.set(
        "source",
        "items-needed"
      );

      button.href =
        destination.pathname +
        destination.search;
    });

    updateResults();
  }

  function initializeNeededItemDonationHandoff() {
    const donatePage = document.querySelector(
      ".donate-page"
    );

    if (!donatePage) {
      return;
    }

    const parameters = new URLSearchParams(
      window.location.search
    );

    if (parameters.get("source") !== "items-needed") {
      return;
    }

    const selectedCategory =
      parameters.get("category");

    const selectedItem =
      parameters.get("item");

    const categoryField = document.getElementById(
      "donation-category"
    );

    const itemsField = document.getElementById(
      "donation-items"
    );

    const statusField = document.getElementById(
      "donation-form-status"
    );

    if (categoryField && selectedCategory) {
      const matchingOption = Array.from(
        categoryField.options
      ).find(function (option) {
        return option.value === selectedCategory;
      });

      if (matchingOption) {
        categoryField.value = selectedCategory;
      }
    }

    if (itemsField && selectedItem) {
      itemsField.value = selectedItem;
    }

    if (
      statusField &&
      (selectedCategory || selectedItem)
    ) {
      statusField.textContent =
        "The selected community need has been added to the donation form.";

      statusField.classList.remove("is-error");
      statusField.classList.add("is-success");
    }
  }

  function initializeItemsNeededFeatures() {
    initializeItemsNeededPage();
    initializeNeededItemDonationHandoff();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeItemsNeededFeatures
    );
  } else {
    initializeItemsNeededFeatures();
  }
})();


/* =========================================================
   CARS PAGE
   ========================================================= */

(function () {
  "use strict";

  function initializeCarsPage() {
    const carsPage = document.querySelector(".cars-page");

    if (!carsPage) {
      return;
    }

    const searchInput = document.getElementById(
      "car-search"
    );

    const typeFilter = document.getElementById(
      "car-type"
    );

    const vehicleFilter = document.getElementById(
      "car-vehicle"
    );

    const resetButton = document.getElementById(
      "reset-car-filters"
    );

    const emptyResetButton = document.getElementById(
      "empty-reset-car-filters"
    );

    const resultsStatus = document.getElementById(
      "car-results-status"
    );

    const listingContainer = document.getElementById(
      "car-list"
    );

    const emptyState = document.getElementById(
      "car-empty-state"
    );

    const listings = Array.from(
      document.querySelectorAll(".car-listing-card")
    );

    const typeShortcuts = Array.from(
      document.querySelectorAll(
        "[data-car-type-shortcut]"
      )
    );

    const detailsModal = document.getElementById(
      "car-details-modal"
    );

    function normalizeText(value) {
      return String(value || "")
        .toLowerCase()
        .trim();
    }

    function updateResults() {
      const searchValue = normalizeText(
        searchInput.value
      );

      const selectedType = typeFilter.value;
      const selectedVehicle = vehicleFilter.value;

      let visibleCount = 0;

      listings.forEach(function (listing) {
        const searchableText = normalizeText(
          [
            listing.dataset.search,
            listing.textContent
          ].join(" ")
        );

        const matchesSearch =
          searchValue === "" ||
          searchableText.includes(searchValue);

        const matchesType =
          selectedType === "all" ||
          listing.dataset.listingType === selectedType;

        const matchesVehicle =
          selectedVehicle === "all" ||
          listing.dataset.vehicleType === selectedVehicle;

        const shouldShow =
          matchesSearch &&
          matchesType &&
          matchesVehicle;

        listing.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (visibleCount === 1) {
        resultsStatus.textContent =
          "Showing 1 sample listing";
      } else {
        resultsStatus.textContent =
          "Showing " + visibleCount + " sample listings";
      }

      listingContainer.hidden = visibleCount === 0;
      emptyState.hidden = visibleCount !== 0;
    }

    function resetFilters() {
      searchInput.value = "";
      typeFilter.value = "all";
      vehicleFilter.value = "all";

      updateResults();
      searchInput.focus();
    }

    function populateList(listElement, value) {
      listElement.replaceChildren();

      String(value || "")
        .split("|")
        .filter(function (item) {
          return item.trim() !== "";
        })
        .forEach(function (item) {
          const listItem = document.createElement("li");

          listItem.textContent = item.trim();
          listElement.appendChild(listItem);
        });
    }

    searchInput.addEventListener(
      "input",
      updateResults
    );

    typeFilter.addEventListener(
      "change",
      updateResults
    );

    vehicleFilter.addEventListener(
      "change",
      updateResults
    );

    resetButton.addEventListener(
      "click",
      resetFilters
    );

    emptyResetButton.addEventListener(
      "click",
      resetFilters
    );

    typeShortcuts.forEach(function (shortcut) {
      shortcut.addEventListener("click", function () {
        typeFilter.value =
          shortcut.dataset.carTypeShortcut;

        searchInput.value = "";
        vehicleFilter.value = "all";

        updateResults();

        document
          .getElementById("car-listings")
          .scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      });
    });

    if (detailsModal) {
      detailsModal.addEventListener(
        "show.bs.modal",
        function (event) {
          const triggerButton = event.relatedTarget;

          if (!triggerButton) {
            return;
          }

          const listing = triggerButton.closest(
            ".car-listing-card"
          );

          if (!listing) {
            return;
          }

          const modalBadge = document.getElementById(
            "car-modal-type"
          );

          const modalTitle = document.getElementById(
            "car-details-modal-label"
          );

          const modalProvider = document.getElementById(
            "car-modal-provider"
          );

          const modalPrice = document.getElementById(
            "car-modal-price"
          );

          const modalLocation = document.getElementById(
            "car-modal-location"
          );

          const modalDescription = document.getElementById(
            "car-modal-description"
          );

          const modalDetails = document.getElementById(
            "car-modal-details"
          );

          const modalFeatures = document.getElementById(
            "car-modal-features"
          );

          const modalContactLink = document.getElementById(
            "car-modal-contact-link"
          );

          modalBadge.textContent =
            listing.dataset.label || "Sample Listing";

          modalBadge.className = "car-modal-badge";

          if (
            listing.dataset.listingType === "donation"
          ) {
            modalBadge.classList.add("is-donation");
          }

          if (
            listing.dataset.listingType === "ride"
          ) {
            modalBadge.classList.add("is-ride");
          }

          modalTitle.textContent =
            listing.dataset.title || "Listing Details";

          modalProvider.textContent =
            listing.dataset.provider || "";

          modalPrice.textContent =
            listing.dataset.price || "";

          modalLocation.textContent =
            listing.dataset.location || "";

          modalDescription.textContent =
            listing.dataset.description || "";

          populateList(
            modalDetails,
            listing.dataset.details
          );

          populateList(
            modalFeatures,
            listing.dataset.features
          );

          modalContactLink.href =
            "contact.html?listing=" +
            encodeURIComponent(
              listing.dataset.title || "Vehicle listing"
            );
        }
      );
    }

    updateResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeCarsPage
    );
  } else {
    initializeCarsPage();
  }
})();

/* =========================================================
   ITEMS FOR SALE PAGE
   ========================================================= */

(function () {
  "use strict";

  function initializeItemsForSalePage() {
    const itemsPage = document.querySelector(
      ".items-sale-page"
    );

    if (!itemsPage) {
      return;
    }

    const searchInput = document.getElementById(
      "sale-item-search"
    );

    const categoryFilter = document.getElementById(
      "sale-item-category"
    );

    const conditionFilter = document.getElementById(
      "sale-item-condition"
    );

    const resetButton = document.getElementById(
      "reset-sale-item-filters"
    );

    const emptyResetButton = document.getElementById(
      "empty-reset-sale-item-filters"
    );

    const resultsStatus = document.getElementById(
      "sale-item-results-status"
    );

    const listingContainer = document.getElementById(
      "sale-item-list"
    );

    const emptyState = document.getElementById(
      "sale-item-empty-state"
    );

    const listings = Array.from(
      document.querySelectorAll(".sale-item-card")
    );

    const categoryShortcuts = Array.from(
      document.querySelectorAll(
        "[data-sale-category-shortcut]"
      )
    );

    const detailsModal = document.getElementById(
      "sale-item-details-modal"
    );

    function normalizeText(value) {
      return String(value || "")
        .toLowerCase()
        .trim();
    }

    function updateResults() {
      const searchValue = normalizeText(
        searchInput.value
      );

      const selectedCategory = categoryFilter.value;
      const selectedCondition = conditionFilter.value;

      let visibleCount = 0;

      listings.forEach(function (listing) {
        const searchableText = normalizeText(
          [
            listing.dataset.search,
            listing.textContent
          ].join(" ")
        );

        const matchesSearch =
          searchValue === "" ||
          searchableText.includes(searchValue);

        const matchesCategory =
          selectedCategory === "all" ||
          listing.dataset.category === selectedCategory;

        const matchesCondition =
          selectedCondition === "all" ||
          listing.dataset.condition === selectedCondition;

        const shouldShow =
          matchesSearch &&
          matchesCategory &&
          matchesCondition;

        listing.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (visibleCount === 1) {
        resultsStatus.textContent =
          "Showing 1 sample listing";
      } else {
        resultsStatus.textContent =
          "Showing " + visibleCount + " sample listings";
      }

      listingContainer.hidden = visibleCount === 0;
      emptyState.hidden = visibleCount !== 0;
    }

    function resetFilters() {
      searchInput.value = "";
      categoryFilter.value = "all";
      conditionFilter.value = "all";

      updateResults();
      searchInput.focus();
    }

    function populateList(listElement, value) {
      listElement.replaceChildren();

      String(value || "")
        .split("|")
        .filter(function (item) {
          return item.trim() !== "";
        })
        .forEach(function (item) {
          const listItem = document.createElement("li");

          listItem.textContent = item.trim();
          listElement.appendChild(listItem);
        });
    }

    searchInput.addEventListener(
      "input",
      updateResults
    );

    categoryFilter.addEventListener(
      "change",
      updateResults
    );

    conditionFilter.addEventListener(
      "change",
      updateResults
    );

    resetButton.addEventListener(
      "click",
      resetFilters
    );

    emptyResetButton.addEventListener(
      "click",
      resetFilters
    );

    categoryShortcuts.forEach(function (shortcut) {
      shortcut.addEventListener("click", function () {
        categoryFilter.value =
          shortcut.dataset.saleCategoryShortcut;

        searchInput.value = "";
        conditionFilter.value = "all";

        updateResults();

        document
          .getElementById("sale-items")
          .scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      });
    });

    if (detailsModal) {
      detailsModal.addEventListener(
        "show.bs.modal",
        function (event) {
          const triggerButton = event.relatedTarget;

          if (!triggerButton) {
            return;
          }

          const listing = triggerButton.closest(
            ".sale-item-card"
          );

          if (!listing) {
            return;
          }

          const modalCategory = document.getElementById(
            "sale-item-modal-category"
          );

          const modalTitle = document.getElementById(
            "sale-item-modal-title"
          );

          const modalProvider = document.getElementById(
            "sale-item-modal-provider"
          );

          const modalPrice = document.getElementById(
            "sale-item-modal-price"
          );

          const modalLocation = document.getElementById(
            "sale-item-modal-location"
          );

          const modalDescription = document.getElementById(
            "sale-item-modal-description"
          );

          const modalDetails = document.getElementById(
            "sale-item-modal-details"
          );

          const modalFeatures = document.getElementById(
            "sale-item-modal-features"
          );

          const modalContactLink = document.getElementById(
            "sale-item-modal-contact-link"
          );

          const modalMoversLink = document.getElementById(
            "sale-item-modal-movers-link"
          );

          const itemTitle =
            listing.dataset.title || "Item listing";

          modalCategory.textContent =
            listing.dataset.label || "Sample Item";

          modalTitle.textContent = itemTitle;

          modalProvider.textContent =
            listing.dataset.provider || "";

          modalPrice.textContent =
            listing.dataset.price || "";

          modalLocation.textContent =
            listing.dataset.location || "";

          modalDescription.textContent =
            listing.dataset.description || "";

          populateList(
            modalDetails,
            listing.dataset.details
          );

          populateList(
            modalFeatures,
            listing.dataset.features
          );

          modalContactLink.href =
            "contact.html?item=" +
            encodeURIComponent(itemTitle);

          modalMoversLink.href =
            "movers.html?item=" +
            encodeURIComponent(itemTitle);
        }
      );
    }

    updateResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeItemsForSalePage
    );
  } else {
    initializeItemsForSalePage();
  }
})();

/* =========================================================
   DELIVERY & MOVERS PAGE
   ========================================================= */

(function () {
  "use strict";

  function initializeMoversPage() {
    const moverList = document.getElementById("mover-list");

    if (!moverList) {
      return;
    }

    const moverCards = Array.from(
      moverList.querySelectorAll(".mover-card")
    );

    const searchInput = document.getElementById("mover-search");
    const serviceSelect = document.getElementById("mover-service-type");
    const areaSelect = document.getElementById("mover-service-area");
    const resetButton = document.getElementById("reset-mover-filters");
    const emptyResetButton = document.getElementById(
      "empty-reset-mover-filters"
    );
    const resultsStatus = document.getElementById(
      "mover-results-status"
    );
    const emptyState = document.getElementById("mover-empty-state");
    const listingPanel = document.querySelector(
      ".mover-listing-panel"
    );
    const shortcutButtons = Array.from(
      document.querySelectorAll("[data-mover-service-shortcut]")
    );

    function normalizeText(value) {
      return String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    }

    function updateShortcutButtons(selectedService) {
      shortcutButtons.forEach(function (button) {
        const buttonService = button.dataset.moverServiceShortcut;
        const isActive =
          selectedService !== "all" &&
          buttonService === selectedService;

        button.classList.toggle("is-active", isActive);
        button.setAttribute(
          "aria-pressed",
          isActive ? "true" : "false"
        );
      });
    }

    function filterMoverCards() {
      const searchValue = normalizeText(searchInput.value);
      const searchWords = searchValue
        ? searchValue.split(" ")
        : [];

      const selectedService = serviceSelect.value;
      const selectedArea = areaSelect.value;

      let visibleCount = 0;

      moverCards.forEach(function (card) {
        const cardSearchText = normalizeText(
          [
            card.dataset.search,
            card.dataset.title,
            card.dataset.provider,
            card.dataset.description,
            card.dataset.location,
            card.dataset.label
          ].join(" ")
        );

        const matchesSearch = searchWords.every(function (word) {
          return cardSearchText.includes(word);
        });

        const matchesService =
          selectedService === "all" ||
          card.dataset.service === selectedService;

        const matchesArea =
          selectedArea === "all" ||
          card.dataset.area === selectedArea;

        const shouldShow =
          matchesSearch &&
          matchesService &&
          matchesArea;

        card.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      const serviceWord =
        visibleCount === 1 ? "service" : "services";

      resultsStatus.textContent =
        "Showing " +
        visibleCount +
        " sample " +
        serviceWord;

      emptyState.hidden = visibleCount !== 0;
      updateShortcutButtons(selectedService);
    }

    function resetMoverFilters(shouldFocusSearch) {
      searchInput.value = "";
      serviceSelect.value = "all";
      areaSelect.value = "all";

      filterMoverCards();

      if (shouldFocusSearch) {
        searchInput.focus();
      }
    }

    searchInput.addEventListener("input", filterMoverCards);
    serviceSelect.addEventListener("change", filterMoverCards);
    areaSelect.addEventListener("change", filterMoverCards);

    resetButton.addEventListener("click", function () {
      resetMoverFilters(true);
    });

    emptyResetButton.addEventListener("click", function () {
      resetMoverFilters(true);

      if (listingPanel) {
        listingPanel.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });

    shortcutButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", function () {
        const selectedShortcut =
          button.dataset.moverServiceShortcut;

        searchInput.value = "";
        serviceSelect.value = selectedShortcut;
        areaSelect.value = "all";

        filterMoverCards();

        if (listingPanel) {
          listingPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });

    const moverModal = document.getElementById(
      "mover-details-modal"
    );

    if (moverModal) {
      const modalType = document.getElementById(
        "mover-modal-type"
      );
      const modalTitle = document.getElementById(
        "mover-details-modal-label"
      );
      const modalProvider = document.getElementById(
        "mover-modal-provider"
      );
      const modalPrice = document.getElementById(
        "mover-modal-price"
      );
      const modalLocation = document.getElementById(
        "mover-modal-location"
      );
      const modalDescription = document.getElementById(
        "mover-modal-description"
      );
      const modalDetails = document.getElementById(
        "mover-modal-details"
      );
      const modalFeatures = document.getElementById(
        "mover-modal-features"
      );
      const modalScheduleLink = document.getElementById(
        "mover-modal-schedule-link"
      );

      function createModalList(listElement, listData) {
        listElement.replaceChildren();

        String(listData || "")
          .split("|")
          .map(function (item) {
            return item.trim();
          })
          .filter(Boolean)
          .forEach(function (item) {
            const listItem = document.createElement("li");

            listItem.textContent = item;
            listElement.appendChild(listItem);
          });
      }

      moverModal.addEventListener(
        "show.bs.modal",
        function (event) {
          const detailButton = event.relatedTarget;

          if (!detailButton) {
            return;
          }

          const selectedCard = detailButton.closest(
            ".mover-card"
          );

          if (!selectedCard) {
            return;
          }

          modalType.textContent =
            selectedCard.dataset.label || "Sample Service";

          modalTitle.textContent =
            selectedCard.dataset.title ||
            "Moving Service Details";

          modalProvider.textContent =
            selectedCard.dataset.provider || "";

          modalPrice.textContent =
            selectedCard.dataset.price || "";

          modalLocation.textContent =
            selectedCard.dataset.location || "";

          modalDescription.textContent =
            selectedCard.dataset.description || "";

          createModalList(
            modalDetails,
            selectedCard.dataset.details
          );

          createModalList(
            modalFeatures,
            selectedCard.dataset.features
          );

          if (modalScheduleLink) {
            modalScheduleLink.href = "schedule.html";
          }
        }
      );
    }

    filterMoverCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeMoversPage
    );
  } else {
    initializeMoversPage();
  }
})();


