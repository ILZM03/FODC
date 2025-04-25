document.addEventListener("DOMContentLoaded", function () {
  // Function to show custom alerts
  function showAlert(message, type = "success") {
    // Remove existing alerts
    const existingAlert = document.querySelector(".custom-alert");
    if (existingAlert) {
      existingAlert.remove();
    }

    // Create alert element
    const alertElement = document.createElement("div");
    alertElement.className = `custom-alert custom-alert-${type}`;

    // Create icon based on alert type
    const icon = document.createElement("span");
    icon.className = "custom-alert-icon";

    if (type === "success") {
      icon.innerHTML = "✓";
    } else if (type === "error") {
      icon.innerHTML = "✕";
    } else if (type === "warning") {
      icon.innerHTML = "!";
    }

    // Create message element
    const messageElement = document.createElement("span");
    messageElement.className = "custom-alert-message";
    messageElement.textContent = message;

    // Create close button
    const closeButton = document.createElement("button-close");
    closeButton.className = "custom-alert-close";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", function () {
      alertElement.classList.remove("show");
      setTimeout(() => alertElement.remove(), 300);
    });

    // Append elements to the alert
    alertElement.appendChild(icon);
    alertElement.appendChild(messageElement);
    alertElement.appendChild(closeButton);

    // Add the alert to the document
    document.body.appendChild(alertElement);

    // Show the alert with animation
    setTimeout(() => {
      alertElement.classList.add("show");
    }, 10);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      alertElement.classList.remove("show");
      setTimeout(() => {
        if (document.body.contains(alertElement)) {
          alertElement.remove();
        }
      }, 300);
    }, 10000);
  }

  //showAlert("This is a success message!", "success");
  //showAlert("Something went wrong!", "error");
  //showAlert("Please check the form fields.", "warning");

  // Add submit event listener
  contactForm.addEventListener("submit", function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Perform form validation
    if (!validateForm()) {
      showAlert("Please fill out all required fields correctly.", "error");
      return;
    }

    // Verify reCAPTCHA
    // const recaptchaResponse = grecaptcha.getResponse();
    // if (!recaptchaResponse) {
    //   showAlert("Please complete the reCAPTCHA verification.", "warning");
    //   return;
    // }

    // Get form data
    const formData = new FormData(contactForm);
    // formData.append("g-recaptcha-response", recaptchaResponse);

    // Convert FormData to JSON
    const formJson = {};
    formData.forEach((value, key) => {
      formJson[key] = value;
    });

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    // Send the data using fetch API
    fetch("process_contact.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formJson),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          // Show success message
          showAlert(
            "Thank you for your message! We will get back to you soon.",
            "success"
          );

          // Reset the form
          contactForm.reset();

          // Reset reCAPTCHA
          // grecaptcha.reset();
        } else {
          // Show error from server
          showAlert(
            data.message || "Something went wrong processing your request.",
            "error"
          );
        }
      })
      .catch((error) => {
        // Show error message
        showAlert(
          "Sorry, there was an error sending your message. Please try again later.",
          "error"
        );
        console.error("Error:", error);
      })
      .finally(() => {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      });
  });

  // Form validation functions
  function validateForm() {
    let isValid = true;

    // Validate all required fields
    const requiredInputs = contactForm.querySelectorAll("[required]");
    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "red";
        isValid = false;
      } else {
        input.style.borderColor = "";
      }
    });

    // Validate email and phone
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    if (!validateEmail(emailInput)) isValid = false;
    if (!validatePhone(phoneInput)) isValid = false;

    return isValid;
  }

  function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);

    if (!isValid && input.value) {
      input.style.borderColor = "red";

      // Create error message if it doesn't exist
      let errorMsg = input.parentNode.querySelector(".error-message");
      if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "1rem";
        errorMsg.style.marginTop = "0.5rem";
        input.parentNode.appendChild(errorMsg);
      }
      errorMsg.textContent = "Please enter a valid email address";
    } else {
      input.style.borderColor = "";
      const errorMsg = input.parentNode.querySelector(".error-message");
      if (errorMsg) {
        errorMsg.remove();
      }
    }

    return isValid || !input.value;
  }

  function validatePhone(input) {
    const phoneRegex = /^\d{9,15}$/;
    const isValid = phoneRegex.test(input.value);

    if (!isValid && input.value) {
      input.style.borderColor = "red";

      // Create error message if it doesn't exist
      let errorMsg = input.parentNode.querySelector(".error-message");
      if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "1rem";
        errorMsg.style.marginTop = "0.5rem";
        input.parentNode.appendChild(errorMsg);
      }
      errorMsg.textContent = "Please enter a valid phone number (digits only)";
    } else {
      input.style.borderColor = "";
      const errorMsg = input.parentNode.querySelector(".error-message");
      if (errorMsg) {
        errorMsg.remove();
      }
    }

    return isValid || !input.value;
  }

  // Add blur event listeners for real-time validation
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  emailInput.addEventListener("blur", function () {
    validateEmail(emailInput);
  });

  phoneInput.addEventListener("blur", function () {
    validatePhone(phoneInput);
  });
});

