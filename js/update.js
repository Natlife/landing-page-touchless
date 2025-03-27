$(document).ready(function () {
    // using google with json data

    const ggSheetID = '1xgZgnCxhN0gkZTu9COIaiY5lygCfqMxGWN02rT1KVCg';
    const url = `https://docs.google.com/spreadsheets/d/${ggSheetID}/gviz/tq?tqx=out:json`;

    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            const rows = jsonData.table.rows;


            // Group data according to the Title
            const groupedData = {};

            
            // Take tile, description and img from gg sheet
            rows.slice(1).forEach(row => {
                const title = row.c[0]?.v || '';
                const point = row.c[1]?.v || '';
                const img = row.c[2]?.v || '';

        
                if (!groupedData[title]) {
                    groupedData[title] = { points: [], img };
                }

                groupedData[title].points.push(point);
            });

            // Display grouped data (description)
            Object.entries(groupedData).forEach(([title, data], index) => {
                const htmlText = `
                    <h3>${title}</h3>
                    ${data.points.map(p => `- ${p}<br>`).join('')}
                    <br>
                `;

            // Update text
                $('#updates-text').append(htmlText);

            
            // Update img to carousel
                const htmlImg = `
                    <div class="item${index === 0 ? ' active' : ''}">
                        <img src="${data.img}" alt="update-img-${index}">
                    </div>
                `;
                $('#carousel-inner').append(htmlImg);
            });
        });
});
