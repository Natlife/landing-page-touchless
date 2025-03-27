$(document).ready(function () {

    // using google sheet with json data

    const ggSheetID = '1xgZgnCxhN0gkZTu9COIaiY5lygCfqMxGWN02rT1KVCg';
    const url = `https://docs.google.com/spreadsheets/d/${ggSheetID}/gviz/tq?tqx=out:json`;

    fetch(url)
        .then(res => res.text())
        .then(rep => {
            // Bat dau xu li du lieu sau khi co noi dung tu response
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            const rows = jsonData.table.rows;

            // Lay title, description and img
            rows.forEach((row, index) => {
                const title = row.c[0]?.v || '';
                const desc = row.c[1]?.v || '';
                const img = row.c[2]?.v || '';

               
                const htmlText = `
                    <h3>${title}</h3>
                    - ${desc}<br><br>
                `;

                //update text
                $('#updates-text').append(htmlText);

                // update img to carousel
                const htmlImg = `
                    <div class="item${index === 0 ? ' active' : ''}">
                        <img src="${img}" alt="update-img-${index}">
                    </div>
                `;
                $('#carousel-inner').append(htmlImg);
            });
        });
});
