// import { fetchComments } from "./comments.js";
import { supabase } from "./supabaseClient.js";
import { checkAndSaveUserSession } from "./user.js";

// check session

checkAndSaveUserSession();

// update comment
// supabase
//     .channel("reviews-realtime")
//     .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "reviews" },
//         async (payload) => {
//             await fetchComments();
//         }
//     )
//     .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "likes" },
//         async (payload) => {
//             await fetchComments();
//         }
//     )
//     .subscribe();

// fetchComments();