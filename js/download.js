// $(document).ready(function () {
//     // Sử dụng Google Sheet với dữ liệu JSON
//     // Thay ID này bằng ID Google Sheet của bạn
//     const url = `https://script.google.com/macros/s/AKfycbzHHbCr2u3notW4UVxUQgy-fdMfhDr0c3rt4r6ecUvT5VzaJ6_VFRO_b0pxO-4frEG0/exec`;

//     fetch(url)
//         .then(response => response.text())
//         .then(data => {
//             // Xử lý dữ liệu từ Google Sheet
//             // Chuỗi phản hồi có định dạng đặc biệt, cần cắt bỏ phần đầu và cuối
//             const jsonData = JSON.parse(data.substring(47).slice(0, -2));
//             const rows = jsonData.table.rows;

//             // Xóa dữ liệu hiện tại trong bảng
//             $('.table.download-list-table tbody').empty();
//             $('.download-list-mobile').empty();

//             let isFirst = true;

//             // Bỏ rows.forEach(...) cũ, thay bằng:
//             for (let i = rows.length - 1; i >= 0; i--) {
//                 const row = rows[i];

//                 // Lấy dữ liệu
//                 const version = row.c[0] ? row.c[0].v : '';
//                 const releaseDate = row.c[1] ? extractDate(String(row.c[1].f)) : '';
//                 const downloadUrl = row.c[2] ? row.c[2].v : '';
//                 const notesUrl = row.c[3] ? row.c[3].v : '';
//                 const status = row.c[4] ? row.c[4].v.toLowerCase() : '';

//                 // Tạo nút download
//                 let downloadButton;
//                 if (status === 'coming_soon') {
//                     downloadButton = '<p>Coming soon</p>';
//                 } else {
//                     downloadButton = `<a href="${downloadUrl}" class="btn btn-primary btn-sm">Download</a>`;
//                 }

//                 // Link the newest version to Rainbow Button
//                 if (isFirst) {
//                     $('.rainbow-button').click(function () {
//                         window.location.href = downloadUrl;
//                     });
//                     $('#home-dload-btn').click(function () {
//                         window.location.href = downloadUrl;
//                     });
//                     isFirst = false;
//                 }

//                 // Nếu bạn vẫn muốn gán nút download cho #download-button khi i = rows.length - 1 (bản mới nhất)
//                 // thì bạn cần logic thay thế cho if (index === 0). Ví dụ:
//                 if (i === rows.length - 1) {
//                     $('#download-button').click(function () {
//                         window.location.href = downloadUrl;
//                     });
//                 }

//                 // Tạo link release notes
//                 let releaseNotes = '';
//                 if (status !== 'coming_soon' && notesUrl) {
//                     releaseNotes = `<a href="${notesUrl}">Release Notes</a>`;
//                 }

//                 // Thêm dữ liệu vào bảng desktop
//                 const desktopRow = `
//         <tr>
//             <td class="release-ver">${version}</td>
//             <td class="release-date">${releaseDate}</td>
//             <td class="release-download">${downloadButton}</td>
//             <td class="release-note">${releaseNotes}</td>
//         </tr>
//     `;
//                 $('.table.download-list-table tbody').append(desktopRow);

//                 // Thêm dữ liệu vào danh sách mobile
//                 const mobileItem = `
//         <div class="version-item">
//             <h4>${version}</h4>
//             <div class="version-info">
//                 <p><strong>Release Date:</strong> ${releaseDate}</p>
//                 <div class="mobile-buttons">
//                     ${downloadButton}
//                     ${status !== 'coming_soon' && notesUrl ?
//                         `<a href="${notesUrl}" class="btn btn-default btn-sm">Release Notes</a>` : ''}
//                 </div>
//             </div>
//         </div>
//     `;
//                 $('.download-list-mobile').append(mobileItem);
                
//             }

//         })
//         .catch(error => {
//             console.error('Error fetching data from Google Sheet:', error);
//             $('#list-version').append(`
//                 <div class="alert alert-danger">
//                     Không thể tải dữ liệu phiên bản. Vui lòng thử lại sau.
//                 </div>
//             `);
//         });
// });

// function extractDate(value) {
//     const arr = value.toString().split('/');

//     var result = "";

//     var monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//     const day = parseInt(arr[1], 10);
//     const month = monthsName[parseInt(arr[0], 10)];
//     const year = arr[2];

//     result = month + ", " + day + ", " + year;

