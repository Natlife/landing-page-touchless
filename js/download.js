$(document).ready(function () {
    // Sử dụng Google Sheet với dữ liệu JSON
    // Thay ID này bằng ID Google Sheet của bạn
    const ggSheetID = '15BKxBpd_wXagf2WirTJ2AYMfO-PMkuy1eAku2azaCdY';
    const url = `https://docs.google.com/spreadsheets/d/${ggSheetID}/gviz/tq?tqx=out:json`;

    fetch(url)
        .then(response => response.text())
        .then(data => {
            // Xử lý dữ liệu từ Google Sheet
            // Chuỗi phản hồi có định dạng đặc biệt, cần cắt bỏ phần đầu và cuối
            const jsonData = JSON.parse(data.substring(47).slice(0, -2));
            const rows = jsonData.table.rows;

            // Xóa dữ liệu hiện tại trong bảng
            $('.table.download-list-table tbody').empty();
            $('.download-list-mobile').empty();

            // Bỏ qua hàng đầu tiên nếu nó là tiêu đề
            // Duyệt qua từng hàng dữ liệu từ Google Sheet
            rows.forEach((row, index) => {
                // Lấy dữ liệu từ các cột
                const version = row.c[0] ? row.c[0].v : '';
                const releaseDate = row.c[1] ? extractDate(String(row.c[1].f)) : '';
                const downloadUrl = row.c[2] ? row.c[2].v : '';
                const notesUrl = row.c[3] ? row.c[3].v : '';
                const status = row.c[4] ? row.c[4].v.toLowerCase() : '';

                // Tạo nút tải xuống dựa trên trạng thái
                let downloadButton;
                if (status === 'coming_soon') {
                    downloadButton = '<p>Coming soon</p>';
                } else {
                    downloadButton = `<a href="${downloadUrl}" class="btn btn-primary btn-sm">Download</a>`;
                }

                if (index === 0) {
                    $('#download-button').click(function () {
                        window.location.href = downloadUrl;
                    });
                }

                // Tạo liên kết ghi chú phát hành
                let releaseNotes = '';
                if (status !== 'coming_soon' && notesUrl) {
                    releaseNotes = `<a href="${notesUrl}">Release Notes</a>`;
                }

                // Thêm dữ liệu vào bảng desktop
                const desktopRow = `
                    <tr>
                        <td class="release-ver">${version}</td>
                        <td class="release-date">${releaseDate}</td>
                        <td class="release-download">${downloadButton}</td>
                        <td class="release-note">${releaseNotes}</td>
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
                                ${status !== 'coming_soon' && notesUrl ?
                        `<a href="${notesUrl}" class="btn btn-default btn-sm">Release Notes</a>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                $('.download-list-mobile').append(mobileItem);
            });
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

function extractDate(value) {
    const arr = value.toString().split('/');

    var result = "";

    var monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const day = parseInt(arr[1], 10);
    const month = monthsName[parseInt(arr[0], 10)];
    const year = arr[2];

    result = month + ", " + day + ", " + year;

    return result;
}