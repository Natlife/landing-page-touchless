$(document).ready(function(){
    // using gg sheet with json data

    const ggSheetID = '1he_EsV7EVHyXwHK1zmtZOxQcfbLVUDE09DJRE8wmIbk'; 
    const url = `https://docs.google.com/spreadsheets/d/${ggSheetID}/gviz/tq?tqx=out:json`;

    fetch(url)
        .then(response => response.text())
        .then(data => {
            const jsonData = JSON.parse(data.substring(47).slice(0, -2)); 
            const rows = jsonData.table.rows;

            // link title with content
            rows.forEach((row, index) => {
                const title = row.c[0] ? row.c[0].v : ''; 
                const content = row.c[1] ? row.c[1].v : '';
                // adding with id
                const titleElement = $('<div class="title" id="title' + (index + 1) + '">' + title + '</div>');
                const contentElement = $('<div class="content" id="content' + (index + 1) + '" style="display:none;">' + content + '</div>');
                $('.docs-left').append(titleElement);
                $('.content-page').append(contentElement);
            });
            //click to title event
            // $(".title").click(function(){
            //     // Lấy ID titel
            //     var titleId = $(this).attr("id");
            //     var contentId = "content" + titleId.charAt(titleId.length - 1);
            //     // lấy id content ứng title
            //     var content = $("#" + contentId);
            //     if (content.is(":visible")) {
            //         content.slideUp();
            //     } else {
            //         content.slideDown();
            //     }
            // });

            // title duoc click se ve trang thai readonly
            // khi an vao title nao do se tat content hien tai roi moi goi content moi
            $(".title").click(function(){
                var titleId = $(this).attr("id");
                var contentId = "content" + titleId.charAt(titleId.length - 1);
                var content = $("#" + contentId);
                var right= $(".docs-right");
                if ($(this).hasClass('disabled')) {
                    return; 
                }
                $(".title").removeClass('disabled').css('pointer-events', 'auto').css('background-color','white');
                $(this).addClass('disabled');

                $(".content").slideUp(); 
                content.slideDown();
                if (right.scrollTop() > 0) {
                    right.animate({ scrollTop: 0 }, 500); 
                }
            });

            // $(".title").click(function() {
            //     var titleId = $(this).attr("id");
            //     var contentId = "content" + titleId.charAt(titleId.length - 1);
            //     var content = $("#" + contentId);
        
            //     if ($(this).hasClass('disabled')) {
            //         return; 
            //     }
        
            //     $(".title").removeClass('disabled').css('pointer-events', 'auto').css('background-color', 'white');
            //     $(this).addClass('disabled');
        
            //     $(".content").slideUp(); 
            //     content.slideDown();
        
            //     var docsLeft = $(".docs-left");
            //     var contentHeight = $(".content-page").outerHeight();
        
            //     // docs-left height update
            //     if (contentHeight > docsLeft.outerHeight()) {
            //         docsLeft.height(contentHeight);
            //     } else {
            //         docsLeft.height('500px'); 
            //     }
            // });
        });

    });
