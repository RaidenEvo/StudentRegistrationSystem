import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://rntaxgtobwqykmixcpbf.supabase.co";
const SUPABASE_KEY = "sb_publishable_C8qOL1tBg-7lfh3Y-eHeyQ_yoFatvBG";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event){
event.preventDefault();

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;

const loginButton = loginForm.querySelector("button");

loginButton.disabled = true;
message.textContent = "Logging in...";

const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
});

loginButton.disabled = false;

if (error) {
    console.error("login error", error);
    message.textContent = error.message;
    return;
}

message.textContent = "Login successful!";

window.location.href = "subjects.html";
});