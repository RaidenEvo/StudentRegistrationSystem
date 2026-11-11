import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

document.addEventListener("DOMContentLoaded", () => {

    const SUPABASE_URL = "https://rntaxgtobwqykmixcpbf.supabase.co";
    const SUPABASE_KEY = "sb_publishable_C8qOL1tBg-7lfh3Y-eHeyQ_yoFatvBG";

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const subjects = document.querySelectorAll(".subject");
    const saveButton = document.getElementById("saveSubjects");
    const saveMessage = document.getElementById("saveMessage");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const logoutButton = document.getElementById("logoutButton");

    let currentUser = null;

    async function checkLogin() {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            window.location.href = "login.html";
            return false;
        }

        currentUser = data.session.user;

        const studentName = currentUser.user_metadata.full_name || "student";

        welcomeMessage.textContent = `Welcome, ${studentName}`;

        return true;
    }

    subjects.forEach(subject => {
        subject.addEventListener("click", () => {
            subject.classList.toggle("selected");
        });
    });

    async function loadSubjects() {
        const { data, error } = await supabase
        .from("student_subjects")
        .select("subject_name")
        .eq("user_id", currentUser.id);

        if (error) {
            saveMessage.textContent = "Unable to load saved subjects.";
            console.error(error);
            return;
        }

        data.forEach(savedSubject => {
            subjects.forEach(subject => {
                if (subject.dataset.subject === savedSubject.subject_name) {
                    subject.classList.add("selected");
                }
            });
        });
    }

    async function saveSubjects() {
        saveButton.disabled = true;
        saveMessage.textContent = "Saving subjects...";

        const selectedSubjects = Array.from(subjects)
        .filter(subject => subject.classList.contains("selected"))
        .map(subject => subject.dataset.subject);

        const { data: existingSubjects, error: fetchError } = await supabase
        .from("student_subjects")
        .select("subject_name")
        .eq("user_id", currentUser.id);

        if (fetchError) {
            saveMessage.textContent = "Error checking saved objects.";
            console.error(fetchError);
            saveButton.disabled = false;
            return;
        }

        const existingNames = existingSubjects.map(item => item.subject_name);

        const subjectsToAdd = selectedSubjects.filter(
            name => !existingNames.includes(name)
        );

        const subjectsToRemove = existingNames.filter(
            name => !selectedSubjects.includes(name)
        );

        if (subjectsToAdd.length > 0) {
            const rows = subjectsToAdd.map(name => ({
                user_id: currentUser.id,
                subject_name: name
            }));

            const { error } = await supabase
            .from("student_subjects")
            .insert(rows);

            if (error) {
                saveMessage.textContent = "Error saving subjects.";
                console.error(error);
                saveButton.disabled = false;
                return;
            }
        }

        for (const name of subjectsToRemove) {
            const { error } = await supabase
            .from("student_subjects")
            .delete()
            .eq("user_id", currentUser.id)
            .eq("subject_name", name);

            if (error) {
                saveMessage.textContent = "Some subjects could not be removed.";
                console.error(error);
                saveButton.disabled = false;
                return;
            }
        }

        saveMessage.textContent = "Subjects saved successfully!";
        saveButton.disabled = false;
    }

    async function initializePage() {
        const loggedIn = await checkLogin();

        if (!loggedIn) {
            return;
        }

        await loadSubjects();
    }

    saveButton.addEventListener("click", saveSubjects);

    logoutButton.addEventListener("click", async () => {
        const { error } = await supabase.auth.signOut();
        
        if(error) {
            alert("Error logging out. Please try again.");
            return;
        }

        window.location.href = "login.html"
    })

    initializePage();
})