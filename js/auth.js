import { supabase } from "./supabaseClient.js"

const emailInput = document.getElementById("email");
const loginButton = document.getElementById("login-button");
const message = document.getElementById("message");

async function signIn() {
    try {
        const email = emailInput.value;
        if(!email) {
            message.textContent = "Vui lòng nhập email";
            return
        }

        message.textContent = "Đang gửi email...";

        const redirectTo = "http://127.0.0.1:5500/landing-page-touchless/"

        const { error } = await supabase.auth.signInWithOtp({
            email, 
            options: {
                emailRedirectTo: redirectTo
            }
        })

        if(error) {
            throw error;
        }

        message.textContent = "Đã gửi email! Vui lòng kiểm tra hộp thư của bạn.";
    } catch (error) {
        message.textContent = `Lỗi: ${error.message || error}`
        console.error(error);
    }
}

loginButton.addEventListener("click", signIn);