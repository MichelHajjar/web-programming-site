// I am not gonna lie this file is ai generated because the buttons are different than week 4 and week 6 buttons, in week 4 and 6 i didn't use the js for the buttons but noe i need it so that why i created a new js file only for week 8

// Week 8: Validate each step when the Next button is clicked.
// Python/Flask performs the server-side validation.

// Get the Week 8 form using its ID.
const form = document.getElementById("Week8ProfileForm");

// Execute the code only if the Week 8 form exists.
if (form) {

    // Get all the fieldsets (steps) inside the form.
    const steps = form.querySelectorAll(":scope > fieldset");

    // Get all the Next buttons.
    const nextButtons = form.querySelectorAll("label.next");

    // Prevent multiple validation requests at the same time.
    let checking = false;


    // FUNCTION 1: Remove previous error messages.
    function clearErrors(step) {

        // Find all elements with class "error" in the current step.
        const messages = step.querySelectorAll(".error");

        // Loop through each error message.
        messages.forEach(function (message) {

            // Remove the message from the page.
            message.remove();
        });

        // Find fields previously marked as invalid.
        const invalidFields = step.querySelectorAll('[aria-invalid="true"]');

        // Loop through invalid fields.
        invalidFields.forEach(function (field) {

            // Remove the invalid attribute from the field.
            field.removeAttribute("aria-invalid");
        });
    }


    // FUNCTION 2: Display an error next to its field.
    function showError(step, fieldName, message) {

        // Find the field using its name attribute.
        const field = step.querySelector('[name="' + fieldName + '"]');

        // If the field doesn't exist, stop this function.
        if (!field) return;

        // By default, the error will be placed after the field.
        let place = field;

        // For radio buttons or skills, use their fieldset as the location.
        if (field.type === "radio" || fieldName === "skills") {

            // Find the closest parent fieldset.
            place = field.closest("fieldset");
        }

        // Create a new span element to display the error.
        const error = document.createElement("span");

        // Give the span the CSS class "error".
        error.className = "error";

        // Put the error message inside the span.
        error.textContent = message;

        // Insert the error message after the field or fieldset.
        place.after(error);

        // Mark the field as invalid for accessibility.
        field.setAttribute("aria-invalid", "true");
    }


    // FUNCTION 3: Check the HTML validation rules.
    function htmlError(field) {

        // If the field satisfies all HTML rules, return no error.
        if (field.validity.valid) return "";

        // Check if a required field is empty.
        if (field.validity.valueMissing)
            return "This field is required.";

        // Check if the value doesn't match the HTML pattern.
        if (field.validity.patternMismatch)
            return "Please enter the required format.";

        // Check if the value has the wrong type (email, URL, etc.).
        if (field.validity.typeMismatch)
            return "Please enter a valid value or URL.";

        // Check if a number or date is below min or above max.
        if (field.validity.rangeUnderflow || field.validity.rangeOverflow) {

            // Return a message showing the allowed limits.
            return "Enter a value between " + field.min + " and " + field.max + ".";
        }

        // Check if a number doesn't follow the required step/increment.
        if (field.validity.stepMismatch)
            return "Please enter a valid increment.";

        // Default message for any other invalid value.
        return "Please enter a valid value.";
    }


    // FUNCTION 4: Validate the current step using Flask.
    // async allows us to use await inside this function.
    async function checkStep(index) {

        // If a validation request is already running, stop.
        if (checking) return;

        // Indicate that validation has started.
        checking = true;

        // Get the current fieldset using its index.
        const step = steps[index];

        // Get the Next button corresponding to this step.
        const nextButton = nextButtons[index];

        // Try to send the data and validate it.
        try {

            // Collect all input values from the form.
            const data = new FormData(form);

            // Add the current step number to the form data.
            // +1 because JavaScript indexes start at 0.
            data.append("validate_step", String(index + 1));

            // Send the form data to the Flask server using POST.
            // await waits for the server's response.
            const response = await fetch("/profile-validated/check-step", {
                method: "POST",  // HTTP method used to send data.
                body: data       // Form values sent to Flask.
            });

            // If the server response is not successful, throw an error.
            if (!response.ok)
                throw new Error("Validation request failed");

            // Convert the JSON response into a JavaScript object.
            const result = await response.json();

            // Get the validation errors returned by Flask.
            // If there are no errors, use an empty object.
            const errors = result.errors || {};

            // Get all input, select, and textarea fields in this step.
            const fields = step.querySelectorAll("input, select, textarea");

            // Loop through each field to check HTML validation rules.
            fields.forEach(function (field) {

                // Check only named fields without an existing server error.
                if (field.name && !errors[field.name]) {

                    // Call htmlError() to validate the field.
                    const message = htmlError(field);

                    // If there is an error, add it to the errors object.
                    if (message !== "")
                        errors[field.name] = message;
                }
            });

            // Remove old error messages before displaying new ones.
            clearErrors(step);

            // Initially assume that there are no errors.
            let hasErrors = false;

            // Loop through all errors returned by Flask or HTML validation.
            for (const fieldName in errors) {

                // At least one error exists.
                hasErrors = true;

                // Display the error next to its corresponding field.
                showError(step, fieldName, errors[fieldName]);
            }

            // If at least one error was found:
            if (hasErrors) {

                // Find the first field marked as invalid.
                const firstInvalid = step.querySelector('[aria-invalid="true"]');

                // Move the cursor/focus to that field.
                if (firstInvalid)
                    firstInvalid.focus();

                // Stop here: the user cannot move to the next step.
                return;
            }

            // If there are no errors, get the next step's radio control.
            // htmlFor contains the ID of the element the Next label targets.
            // checked = true activates that step.
            document.getElementById(nextButton.htmlFor).checked = true;

        } catch (error) {

            // If the request fails, display an alert to the user.
            alert("Unable to validate this step right now. Please try again.");

        } finally {

            // This always executes, whether validation succeeds or fails.
            // Allow another validation request.
            checking = false;
        }
    }


    // EVENT LISTENER: Detect when a Next button is clicked.

    // Loop through all Next buttons.
    nextButtons.forEach(function (button, index) {

        // Add a click event listener to each button.
        button.addEventListener("click", function (event) {

            // Prevent the default behavior (immediate next-step navigation).
            event.preventDefault();

            // Validate this step before allowing the user to move forward.
            checkStep(index);
        });
    });
}

