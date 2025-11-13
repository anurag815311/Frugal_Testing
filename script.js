

// Country → State → City Data
const GEO = {
  IN: {
    Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  },
  US: {
    California: ["San Francisco", "Los Angeles", "San Diego"],
    Texas: ["Austin", "Dallas", "Houston"],
  },
  GB: {
    England: ["London", "Manchester", "Birmingham"],
    Scotland: ["Edinburgh", "Glasgow"],
  },
};

// Phone Prefixes per Country
const PHONE_PREFIX = {
  IN: "+91",
  US: "+1",
  GB: "+44",
};

// Disposable Email Domains
const DISPOSABLE = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
];

// Quick Helper
const $ = (id) => document.getElementById(id);

// Elements
const form = $("regForm");
const submitBtn = $("submitBtn");
const topError = $("topError");
const topSuccess = $("topSuccess");

const country = $("country");
const state = $("state");
const city = $("city");

const strengthBar = $("strengthBar");
const strengthLabel = $("strengthLabel");


function setOptions(sel, list) {
  sel.innerHTML = "";
  list.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = v;
    sel.appendChild(opt);
  });
}

function initGeo() {
  const c = country.value;
  setOptions(state, Object.keys(GEO[c]));
  setOptions(city, GEO[c][state.value]);
}

country.addEventListener("change", initGeo);
state.addEventListener("change", () => {
  setOptions(city, GEO[country.value][state.value]);
});


function fieldInvalid(id, msgId, show) {
  const parent = $(id).parentElement;
  parent.classList.toggle("invalid", show);
  const msg = $(msgId);
  if (msg) msg.style.display = show ? "block" : "none";
}

function hasDisposable(email) {
  const domain = (email.split("@")[1] || "").toLowerCase();
  return DISPOSABLE.some((d) => domain.endsWith(d));
}

function passwordScore(p) {
  let score = 0;
  if (!p) return score;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return Math.min(score, 5);
}

function showStrength() {
  const pw = $("password").value;
  const score = passwordScore(pw);
  const pct = [0, 20, 40, 70, 85, 100][score];
  const label = [
    "—",
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
  ][score];

  strengthBar.style.width = pct + "%";
  strengthLabel.textContent = "Strength: " + label;

  return score >= 3; // At least Medium
}


// Full Form Validation
function validate() {
  let ok = true;

  topError.style.display = "none";
  topSuccess.style.display = "none";

  // First Name
  const first = $("firstName").value.trim();
  fieldInvalid("firstName", "errFirst", !first);
  ok = ok && first;

  // Last Name
  const last = $("lastName").value.trim();
  fieldInvalid("lastName", "errLast", !last);
  ok = ok && last;

  // Email
  const email = $("email").value.trim();
  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && !hasDisposable(email);
  fieldInvalid("email", "errEmail", !emailValid);
  ok = ok && emailValid;

  // Gender
  const genderChecked = [...document.querySelectorAll('input[name="gender"]')].some(
    (x) => x.checked
  );
  $("errGender").style.display = genderChecked ? "none" : "block";
  ok = ok && genderChecked;

  // Phone with Country Prefix
  const prefix = PHONE_PREFIX[country.value];
  const phone = $("phone").value.replace(/\s+/g, "");
  const phoneValid = phone.startsWith(prefix) && phone.length >= prefix.length + 6;
  fieldInvalid("phone", "errPhone", !phoneValid);
  ok = ok && phoneValid;

  // Password + Confirm
  const p1 = $("password").value;
  const p2 = $("confirm").value;
  const strongEnough = showStrength();

  if (p1 || p2) {
    const pwOK = strongEnough;
    const match = p1 === p2 && p1.length > 0;

    fieldInvalid("password", "errPassword", !pwOK);
    fieldInvalid("confirm", "errConfirm", !match);

    ok = ok && pwOK && match;
  }

  // Terms & Conditions
  const termsOK = $("terms").checked;
  $("errTerms").style.display = termsOK ? "none" : "block";
  ok = ok && termsOK;

  // Control Submit Button
  submitBtn.disabled = !ok;
  return ok;
}

// Realtime Listeners
["input", "change", "keyup"].forEach((evt) => {
  form.addEventListener(evt, validate);
});

// Submit Handler
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = validate();
  if (!ok) {
    topError.style.display = "block";
    return;
  }

  topSuccess.style.display = "block";
  form.reset();

  strengthBar.style.width = "0%";
  strengthLabel.textContent = "Strength: —";

  submitBtn.disabled = true;
});


// Reset Handler
$("resetBtn").addEventListener("click", () => {
  form.reset();

  [
    "errFirst",
    "errLast",
    "errEmail",
    "errPhone",
    "errGender",
    "errPassword",
    "errConfirm",
    "errTerms",
  ].forEach((id) => ($(id).style.display = "none"));

  [
    "firstName",
    "lastName",
    "email",
    "phone",
    "password",
    "confirm",
    "address",
    "age",
  ].forEach((id) => $(id).parentElement.classList.remove("invalid"));

  strengthBar.style.width = "0%";
  strengthLabel.textContent = "Strength: —";

  topError.style.display = "none";
  topSuccess.style.display = "none";

  submitBtn.disabled = true;

  initGeo();
});

// Initialize on Load
initGeo();
validate();
showStrength();
