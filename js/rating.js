import { supabasePromise } from "./supabaseClient.js"

const supabase = await supabasePromise;


export async function fetchRatings() {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating');
        
        if (error) throw error;
        
        processRatings(data);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
}

function processRatings(reviewsData) {
    const ratings = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };
    
    reviewsData.forEach(review => {
        const rating = review.rating;
        if (rating >= 1 && rating <= 5) {
            ratings[rating]++;
        }
    });
    
    const totalRatings = reviewsData.length;
    
    let sum = 0;
    for (let star in ratings) {
        sum += star * ratings[star];
    }
    
    const averageRating = totalRatings > 0 
        ? (sum / totalRatings).toFixed(1).replace('.', ',') 
        : '0,0';
    
    updateUI(ratings, totalRatings, averageRating);
}

function updateUI(ratings, totalRatings, averageRating) {
    document.getElementById('averageRating').textContent = averageRating;
    
    document.getElementById('ratingCount').textContent = `${totalRatings} reviews`;
    
    updateStarsDisplay(averageRating);
    
    updateRatingBars(ratings, totalRatings);
}

function updateStarsDisplay(averageRating) {
    const starsDisplay = document.getElementById('starsDisplay');
    starsDisplay.innerHTML = '';
    
    const averageRatingNum = parseFloat(averageRating.replace(',', '.'));
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= Math.floor(averageRatingNum)) {
            star.className = 'bi bi-star-fill'; 
        } else if (i === Math.ceil(averageRatingNum) && averageRatingNum % 1 !== 0) {
            star.className = 'bi bi-star-half'; 
        } else {
            star.className = 'bi bi-star';
        }

        star.style.color = "gold";
        starsDisplay.appendChild(star);
    }
}

function updateRatingBars(ratings, totalRatings) {
    const ratingBarsElement = document.getElementById('ratingBars');
    ratingBarsElement.innerHTML = ''; 
    
    for (let i = 5; i >= 1; i--) {
        const count = ratings[i] || 0;
        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
        
        const ratingBar = document.createElement('div');
        ratingBar.className = 'rating-bar';
        ratingBar.innerHTML = `
            <div class="star-level">${i}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        
        ratingBarsElement.appendChild(ratingBar);
    }
}