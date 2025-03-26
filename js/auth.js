import { supabase } from "./supabaseClient.js"

const emailInput = document.getElementById("email");
const loginButton = document.getElementById("login-button");
const message = document.getElementById("message");

async function signIn() {
    try {
        const email = emailInput.value;
        if(!email) {
            message.textContent = "Please enter your email!";
            return
        }

        message.textContent = "Sending email...";

        const redirectTo = "http://landing-page-touchless.vercel.app/"

        const { error } = await supabase.auth.signInWithOtp({
            email, 
            options: {
                emailRedirectTo: redirectTo
            }
        })

        if(error) {
            throw error;
        }

        message.textContent = "Email sent! Please check your inbox.";
    } catch (error) {
        message.textContent = `Lỗi: ${error.message || error}`
        console.error(error);
    }
}

loginButton.addEventListener("click", signIn);