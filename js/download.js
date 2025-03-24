// const url = 'https://script.google.com/macros/s/AKfycbzHHbCr2u3notW4UVxUQgy-fdMfhDr0c3rt4r6ecUvT5VzaJ6_VFRO_b0pxO-4frEG0/exec';

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);});

$(document).ready(function () {
    // URL của Web App Apps Script
    const url = 'https://script.google.com/macros/s/AKfycbzHHbCr2u3notW4UVxUQgy-fdMfhDr0c3rt4r6ecUvT5VzaJ6_VFRO_b0pxO-4frEG0/exec';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // data là mảng 2 chiều mà Apps Script trả về
            const rows = data; // Giả sử data là mảng các hàng
            // Xóa dữ liệu hiện tại trong bảng
            $('.table.download-list-table tbody').empty();
            $('.download-list-mobile').empty();

            let isFirst = true;

            // Duyệt qua các dòng từ cuối lên nhưng bỏ qua hàng đầu tiên (index 0)
            for (let i = rows.length - 1; i >= 1; i--) {
                const row = rows[i];

                // Lấy dữ liệu từ các cột:
                // Giả sử:
                //   Cột 0: Version
                //   Cột 1: Release Date (f: display string)
                //   Cột 2: Download URL (hiện thực là hyperlink nếu có)
                //   Cột 3: Release Notes URL
                //   Cột 4: Status
                //   Cột 5: File size
                const version = row[0] ? row[0].value : '';
                const releaseDate = row[1] ? formatDate(String(row[1].value)) : '';
                const downloadUrl = row[2] ? (row[2].link ? row[2].link : row[2].value) : '';
                const notesUrl = row[3] ? (row[3].link ? row[3].link : row[3].value) : '';
                const status = row[4] ? row[4].value.toLowerCase() : '';
                const AppSize = row[5] ? row[5].value : '';

                // Tạo nút download dựa trên status
                let downloadButton;
                if (status === 'coming_soon') {
                    downloadButton = '<p>Coming soon</p>';
                } else {
                    downloadButton = `<a href="${downloadUrl}" class="btn btn-primary btn-sm">Download</a>`;
                }

                // Gán hành vi cho các nút rainbow-button và #home-dload-btn (cho bản mới nhất)
                if (isFirst) {
                    $('.rainbow-button').click(function () {
                        window.location.href = downloadUrl;
                    });
                    $('#latest-app-size').append(`
                        <p>${AppSize}MB - ${releaseDate}</p>
                        `);
                    $('#home-dload-btn').click(function () {
                        window.location.href = downloadUrl;
                    });
                    isFirst = false;
                }

                // Nếu cần, gán hành vi cho nút #download-button khi i là bản mới nhất (trong mảng đã đảo)
                if (i === rows.length - 1) {
                    $('#download-button').click(function () {
                        window.location.href = downloadUrl;
                    });
                }

                // Tạo link release notes
                let releaseNotesLink = '';
                if (status !== 'coming_soon' && notesUrl) {
                    releaseNotesLink = `<a href="${notesUrl}">Release Notes</a>`;
                }

                // Thêm dữ liệu vào bảng desktop
                const desktopRow = `
                    <tr>
                        <td class="release-ver">${version}</td>
                        <td class="release-date">${releaseDate}</td>
                        <td class="release-download">${downloadButton}</td>
                        <td class="release-note">${releaseNotesLink}</td>
                    </tr>
                `;
                $('.table.download-list-table tbody').append(desktopRow);

                // Thêm dữ liệu vào danh sách mobile
                const mobileItem = `
                    <div class="version-item">
                        <h4>${version}</h4>
                        <div class="version-info">
                            <p><strong>Release Date:</strong> ${releaseDate}</p>
                            <div class="mobile-buttons">
                                ${downloadButton}
                                ${status !== 'coming_soon' && notesUrl ? `<a href="${notesUrl}" class="btn btn-default btn-sm">Release Notes</a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                $('.download-list-mobile').append(mobileItem);
            }
        })
        .catch(error => {
            console.error('Error fetching data from Google Sheet:', error);
            $('#list-version').append(`
                <div class="alert alert-danger">
                    Không thể tải dữ liệu phiên bản. Vui lòng thử lại sau.
                </div>
            `);
        });
});

function formatDate(isoString) {
    const date = new Date(isoString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Lấy tháng theo giờ UTC (hoặc bạn có thể dùng local time nếu muốn)
    const month = months[date.getUTCMonth()];
    // Lấy ngày theo giờ UTC và định dạng thành 2 chữ số
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}, ${day}, ${year}`;
}
