// Tumor Detection Form
document.getElementById('tumorForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('mriScan');
  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    alert("Please upload an MRI scan image.");
    return;
  }

  const fileName = selectedFile.name.toLowerCase();
  const allowedExtensions = /\.(png|jpg|jpeg|bmp)$/;

  if (!allowedExtensions.test(fileName)) {
    alert("Only image formats (.png, .jpg, .jpeg, .bmp) are allowed for MRI scans.");
    fileInput.value = "";
    return;
  }

  if (!(fileName.includes("mri") || fileName.includes("brain"))) {
    alert("Invalid file. Please upload a valid MRI scan file that includes 'mri' or 'brain' in the filename.");
    fileInput.value = "";
    return;
  }

  const patientName = document.getElementById('patientName').value;
  const age = parseInt(document.getElementById('age').value);
  const height = parseInt(document.getElementById('height').value);
  const weight = parseInt(document.getElementById('weight').value);
  const location = document.getElementById('location').value;

  const symptomCheckboxes = document.querySelectorAll('.symptom');
  const selectedSymptoms = Array.from(symptomCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  let accuracy = 75;
  if (age > 50) accuracy += 10;
  if (weight > 90 || weight < 45) accuracy += 5;
  if (height < 150 || height > 190) accuracy += 3;
  if (location.toLowerCase().includes("rural")) accuracy -= 2;
  accuracy += selectedSymptoms.length * 2;
  if (accuracy > 99.9) accuracy = 99.9;
  if (accuracy < 75) accuracy = 75.0;

  document.getElementById('accuracyText').innerText =
    `Patient Name: ${patientName}\nTumor Detection Accuracy: ${accuracy.toFixed(2)}%\nReported Symptoms: ${selectedSymptoms.join(', ') || 'None'}.\nFurther medical diagnosis is recommended.`;

  document.getElementById('results').style.display = 'block';
  document.getElementById('appointmentSection').style.display = 'none';
});

// MRI Image Preview
document.getElementById('mriScan').addEventListener('change', function () {
  const file = this.files[0];
  const fileName = file.name.toLowerCase();
  const allowedExtensions = /\.(png|jpg|jpeg|bmp)$/;

  if (file && allowedExtensions.test(fileName) && (fileName.includes("mri") || fileName.includes("brain"))) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('mriImagePreview').src = e.target.result;
      document.getElementById('imagePreviewContainer').style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    document.getElementById('imagePreviewContainer').style.display = 'none';
  }
});

// Show Appointment Form
function showAppointment() {
  document.getElementById('appointmentSection').style.display = 'block';
  document.getElementById('appointmentSection').scrollIntoView({ behavior: 'smooth' });
}

// Appointment Form Submit
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('appointmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('aName').value.trim();
    const date = document.getElementById('aDate').value;
    const time = document.getElementById('aTime').value;

    if (!name || !date || !time) {
      alert("All fields are required!");
      return;
    }

    const confirm = document.getElementById('confirmationMessage');
    confirm.style.display = 'block';
    confirm.innerText = `Your appointment is confirmed for ${date} at ${time}.`;
    confirm.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('appointmentForm').reset();
  });
});

// Chatbot Logic
function sendChat() {
  const input = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  chatMessages.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;

  let botReply = getChatbotReply(userMessage.toLowerCase());
  chatMessages.innerHTML += `<div><strong>Bot:</strong> ${botReply}</div>`;

  chatMessages.scrollTop = chatMessages.scrollHeight;
  input.value = '';
}

function getChatbotReply(message) {
  if (message.includes("fever")) {
    return "It sounds like you might have a fever. Stay hydrated, rest well, and monitor your temperature. If it persists, consult a doctor.";
  } else if (message.includes("cold")) {
    return "For a cold, drink warm fluids, take rest, and consider mild decongestants. Let me know if you have a cough or fever with it.";
  } else if (message.includes("cough")) {
    return "Cough could be due to cold or throat infection. Try warm honey water or cough syrup. If it continues, get a check-up.";
  } else if (message.includes("eye pain")) {
    return "Eye pain may result from strain, dryness, or infection. Use eye drops if needed and rest your eyes. If it worsens, consult an ophthalmologist.";
  } else if (message.includes("stomach pain")) {
    return "Stomach pain may be due to indigestion, gas, or infection. Try warm water and light meals. If it's sharp or persistent, consult a doctor.";
  } else if (message.includes("headache")) {
    return "Headache can be due to stress, dehydration, or other causes. Drink water, rest in a quiet room, and avoid screens for a while.";
  } else if (message.includes("vomit") || message.includes("vomiting")) {
    return "Vomiting could be due to food poisoning or stomach infection. Stay hydrated and avoid solid food until it settles.";
  } else {
    return "I'm here to help! Please describe your symptoms in detail or ask about common health concerns like fever, cough, headache, etc.";
  }
}
