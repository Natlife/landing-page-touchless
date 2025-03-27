import { supabase } from "./supabaseClient.js";
import { fetchRatings } from "./rating.js";

let allComments = [];

// get submit button
document.getElementById("submit-comment").addEventListener("click", async (event) => {
    event.preventDefault();
    const comment = document.getElementById("comment-input").value;
    const rating = document.querySelector('input[name="rate"]:checked')?.value;
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session || !session.user) {
        return alert("You need to log in to comment!");
    }

    const user_id = session.user.id;

    if (!rating) return alert("Please provide a rating!");

    const { error } = await supabase
        .from("reviews")
        .insert([{ user_id, rating, comment }])
    if (error) return alert("You can only comment once!");

    checkComment(user_id, comment);

    document.getElementById("comment-input").value = "";
});


/*
Author: Phan Son
-----
Function sending p_user_id, p_comment to Edge Function of Supabase.
It will alert to browser if user's comment is invalid.
*/
function checkComment(p_user_id, p_comment) {
    try {
        return fetch('https://jomvhjqzlqyfvssneprr.supabase.co/functions/v1/review-validation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbXZoanF6bHF5ZnZzc25lcHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMDgxMzYsImV4cCI6MjA1Nzg4NDEzNn0.yjce3yyEm-DDIEV9q0WCqHejtswF7CQRooaqzdhqnqI`
            },
            body: JSON.stringify({
                p_user_id: p_user_id,
                p_comment: p_comment,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Kiểm tra nếu comment bị xóa
            if (data.status === 'removed') {
                // Hiển thị thông báo cho người dùng
                alert('Your comment has been deleted for violating our policies');
                
                // Có thể thêm logic để cập nhật UI ở đây
                // Ví dụ: removeCommentFromUI(comment_id);
            }
            
            // Trả về kết quả để có thể sử dụng trong promise chain
            return data;
        })
        .catch(error => {
            console.error('Error validating comment:', error);
            // Không hiển thị alert khi có lỗi kết nối
        });
    } catch(e) {
        console.error('Exception in checkComment:', e);
        return Promise.reject(e);
    }
}

// update comments
async function fetchComments() {
    const { data, error } = await supabase 
        .from("reviews")
        .select("*, users(username), likes(count)")
        .order("created_at", { ascending: false });

    if(error) {
        console.error("Lỗi: ", error);
        return;
    }

    allComments = data.map(review => ({
        ...review,
        username: review.users?.username || "anonymous",
        like_count: review.likes?.[0]?.count || 0
    }));
    fetchRatings();
    renderComments();
}

function renderStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "⭐" : "☆"; 
    }
    return stars;
}

async function renderComments() {
    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = "";

    let isMyComment = true;
    let userId;
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if(error) throw error;
        userId = session.user.id; 
    } catch {
        console.log("Chưa đăng nhập");
    }

    allComments.forEach(comment => {
        const commentItem = document.createElement("div");
        commentItem.classList.add("comment-item");

        const date = new Date(comment.created_at);
        const formattedDate = date.toLocaleString("vi-VN", { 
            day: "2-digit", month: "2-digit", year: "numeric", 
            hour: "2-digit", minute: "2-digit" 
        });

        isMyComment = (comment.user_id === userId);

        commentItem.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span style="font-size: 24px; margin-right: 8px;">😎</span> <!-- Thay bằng icon khác nếu thích -->
          <p><strong>${comment.username}</strong></p>
        </div>
        <p><strong>${renderStars(comment.rating)} (${formattedDate})</strong></p>
        <p class="comment-text"></p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                  <button type="button" class="like-btn" data-id="${comment.review_id}" style="background: none; border: none; cursor: pointer;">
                      👍
                  </button>
                  <span class="like-count" data-id="${comment.review_id}">${comment.like_count || 0}</span>
              </div>
                  ${isMyComment ? `<button type="button" class="delete-btn" data-id="${comment.review_id}" style="background: none; border: none; color: red; cursor: pointer;">
                    🗑️
                  </button>` : ""}
           </div>
        <hr>
        `;

        commentItem.querySelector(".comment-text").textContent = comment.comment;
        commentList.appendChild(commentItem);
    })
}

// update likes, deletes
document.addEventListener("click", async (event) => {
    if(event.target.classList.contains("like-btn")) {
        const reviewId = event.target.getAttribute("data-id");
        const { data: { session } } = await supabase.auth.getSession();

        // prevent from spamming
        const button = event.target;
        button.disabled = true; 

        if (!session || !session.user) {
            button.disabled = false;
            return alert("You need to log in to like!");
        }

        const userId = session.user.id;

        const { data: existingLike, error: checkError } = await supabase
            .from("likes")
            .select("*")
            .eq("user_id", userId)
            .eq("review_id", reviewId)
            .maybeSingle(); 
        
        if(existingLike) {
            const { error } = await supabase
                .from("likes")
                .delete()
                .eq("user_id", userId)
                .eq("review_id", reviewId);

            if(error) {
                console.error("Lỗi khi unlike:", error);
            }
        }
        else {
            const { error } = await supabase
                .from("likes")
                .insert([{ user_id: userId, review_id: reviewId }]);

            if (error) {
                console.error("Lỗi khi thêm like:", error);
            }
        }
        updateLikeCount(reviewId);
        button.disabled = false;
    }

    if(event.target.classList.contains("delete-btn")) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        const reviewId = event.target.getAttribute("data-id");

        // prevent from spamming
        const button = event.target;
        button.disabled = true; 

        if (sessionError || !session || !session.user) {
            button.disabled = false; 
            return alert("You need to log in to delete a comment!");
        }

        const { data: review, error: fetchError } = await supabase
            .from("reviews")
            .select("user_id")
            .eq("review_id", reviewId)
            .maybeSingle(); 

        if (fetchError || !review) {
            button.disabled = false;
            return alert("Comment not found.");
        }

        if (review.user_id !== session.user.id) {
            button.disabled = false;
            return alert("You don't have permission to delete this comment.");
        }

        const { error } = await supabase.from("reviews").delete().eq("review_id", reviewId);
        if(error) {
            alert("Error deleting comment!");
            console.error(error);
        }

        setTimeout(() => {
            button.disabled = false;
        }, 1000);
    }
})

async function updateLikeCount(reviewId) {
    const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact" })
        .eq("review_id", reviewId)

    document.querySelector(`.like-count[data-id="${reviewId}"]`).textContent = count || 0;
}

// real-time
supabase
    .channel("reviews-realtime")
    .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        async (payload) => {
            await fetchComments();
        }
    )
    .subscribe()

fetchComments();

