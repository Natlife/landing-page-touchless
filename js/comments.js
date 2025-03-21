import { supabase } from "./supabaseClient";

const submit = document.getElementById("submit-comment");
const comment = document.getElementById("comment-input").value;
const rating = document.querySelector('input[name="rate"]:checked')?.value;
let  allComments = [];

submit.addEventListener("click", async () =>  {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session || !session.user) {
        return alert("Bạn cần đăng nhập để bình luận!");
    }

    const user_id = session.user.id;

    if(!rating) return alert("Vui lòng đánh giá");

    const { error } = await supabase
        .from("reviews")
        .insert([{user_id, rating, comment }])
    if(error) return alert("Lỗi khi gửi bình luận!");

    comment.value = "";
});

export async function fetchComments() {
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

    renderComments();
}

function renderComments() {
    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = "";

    allComments.forEach(comment => {
        const commentItem = document.createElement("div");
        commentItem.classList.add("comment-item");

        const date = new Date(comment.created_at);
        const formattedDate = date.toLocaleString("vi-VN", { 
            day: "2-digit", month: "2-digit", year: "numeric", 
            hour: "2-digit", minute: "2-digit" 
        });

        commentItem.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span style="font-size: 24px; margin-right: 8px;">😎</span> <!-- Thay bằng icon khác nếu thích -->
          <p><strong>${comment.username}</strong></p>
        </div>
        <p><strong>${renderStars(comment.rating)} (${formattedDate})</strong></p>
        <p>${comment.comment}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                  <button class="like-btn" data-id="${comment.review_id}" style="background: none; border: none; cursor: pointer;">
                      ❤️
                  </button>
                  <span class="like-count" data-id="${comment.review_id}">${comment.like_count || 0}</span>
              </div>
              <button class="delete-btn" data-id="${comment.review_id}" style="background: none; border: none; color: red; cursor: pointer;">
                  🗑️ Xóa
              </button>
           </div>
        <hr>
        `;
        commentList.appendChild(commentItem);
    })
}