//   // Add submit event listener
//   contactForm.addEventListener("submit", function (event) {
//     // Prevent the default form submission
//     event.preventDefault();

//     // Perform form validation
//     if (!validateForm()) {
//       showAlert("Please fill out all required fields correctly.", "error");
//       return;
//     }

//     // Get form data
//     const formData = new FormData(contactForm);

//     // Convert FormData to JSON
//     const formJson = {};
//     formData.forEach((value, key) => {
//       formJson[key] = value;
//     });

//     // Show loading state
//     const submitButton = contactForm.querySelector('button[type="submit"]');
//     const originalButtonText = submitButton.textContent;
//     submitButton.textContent = "Sending...";
//     submitButton.disabled = true;

//     // Send the data using fetch API
//     fetch("process_contact.php", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formJson),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (data.status === "success") {
//           // Show success message
//           showAlert(
//             "Thank you for your message! We will get back to you soon.",
//             "success"
//           );

//           // Reset the form
//           contactForm.reset();
//         } else {
//           // Show error from server
//           showAlert(
//             data.message || "Something went wrong processing your request.",
//             "error"
//           );
//         }
//       })
//       .catch((error) => {
//         // Show error message
//         showAlert(
//           "Sorry, there was an error sending your message. Please try again later.",
//           "error"
//         );
//         console.error("Error:", error);
//       })
//       .finally(() => {
//         // Reset button state
//         submitButton.textContent = originalButtonText;
//         submitButton.disabled = false;
//       });
//   });

//   // Form validation functions
//   function validateForm() {
//     let isValid = true;

//     // Validate all required fields
//     const requiredInputs = contactForm.querySelectorAll("[required]");
//     requiredInputs.forEach((input) => {
//       if (!input.value.trim()) {
//         input.style.borderColor = "red";
//         isValid = false;
//       } else {
//         input.style.borderColor = "";
//       }
//     });

//     // Validate email and phone
//     const emailInput = document.getElementById("email");
//     const phoneInput = document.getElementById("phone");

//     if (!validateEmail(emailInput)) isValid = false;
//     if (!validatePhone(phoneInput)) isValid = false;

//     return isValid;
//   }

//   function validateEmail(input) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const isValid = emailRegex.test(input.value);

//     if (!isValid && input.value) {
//       input.style.borderColor = "red";

//       // Create error message if it doesn't exist
//       let errorMsg = input.parentNode.querySelector(".error-message");
//       if (!errorMsg) {
//         errorMsg = document.createElement("div");
//         errorMsg.className = "error-message";
//         errorMsg.style.color = "red";
//         errorMsg.style.fontSize = "1rem";
//         errorMsg.style.marginTop = "0.5rem";
//         input.parentNode.appendChild(errorMsg);
//       }
//       errorMsg.textContent = "Please enter a valid email address";
//     } else {
//       input.style.borderColor = "";
//       const errorMsg = input.parentNode.querySelector(".error-message");
//       if (errorMsg) {
//         errorMsg.remove();
//       }
//     }

//     return isValid || !input.value;
//   }

//   function validatePhone(input) {
//     const phoneRegex = /^\d{9,15}$/;
//     const isValid = phoneRegex.test(input.value);

//     if (!isValid && input.value) {
//       input.style.borderColor = "red";

//       // Create error message if it doesn't exist
//       let errorMsg = input.parentNode.querySelector(".error-message");
//       if (!errorMsg) {
//         errorMsg = document.createElement("div");
//         errorMsg.className = "error-message";
//         errorMsg.style.color = "red";
//         errorMsg.style.fontSize = "1rem";
//         errorMsg.style.marginTop = "0.5rem";
//         input.parentNode.appendChild(errorMsg);
//       }
//       errorMsg.textContent = "Please enter a valid phone number (digits only)";
//     } else {
//       input.style.borderColor = "";
//       const errorMsg = input.parentNode.querySelector(".error-message");
//       if (errorMsg) {
//         errorMsg.remove();
//       }
//     }

//     return isValid || !input.value;
//   }

//   // Add blur event listeners for real-time validation
//   const emailInput = document.getElementById("email");
//   const phoneInput = document.getElementById("phone");

//   emailInput.addEventListener("blur", function () {
//     validateEmail(emailInput);
//   });

//   phoneInput.addEventListener("blur", function () {
//     validatePhone(phoneInput);
//   });
// });
