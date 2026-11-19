const form = document.getElementById("ProfileForm");
const reviewPanel = document.createElement("section");
reviewPanel.id = "ReviewPanel";
reviewPanel.classList.add("review-panel");
const reviewTitle = document.createElement("h2");
reviewTitle.textContent = "Review Your Profile";
reviewPanel.appendChild(reviewTitle);
const reviewContent = document.createElement("div");
reviewContent.id = "ReviewContent";
reviewPanel.appendChild(reviewContent);
const editButton = document.createElement("input");
editButton.type = "button";
editButton.id = "EditButton";
editButton.value = "Edit";
reviewPanel.appendChild(editButton);
const confirmButton = document.createElement("input");
confirmButton.type = "button";
confirmButton.id = "ConfirmButton";
confirmButton.value = "Confirm & Submit";
reviewPanel.appendChild(confirmButton);

form.after(reviewPanel);
form.addEventListener("submit", function (e) {
    e.preventDefault();
    if(!form.checkValidity()){ /*if the form is not valid */
        form.reportValidity();/*tell the browser to display its normal validation message like :Please fill out this field*/
        return;
    }
    const studentid = document.getElementById("studentID").value;
    const name = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const DateOfBirth = document.getElementById("DateOfBirth").value;
    const github = document.getElementById("github").value;
    const WebWebsite = document.getElementById("WebWebsite").value;
    const major = document.getElementById("major").value;
    const GPA = document.getElementById("GPA").value;
    const credits = document.getElementById("credits").value;
    const graduation = document.querySelector('input[name="graduation"]:checked')?.value;
    const GradDate = document.getElementById("GradDate").value;
    const internship = document.querySelector('input[name="internship_completed"]:checked')?.value;
    const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(cb=>cb.value);
    const language = document.getElementById("ProgLang").value;
    const software = [...document.getElementById("Software").selectedOptions].map(opt=>opt.value);
    const ProjectTitle = document.getElementById("ProjectTitle").value;
    const ProjectArea = document.getElementById("ProjectArea").value;
    const ProjectDescription = document.getElementById("Desc").value;
    const TeamSize = document.getElementById("Team-size").value;
    const Color = document.getElementById("project_color").value;
    const MeetingDate = document.getElementById("meeting-date").value;
    const MeetingTime = document.getElementById("meeting-time").value;
    const confirmation = document.getElementById("confirmation").checked;

    reviewContent.textContent = "";/* we don't want the previous values if the user want to edit the form*/
    const studentIDText = document.createElement("p");
    studentIDText.textContent = "Student ID: " + studentid;
    reviewContent.appendChild(studentIDText);
    const nameText = document.createElement("p");
    nameText.textContent = "Full Name: " + name;
    reviewContent.appendChild(nameText);
    const emailText = document.createElement("p");
    emailText.textContent = "USEK Email: " + email;
    reviewContent.appendChild(emailText);
    const phoneText = document.createElement("p");
    phoneText.textContent = "Mobile Number: +961 " + phone;
    reviewContent.appendChild(phoneText);
    const birthdateText = document.createElement("p");
    birthdateText.textContent = "Date of Birth: " + DateOfBirth;
    reviewContent.appendChild(birthdateText);
    const githubText = document.createElement("p");
    githubText.textContent = "Github: " + github;
    reviewContent.appendChild(githubText);
    const websiteText = document.createElement("p");
    websiteText.textContent = "GIN446 Website: " + WebWebsite;
    reviewContent.appendChild(websiteText);
    const majorText = document.createElement("p");
    majorText.textContent = "Engineering Major: " + major;
    reviewContent.appendChild(majorText);
    const gpaText = document.createElement("p");
    gpaText.textContent = "Current GPA: " + GPA;
    reviewContent.appendChild(gpaText);
    const creditsText = document.createElement("p");
    creditsText.textContent = "Credits Completed: " + credits;
    reviewContent.appendChild(creditsText);
    const graduationText = document.createElement("p");
    graduationText.textContent = "Expected Graduation: " + graduation;
    reviewContent.appendChild(graduationText);
    const gradDateText = document.createElement("p");
    gradDateText.textContent = "Expected Graduation Month & Year: " + GradDate;
    reviewContent.appendChild(gradDateText);
    const internshipText = document.createElement("p");
    internshipText.textContent = "Engineering Internship Completed: " + internship;
    reviewContent.appendChild(internshipText);
    const skillsText = document.createElement("p");
    skillsText.textContent = "Skills: ";
    reviewContent.appendChild(skillsText);
    const skillsList = document.createElement("ul");
    skills.forEach(function (skill){
        const li=document.createElement("li");
        li.textContent =skill;
        skillsList.appendChild(li);
    });
    reviewContent.appendChild(skillsList);
    const languageText = document.createElement("p");
    languageText.textContent = "Primary Programming Language: " + language;
    reviewContent.appendChild(languageText);
    const softwareText = document.createElement("p");
    softwareText.textContent = "Engineering Software Used: ";
    reviewContent.appendChild(softwareText);
    const softwareList=document.createElement("ul");
    software.forEach(function(soft){
        const li=document.createElement("li");
        li.textContent=soft;
        softwareList.appendChild(li);
    });
    reviewContent.appendChild(softwareList);
    const projectTitleText = document.createElement("p");
    projectTitleText.textContent = "Proposed Project Title: " + ProjectTitle;
    reviewContent.appendChild(projectTitleText);
    const projectAreaText = document.createElement("p");
    projectAreaText.textContent = "Preferred Project Area: " + ProjectArea;
    reviewContent.appendChild(projectAreaText);
    const descriptionText = document.createElement("p");
    descriptionText.textContent = "Project Description: " + ProjectDescription;
    reviewContent.appendChild(descriptionText);
    const teamSizeText = document.createElement("p");
    teamSizeText.textContent = "Preferred Team Size: " + TeamSize;
    reviewContent.appendChild(teamSizeText);
    const colorText = document.createElement("p");
    colorText.textContent = "Project Dashboard Color: " + Color;
    reviewContent.appendChild(colorText);
    const meetingDateText = document.createElement("p");
    meetingDateText.textContent = "Preferred Meeting Date: " + MeetingDate;
    reviewContent.appendChild(meetingDateText);
    const meetingTimeText = document.createElement("p");
    meetingTimeText.textContent = "Preferred Meeting Time: " + MeetingTime;
    reviewContent.appendChild(meetingTimeText);
    const confirmationText = document.createElement("p");
    confirmationText.textContent = "Information Confirmed: " + confirmation;
    reviewContent.appendChild(confirmationText);
    reviewPanel.classList.add("open");
});
editButton.addEventListener("click", function () {
reviewPanel.classList.remove("open");/*this makes the review panel disappear and the user can edit the form again */
});
confirmButton.addEventListener("click", function () {
reviewPanel.classList.remove("open");
form.submit();
});
// week 12
// Select all Next and Previous buttons inside the form.
form.querySelectorAll("button.next, button.prev").forEach(function (button) {
    // Run this function whenever a Next or Previous button is clicked.
    // This also works when the button is activated using Enter or Space.
    button.addEventListener("click", function () {

        // Find the fieldset (current form step) containing the clicked button.
        const currentStep = button.closest("fieldset");

        // Check validation only when moving forward (Next).
        // Previous does not need validation.
        if (button.classList.contains("next")) {

            // Get all input fields, dropdown menus, and textareas
            // belonging to the current step.
            const fields = currentStep.querySelectorAll(
                "input, select, textarea"
            );

            // Loop through every field in the current step.
            for (const field of fields) {

                // Check whether the field satisfies its HTML validation rules.
                if (!field.checkValidity()) {

                    // Display the browser's built-in validation error message.
                    field.reportValidity();

                    // Move keyboard focus to the invalid field.
                    field.focus();

                    // Stop here so the user cannot move to the next step.
                    return;
                }
            }
        }

        // Read the destination step from the button's data-step attribute.
        // Example: data-step="step2" gives targetId = "step2".
        const targetId = button.dataset.step;

        // Select the hidden radio button corresponding to the destination step.
        // The existing CSS uses this radio button to display the correct fieldset.
        document.getElementById(targetId).checked = true;

        // Extract the step number and convert it to a zero-based index.
        // Example: "step2" -> 2 - 1 = 1 (second fieldset).
        const stepIndex = Number(targetId.replace("step", "")) - 1;

        // Get all direct fieldsets inside the form (the wizard steps).
        const fieldsets = form.querySelectorAll(":scope > fieldset");

        // Find the first input, dropdown, or textarea in the destination step.
        const firstField = fieldsets[stepIndex].querySelector(
            "input, select, textarea"
        );

        // Move keyboard focus to the first field of the new step.
        // This allows keyboard users to continue without pressing Tab
        // through unrelated elements.
        if (firstField) {
            firstField.focus();
        }
    });
});