import { supabasePromise } from "./supabaseClient.js"

const supabase = await supabasePromise;
 
 export async function checkAndSaveUserSession() {
     if(window.location.hash) {
         const { error } = await supabase.auth.getUser()
         if(error) {
             console.error(error);
         }
     }

     const { data: { session }, error: sessionError } = await supabase.auth.getSession();
     const authButton = document.getElementById("authButton");
 
     if(sessionError) {
         console.error("❌ Lỗi lấy session:", sessionError.message);
         return;
     }
     
     if (!session || !session.user) {
         authButton.innerHTML = "Log in";
         authButton.onclick = function () {
             window.open('login.html', '_self')
         }
         console.log("⚠ Chưa đăng nhập.");
         return;
     }
 
     authButton.innerHTML = "Sign out";
     authButton.onclick = async function () {
         try {
             const { error } = await supabase.auth.signOut();
             if(error) {
                 throw error;
             }
             console.log("Đăng xuất thành công.");
             window.open("index.html", '_self');
         } catch (error) {
             console.error(error);
         }
     }
 
     const user = session.user;
    //  console.log("✅ Session có user:", user);
 
     const user_id = user.id;
     const email = user.email;
     const username = email.split("@")[0];
 
     const { data: existingUser, error: selectError } = await supabase
         .from("users")
         .select("*")
         .eq("user_id", user_id)
         .eq("email", email)
         .single()
 
     if(selectError && selectError.code != "PGRST116") { // PGRST116 = Không tìm thấy user
         console.error("❌ Lỗi khi kiểm tra user:", selectError.message);
         return;
     }
 
     if(!existingUser) {
         console.log("📌 User chưa có trong DB, tiến hành lưu...");
         const { error: insertError } = await supabase
             .from("users")
             .insert([{ user_id, username, email }])
 
         if (insertError) {
             console.error("❌ Lỗi khi lưu user:", insertError.message);
         } else {
             console.log("✅ Đã lưu user mới vào DB.");
         }
     } else {
         console.log("🔹 User đã tồn tại trong DB.");
     }
 }

 checkAndSaveUserSession();