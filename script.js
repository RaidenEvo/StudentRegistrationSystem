import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://rntaxgtobwqykmixcpbf.supabase.co";
const SUPABASE_KEY = "sb_publishable_C8qOL1tBg-7lfh3Y-eHeyQ_yoFatvBG";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const registrationForm = document.getElementById("registrationForm");
const message = document.getElementById("message");

registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const schoolId = document.getElementById("schoolId").value.trim();

    message.textContent = "Creating your account...";

    const registerButton = registrationForm.querySelector("button");
    registerButton.disabled = true;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: `${window.location.origin}/subjects.html`,
            data: {
                full_name: fullName,
                school_id: schoolId
            }
        }
    });

    registerButton.disabled = false;

    if (error) {
        console.error("Supabase registration error:", error);
        message.textContent = error.message;
        return;
    }

    if (data.session) {
        message.textContent = "Registration successful!";
        window.location.href = "subjects.html";
    } else {
        message.textContent = "Account created! Please check your email to confirm your registration.";
    }
});