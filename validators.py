import re          # Python's built-in Regular Expressions (regex) module
from datetime import date
# ---- patterns (compiled once) ------------------------------------
STUDENT_ID = re.compile(r"^\d{9}$") # exactly 9 digits
FULLNAME  = re.compile(r"^[A-Za-z][A-Za-z .'\-]{1,79}$") # letters/spaces/.'- , 2..80 chars
EMAIL = re.compile(r"^[a-z]+\.[a-z]+@net\.usek\.edu\.lb$")  # Valid USEK email format
PHONE = re.compile(r"^(03|70|71|76|78|79|81)/[0-9]{6}$")  # Lebanese phone starting with +961
GITHUB = re.compile(r"^https://github\.com/[A-Za-z0-9-]+/?$")  # GitHub profile URL
HTTPS_URL = re.compile(r"^https://[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:/[^\s]*)?$")  # HTTPS website URL
MONTH = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")  # Month in YYYY-MM format (01–12)
TIME = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")  # Time in HH:MM format (00:00–23:59)
HEXCOLOR = re.compile(r"^#[0-9A-Fa-f]{6}$")  # Hex color format (#RRGGBB)


# ---- allow-lists -----------------------------------

MAJORS = {
    "computer engineering",
    "electrical engineering",
    "mechanical engineering",
    "telecommunication engineering",
    "civil engineering",
    "industrial engineering",
    "biomedical engineering"
}

GRADUATION = {"spring", "summer", "fall"}

YESNO = {"yes", "no"}

SKILLS = {
    "Programming",
    "Embedded Systems",
    "Electronics",
    "Computer Networks",
    "Telecommunications",
    "Biomedical instrumentation",
    "Artificial Intelligence / Machine Learning",
    "Signal Processing"
}

SOFTWARE = {
    "MATLAB", "Simulink", "LabVIEW", "LTspice",
    "Vivado", "SolidWorks", "Proteus", "Multisim"
}

PROJECT_AREAS = {
    "Artificial Intelligence",
    "Web Applications",
    "Cybersecurity",
    "Internet of Things",
    "Power Systems",
    "Renewable Energy",
    "Control Systems",
    "Medical Imaging",
    "Biosensors",
    "Medical Devices",
    "Wireless Communications",
    "5G/6G Networks",
    "Optical Fiber Communications",
    "Thermal Engineering",
    "Manufacturing",
    "Robotics",
    "Operations Research",
    "Production Systems",
    "Supply Chain Management"
}

# ---- required fields --------------------------------

REQUIRED = {
    "student_id",
    "fullname",
    "email",
    "phone",
    "birthdate",
    "major",
    "gpa",
    "credits",
    "graduation",
    "graduation_month",
    "internship_completed",
    "language",
    "meeting_date",
    "meeting_time",
    "confirmation"
}


def parse_date(text):
    try:
        return date.fromisoformat(text)  # Convert YYYY-MM-DD to a date
    except ValueError:
        return None  # Return None if the date is invalid


def to_number(text):
    try:
        return float(text)  # Convert text to a decimal number
    except ValueError:
        return None        # Invalid number


def to_int(text):
    try:
        return int(text)    # Convert text to an integer
    except ValueError:
        return None        # Invalid integer


