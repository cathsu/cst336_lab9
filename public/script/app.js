$("a").on("click", function() {
  
    console.log("inside a");
    var id = $(this).attr("id");
    $.ajax({
        method: "GET",
        url: "/author/" + id,
        contentType: "application/json",
        data: { "id": id},
        success: function(result,status) {
            var author = result[0];
            var bio = $("#bio");
            $("#authorTitle").html('<h3>' + author.firstName + ' ' +  author.lastName + '</h3>');
            bio.html(`
                    <div class="container">
                        <div class="row">
                            <div class="col-sm">
                                <img class="portrait" src= \'` + author.portrait +  `'\'> 
                            </div>
                            <div class="col-sm">
                                <div>Birth: ` +  author.dob.slice(0,10) + `</div>
                                <div>Death: ` +  author.dod.slice(0,10) + `</div>
                                <div>Sex: ` +  author.sex + `</div>
                                <div>Profession: ` +  author.profession + `</div>
                                <div>Country: ` + author.country + `</div>
                            </div>
                        </div>
                        <div class=\'bio\'>Biography: ` +  author.biography + `</div>
                    </div>
                    `); 
        }, 
        error: function(error, status) {
            console.log("ERROR");
            console.log(error);    
        }
    });//ajax
 
}); 

    