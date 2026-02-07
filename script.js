// ======= Preloader =======
window.addEventListener("load", function () {
  document.getElementById("preloader").style.display = "none";
});

// ======= Navbar Toggle for Mobile =======
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navBtns = document.querySelector(".nav-btns");

function closeNav() {
  navLinks.classList.remove("nav-active");
  navBtns.classList.remove("nav-active");
  hamburger.classList.remove("toggle");
}

// Open/Close navbar on hamburger click
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("toggle");
  navLinks.classList.toggle("nav-active");
  navBtns.classList.toggle("nav-active");
});

// Close navbar when clicking a nav link
document.querySelectorAll(".nav-links li a").forEach(link => {
  link.addEventListener("click", closeNav);
});

// Close navbar when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".navbar") && navLinks.classList.contains("nav-active")) {
    closeNav();
  }
});

// ======= Back to Top Button =======
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ======= Gallery Lightbox =======
const galleryImages = document.querySelectorAll(".gallery-container img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");

galleryImages.forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});
closeBtn.addEventListener("click", () => { lightbox.style.display = "none"; });
lightbox.addEventListener("click", (e) => { if(e.target === lightbox) lightbox.style.display = "none"; });

// ======= Fade-in Animation on Scroll =======
const faders = document.querySelectorAll(".fade-in");
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

window.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const nameEl = document.getElementById('name');
  const phoneEl = document.getElementById('phone');
  const roomType = document.getElementById('roomType');
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');
  const guests = document.getElementById('guests');
  const totalAmountEl = document.getElementById('totalAmount');
  const upiBtn = document.getElementById('upiPayBtn');
  const whatsappLink = document.getElementById('whatsappLink');
  const qrFallback = document.querySelector('.qr-fallback');

  // --- Functions ---
  function calculateNights() {
    const inDate = new Date(checkIn.value);
    const outDate = new Date(checkOut.value);
    if (inDate && outDate && outDate > inDate) {
      const diffTime = Math.abs(outDate - inDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }

  function updateTotal() {
    const roomPrice = parseInt(roomType.value) || 0;
    const nights = calculateNights();
    const total = roomPrice * nights;
    totalAmountEl.textContent = total;
    updateSummary();
    updateWhatsAppLink();
    togglePayButton(total);
  }

  function togglePayButton(total) {
    if (total > 0 && validateForm(false)) {
      upiBtn.disabled = false;
      upiBtn.style.opacity = 1;
      upiBtn.style.cursor = 'pointer';
    } else {
      upiBtn.disabled = true;
      upiBtn.style.opacity = 0.6;
      upiBtn.style.cursor = 'not-allowed';
    }
  }

  function updateSummary() {
    document.getElementById('summaryName').textContent = nameEl.value || '-';
    document.getElementById('summaryPhone').textContent = phoneEl.value || '-';
    document.getElementById('summaryRoom').textContent = roomType.options[roomType.selectedIndex].text;
    document.getElementById('summaryCheckIn').textContent = checkIn.value || '-';
    document.getElementById('summaryCheckOut').textContent = checkOut.value || '-';
    document.getElementById('summaryGuests').textContent = guests.value || '-';
    document.getElementById('summaryTotal').textContent = totalAmountEl.textContent;
  }

  function updateWhatsAppLink() {
    const amount = totalAmountEl.textContent;
    const guestName = encodeURIComponent(nameEl.value || '[YourName]');
    const userPhone = encodeURIComponent(phoneEl.value || '[YourPhone]');
    const roomName = encodeURIComponent(roomType.options[roomType.selectedIndex].text);
    const checkinDate = encodeURIComponent(checkIn.value || '[CheckIn]');
    const checkoutDate = encodeURIComponent(checkOut.value || '[CheckOut]');
    const numGuests = encodeURIComponent(guests.value || '1');

    const message = encodeURIComponent(
      `Hello Royal Village Resort,%0A` +
      `I have paid ₹${amount} via UPI for my booking.%0A` +
      `Name: ${decodeURIComponent(guestName)}%0A` +
      `Phone: ${decodeURIComponent(userPhone)}%0A` +
      `Room: ${decodeURIComponent(roomName)}%0A` +
      `Check-in: ${decodeURIComponent(checkinDate)}%0A` +
      `Check-out: ${decodeURIComponent(checkoutDate)}%0A` +
      `Guests: ${decodeURIComponent(numGuests)}%0A` +
      `UPI Note: Booking for ${decodeURIComponent(guestName)} | ${decodeURIComponent(roomName)} | Check-in: ${decodeURIComponent(checkinDate)} | Check-out: ${decodeURIComponent(checkoutDate)}`
    );

    whatsappLink.href = `https://wa.me/919876543210?text=${message}`;
  }

  function validateForm(showAlert = true) {
    if (!nameEl.value.trim()) { if(showAlert) alert("Please enter your full name."); return false; }
    if (!/^\d{10}$/.test(phoneEl.value.trim())) { if(showAlert) alert("Enter a valid 10-digit phone number."); return false; }
    if (!checkIn.value || !checkOut.value) { if(showAlert) alert("Select both check-in and check-out dates."); return false; }
    if (calculateNights() <= 0) { if(showAlert) alert("Check-out date must be after check-in date."); return false; }
    if (guests.value < 1 || guests.value > 3) { if(showAlert) alert("Number of guests must be between 1 and 3."); return false; }
    if (totalAmountEl.textContent <= 0) { if(showAlert) alert("Total amount is invalid."); return false; }
    return true;
  }

  // --- Event Listeners ---
  upiBtn.addEventListener('click', function() {
    if (!validateForm()) return;

    upiBtn.disabled = true;
    upiBtn.textContent = "Processing...";

    const amount = totalAmountEl.textContent;
    const guestName = encodeURIComponent(nameEl.value);
    const roomName = encodeURIComponent(roomType.options[roomType.selectedIndex].text);
    const checkinDate = encodeURIComponent(checkIn.value);
    const checkoutDate = encodeURIComponent(checkOut.value);

    const upiLink = `upi://pay?pa=royalvillage@upi&pn=Royal%20Village%20Resort&am=${amount}&cu=INR&tn=Booking%20for%20${guestName}%20|%20${roomName}%20|%20Check-in:%20${checkinDate}%20|%20Check-out:%20${checkoutDate}`;

    window.location.href = upiLink;

    setTimeout(() => {
      qrFallback.style.display = 'block';
      qrFallback.scrollIntoView({ behavior: 'smooth' });
      alert("If UPI app didn’t open, scan the QR code to pay.");
      upiBtn.disabled = false;
      upiBtn.textContent = "Pay Now via UPI";
    }, 2000);
  });

  // --- Input Updates ---
  [nameEl, phoneEl, roomType, checkIn, checkOut, guests].forEach(el => {
    el.addEventListener('input', updateTotal);
    el.addEventListener('change', updateTotal);
  });

  // --- Initialize ---
  updateTotal();
  updateSummary();
});