//     return result;
// }
//======================================================
// $(document).ready(function () {
//     // URL của Web App Apps Script
//     const url = 'https://script.google.com/macros/s/AKfycbzHHbCr2u3notW4UVxUQgy-fdMfhDr0c3rt4r6ecUvT5VzaJ6_VFRO_b0pxO-4frEG0/exec';

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             // data là mảng 2 chiều, mỗi phần tử là { value: ..., link: ... }
//             const rows = data; // Không có data.table.rows vì Apps Script đã custom output

//             // Xóa dữ liệu hiện tại trong bảng
//             $('.table.download-list-table tbody').empty();
//             $('.download-list-mobile').empty();

//             let isFirst = true;

//             // Duyệt qua các dòng theo thứ tự từ cuối lên đầu
//             for (let i = rows.length - 1; i >= 0; i--) {
//                 const row = rows[i];

//                 // Lấy dữ liệu từ các cột (giả sử cột 0: Version, 1: Release Date, 2: Download URL, 3: Release Notes URL, 4: Status)
//                 const version = row[0] ? row[0].value : '';
//                 const releaseDate = row[1] ? extractDate(String(row[1].value)) : '';
//                 // Lấy URL thực nếu có, nếu không có thì lấy giá trị hiển thị
//                 const downloadUrl = row[2] ? (row[2].link ? row[2].link : row[2].value) : '';
//                 const notesUrl = row[3] ? (row[3].link ? row[3].link : row[3].value) : '';
//                 const status = row[4] ? row[4].value.toLowerCase() : '';

//                 // Tạo nút download dựa trên status
//                 let downloadButton;
//                 if (status === 'coming_soon') {
//                     downloadButton = '<p>Coming soon</p>';
//                 } else {
//                     downloadButton = `<a href="${downloadUrl}" class="btn btn-primary btn-sm">Download</a>`;
//                 }

//                 // Gán hành vi cho nút rainbow-button và #home-dload-btn cho phiên bản mới nhất
//                 if (isFirst) {
//                     $('.rainbow-button').click(function () {
//                         window.location.href = downloadUrl;
//                     });
//                     $('#home-dload-btn').click(function () {
//                         window.location.href = downloadUrl;
//                     });
//                     isFirst = false;
//                 }

//                 // Nếu bạn vẫn muốn gán nút download cho #download-button khi i là phần tử cuối (bản mới nhất), bạn có thể:
//                 if (i === rows.length - 1) {
//                     $('#download-button').click(function () {
//                         window.location.href = downloadUrl;
//                     });
//                 }

//                 // Tạo link release notes nếu có
//                 let releaseNotesLink = '';
//                 if (status !== 'coming_soon' && notesUrl) {
//                     releaseNotesLink = `<a href="${notesUrl}">Release Notes</a>`;
//                 }

//                 // Thêm dữ liệu vào bảng desktop
//                 const desktopRow = `
//                     <tr>
//                         <td class="release-ver">${version}</td>
//                         <td class="release-date">${releaseDate}</td>
//                         <td class="release-download">${downloadButton}</td>
//                         <td class="release-note">${releaseNotesLink}</td>
//                     </tr>
//                 `;
//                 $('.table.download-list-table tbody').append(desktopRow);

//                 // Thêm dữ liệu vào danh sách mobile
//                 const mobileItem = `
//                     <div class="version-item">
//                         <h4>${version}</h4>
//                         <div class="version-info">
//                             <p><strong>Release Date:</strong> ${releaseDate}</p>
//                             <div class="mobile-buttons">
//                                 ${downloadButton}
//                                 ${status !== 'coming_soon' && notesUrl ? `<a href="${notesUrl}" class="btn btn-default btn-sm">Release Notes</a>` : ''}
//                             </div>
//                         </div>
//                     </div>
//                 `;
//                 $('.download-list-mobile').append(mobileItem);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching data from Google Sheet:', error);
//             $('#list-version').append(`
//                 <div class="alert alert-danger">
//                     Không thể tải dữ liệu phiên bản. Vui lòng thử lại sau.
//                 </div>
//             `);
//         });
// });

// function extractDate(value) {
//     const arr = value.toString().split('/');
//     var result = "";
//     var monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const day = parseInt(arr[1], 10);
//     const month = monthsName[parseInt(arr[0], 10) - 1]; // Chú ý: chuyển đổi chỉ số tháng (thường bắt đầu từ 0)
//     const year = arr[2];
//     result = month + ", " + day + ", " + year;
//     return result;
// }
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
                const version = row[0] ? row[0].value : '';
                const releaseDate = row[1] ? formatDate(String(row[1].value)) : '';
                const downloadUrl = row[2] ? (row[2].link ? row[2].link : row[2].value) : '';
                const notesUrl = row[3] ? (row[3].link ? row[3].link : row[3].value) : '';
                const status = row[4] ? row[4].value.toLowerCase() : '';

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
