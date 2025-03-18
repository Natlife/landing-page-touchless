import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient("https://rfzggdqjhflhxndavpkw.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmemdnZHFqaGZsaHhuZGF2cGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NjQ0ODAsImV4cCI6MjA1NzM0MDQ4MH0.LF4pJL0RT2iGZyiAMk6sZYnZ0hz9CtbHMTyD6XG6ayM");

 document.getElementById("submit-comment").addEventListener("click", async (event) => {
    event.preventDefault();
    const content = document.getElementById("comment-input").value;
    const rating = document.querySelector('input[name="rate"]:checked')?.value;

    if (!rating) return alert("Vui lòng đánh giá");

    const { error } = await supabase.from("test").insert([{ content, rating }]);
    if (error) return alert("Lỗi khi gửi bình luận!");

    document.getElementById("comment-input").value = "";
    fetchComments(); 
});

async function fetchComments() {
    const { data, error } = await supabase.from("test").select("*").order("id", { ascending: false });

    if (error) {
        console.error("Lỗi:", error);
        return;
    }

    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = "";

    data.forEach(comment => {
        const commentItem = document.createElement("div");
        commentItem.classList.add("comment-item");

        const stars = "★".repeat(comment.rating) + "☆".repeat(5 - comment.rating);

        commentItem.innerHTML = `
            <p><strong>${stars}</strong></p>
            <p>${comment.content}</p>
            <hr>
        `;
        commentList.appendChild(commentItem);
    });
}

fetchComments();


const links = document.querySelectorAll('nav a');
const downHeadLink = document.getElementById('down-head');
const linksArray = Array.from(links);
linksArray.push(downHeadLink);

linksArray.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = 90; // set height header default
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY === 0) {
        navbar.classList.add("hidden");
    } else {
        navbar.classList.remove("hidden");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const typedQuoteElement = document.querySelector('.typed-quote');
    const quotes = [
        "Touchless is a application that allows users to interact with their devices without touching them.",
        "It uses the webcam to detect hand gestures and perform actions based on the gestures.",
        "The application can be used to control various devices such as computers, smartphones, and smart TVs.",
        "Users can perform actions such as scrolling, clicking, and swiping using hand gestures.",
        "Touchless is a convenient and intuitive way to interact with devices without the need for physical contact."
    ];
    
    let index = 0;
    const typingSpeed = 40; // Typing speed in milliseconds
    const reverseTypingSpeed = 10; // Reverse typing speed in milliseconds
    const pauseBetweenQuotes = 1000; // Pause between quotes in milliseconds

    function typeQuote(quote) {
        typedQuoteElement.textContent = ''; // Clear the text initially
        let charIndex = 0;

        function type() {
            if (charIndex < quote.length) {
                typedQuoteElement.textContent += quote.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(() => {
                    reverseType(quote); // Start reverse typing after a pause
                }, pauseBetweenQuotes);
            }
        }

        type(); // Start the typing effect for the current quote
    }

    function reverseType(quote) {
        let charIndex = quote.length - 1; // Start from the end of the quote

        function type() {
            if (charIndex >= 0) {
                typedQuoteElement.textContent = quote.substring(0, charIndex);
                charIndex--;
                setTimeout(type, reverseTypingSpeed);
            } else {
                index = (index + 1) % quotes.length; // Move to the next quote
                typeQuote(quotes[index]); // Type the next quote
            }
        }

        type(); // Start the reverse typing effect
    }

    typeQuote(quotes[index]); // Start with the first quote
});