def validate_profile(form):
    errors = {}      # Field name -> error message
    cleaned = {}     # Field name -> validated value

    # --- 1. Required fields: must be present and not blank -----------
    for field in REQUIRED:
        if form.get(field, "").strip() == "":
            errors[field] = "This field is required."

    # --- 2. Student ID: exactly 9 digits 
    student_id = form.get("student_id", "").strip()
    if student_id != "" and not STUDENT_ID.match(student_id):
        errors["student_id"] = "Student ID must be exactly 9 digits."

    cleaned["student_id"] = student_id
    
    # ---3. Full name: letters, spaces, hyphens, apostrophes,2 to 80 chars
    fullname = form.get("fullname", "").strip()
    if fullname != "" and not FULLNAME.match(fullname):
        errors["fullname"] = "Full name must contain only letters, spaces, hyphens, and apostrophes, and be between 2 and 80 characters long."

    cleaned["fullname"] = fullname
    
    # ---4. USEK email (we also lower-case it so it is stored consistently)
    email = form.get("email", "").strip().lower()
    if email != "" and not EMAIL.fullmatch(email):
        errors["email"] = "Use your USEK email (...@net.usek.edu.lb)."

    cleaned["email"] = email

    # --- 5. Lebanese phone number
    phone = form.get("phone", "").strip()
    if phone != "" and not PHONE.fullmatch(phone):
        errors["phone"] = "Enter a valid number, e.g. 70/123456."

    cleaned["phone"] = phone
    
    #  ---6. Date of birth: a real date, not in the future, with a believable age
    birthdate = form.get("birthdate", "").strip()

    if birthdate != "":
        day = parse_date(birthdate)

        if day is None:
            errors["birthdate"] = "Not a valid date."
        elif day > date.today():
            errors["birthdate"] = "Date of birth cannot be in the future."
        else:
            age = (date.today() - day).days // 365
            if age < 15 or age > 100:
                errors["birthdate"] = "Age looks out of range."

    cleaned["birthdate"] = birthdate

    # ---7. GitHub link
    portfolio = form.get("portfolio", "").strip()
    if portfolio != "" and not GITHUB.fullmatch(portfolio):
        errors["portfolio"] = "Use a GitHub URL: https://github.com/username"

    cleaned["portfolio"] = portfolio
    # ---8. GIN446 site link (any https:// link)
    gin446 = form.get("gin446", "").strip()

    if gin446 != "" and not HTTPS_URL.fullmatch(gin446):
        errors["gin446"] = "Enter a valid https:// link."

    cleaned["gin446"] = gin446
       
    # --- 9. Major: must be one of the allowed majors
    major = form.get("major", "").strip().lower()

    if major != "" and major not in MAJORS:
        errors["major"] = "Choose a valid major."

    cleaned["major"] = major

    # --- 10. GPA: a number between 40 and 100
    gpa = form.get("gpa", "").strip()

    if gpa != "":
        number = to_number(gpa)
        if number is None or not (40 <= number <= 100):
            errors["gpa"] = "GPA must be a number between 40 and 100."

    cleaned["gpa"] = gpa

    # ---11. Credits: a whole number between 0 and 148
    credits = form.get("credits", "").strip()

    if credits != "":
        number = to_int(credits)
        if number is None or number < 0 or number > 148:
            errors["credits"] = "Credits must be a whole number between 0 and 148."

    cleaned["credits"] = credits

    # ---12. Expected graduation: spring / summer / fall
    graduation = form.get("graduation", "").strip().lower()

    if graduation != "" and graduation not in GRADUATION:
        errors["graduation"] = "Choose spring, summer or fall."

    cleaned["graduation"] = graduation

    # ---13. Graduation month: shape YYYY-MM
    graduation_month = form.get("graduation_month", "").strip()

    if graduation_month != "" and not MONTH.fullmatch(graduation_month):
        errors["graduation_month"] = "Use the month picker (YYYY-MM)."

    cleaned["graduation_month"] = graduation_month
    
    #---14. Internship completed: yes / no
    internship_completed = form.get("internship_completed", "").strip().lower()

    if internship_completed != "" and internship_completed not in YESNO:
        errors["internship_completed"] = "Choose yes or no."

    cleaned["internship_completed"] = internship_completed

    #---15. Primary language: free text, but keep it short
    language = form.get("language", "").strip()

    if len(language) > 40:
        errors["language"] = "Keep it under 40 characters."

    cleaned["language"] = language

    #---16. Skills: checkboxes -> a list. Keep only values we recognise.
    skills = form.getlist("skills")
    good_skills = []
    bad_skills = []

    for skill in skills:
        if skill in SKILLS:
            good_skills.append(skill)
        else:
            bad_skills.append(skill)

    if bad_skills:
        errors["skills"] = "Unknown skill(s): " + ", ".join(bad_skills)

    cleaned["skills"] = good_skills

    #---17. Software: multi-select -> a list. Same idea as skills.
    software = form.getlist("software")
    good_software = []
    bad_software = []

    for program in software:
        if program in SOFTWARE:
            good_software.append(program)
        else:
            bad_software.append(program)

    if bad_software:
        errors["software"] = "Unknown software: " + ", ".join(bad_software)

    cleaned["software"] = good_software

    #---18. Project title: at most 120 characters
    project_title = form.get("project_title", "").strip()

    if len(project_title) > 120:
        errors["project_title"] = "Title must be 120 characters or fewer."

    cleaned["project_title"] = project_title

    #---19. Project area: must be one of the allowed areas
    project_area = form.get("project_area", "").strip()

    if project_area != "" and project_area not in PROJECT_AREAS:
        errors["project_area"] = "Choose a valid project area."

    cleaned["project_area"] = project_area

    #---20. Description: at most 1000 characters
    description = form.get("description", "").strip()

    if len(description) > 1000:
        errors["description"] = "Description must be 1000 characters or fewer."

    cleaned["description"] = description
    
    #---21. Team size: a whole number from 1 to 4
    team_size = form.get("team_size", "").strip()

    if team_size != "":
        number = to_int(team_size)
        if number is None or number < 1 or number > 4:
            errors["team_size"] = "Team size must be a whole number from 1 to 4."

    cleaned["team_size"] = team_size

    #---22. Dashboard color: a hex colour like #336699 (default if left empty)
    project_color = form.get("project_color", "").strip()

    if project_color != "" and not HEXCOLOR.fullmatch(project_color):
        errors["project_color"] = "Use a colour like #336699."

    if project_color == "":
        project_color = "#336699"

    cleaned["project_color"] = project_color

    #---23. Meeting date: a real date
    meeting_date = form.get("meeting_date", "").strip()

    if meeting_date != "":
        day = parse_date(meeting_date)

        if day is None:
            errors["meeting_date"] = "Not a valid date."
        elif day < date.today():
            errors["meeting_date"] = "Meeting date cannot be in the past."

    cleaned["meeting_date"] = meeting_date

    #---24. Meeting time: shape HH:MM, between 08:00 and 18:00
    meeting_time = form.get("meeting_time", "").strip()

    if meeting_time != "":
        if not TIME.fullmatch(meeting_time):
            errors["meeting_time"] = "Use HH:MM."
        elif not ("08:00" <= meeting_time <= "18:00"):
            errors["meeting_time"] = "Pick a time between 08:00 and 18:00."

    cleaned["meeting_time"] = meeting_time

    # --- Confirmation checkbox 
    confirmation = form.get("confirmation", "")

    if confirmation != "on":
        errors["confirmation"] = "You must confirm the information is accurate."

    cleaned["confirmation"] = confirmation

    # Done: hand back the problems and the trusted values.
    return errors, cleaned




