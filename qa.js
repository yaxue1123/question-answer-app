var root_url = "http://comp426.cs.unc.edu:3002/api/";

$(document).ready(() => {
    // ################### Log in #############################
    $('body').on('click', '#login_btn, #home', function() {
	
	let user = $('#login_user').val();
	let pass = $('#login_pass').val();
	
	$.ajax(root_url + 'login',
	       {
                type: 'GET',
                xhrFields: {withCredentials: true},
                data: {
                    username: user,
                    password: pass
                },
                success: (response) => {
                    if (response.status) {
                    build_question_interface("all", "render");
                    } else {
                    $(this).append("Login failed. Try again.");
                    }
                },
                error: () => {
                    alert('error');
                }
	       });
    });

    // ################### from logout to log in #############################
    $('body').on('click', '#logout', function(){
        build_login_interface();
    })

    // ################### Log out #############################
    $('body').on('click', '#logout', function(){
        console.log("hahaha");
        $.ajax(root_url + 'logout',
	       {
                type: 'GET',
                xhrFields: {withCredentials: true},
                data: {
                },
                success: (response) => {
                    if (response.status) {
                    build_logout_interface();
                    } else {
                    $('#mesg_div').html("Login failed. Try again.");
                    }
                },
                error: () => {
                    alert('error');
                }
	       });
    })

    // Use delegate for dynamic binding.
    // ############## Submit unanswered question answer##########
    $('body').on('click', '.submit', function(){
        let questionId = $(this).attr('qid');
        let answerText = $('#input_' + questionId).val();

        $.ajax(root_url + 'answers/' + questionId + '?answer=' + answerText,
            {
                type: 'PUT',
                xhrFields: {withCredentials: true},
                data: {
                   // answer: answerText
                   // api design issue. Use param in URL instead.
                },
                success: (response) => {
                    if (response.status) {
                        build_question_interface(questionId, "submit");
                    } else {
                        $(this).append("Submit failed. Try again.");
                    }
                },
                error: () => {
                    alert('Cannot submit null answer!');
                }
            });
    })

    // #################### Delete answer ########################
    $('body').on('click', '.delete', function() {
        let questionId = $(this).attr('qid');
        $.ajax(root_url + 'answers/' + questionId,
        {
            type: 'DELETE',
            xhrFields: {withCredentials: true},
            data: {

            },
            success: (response) => {
                if (response.status) {
                    build_question_interface(questionId, "delete");
                } else {
                    $(this).append("Delete failed. Try again.");
                }
            },
            error: () => {
                alert('error');
            }
        });
    })

    // ################## Edit answer ############################
    $('body').on('click', '.edit', function() {
        let questionId = $(this).attr('qid');
        let answerText = $('#input_' + questionId).val();

        $.ajax(root_url + 'answers/' + questionId + '?answer=' + answerText,
        {
            type: 'POST',
            xhrFields: {withCredentials: true},
            data: {

            },
            success: (response) => {
                if (response.status) {
                    build_question_interface(questionId, "edit");
                } else {
                    $(this).append("Delete failed. Try again.");
                }
            },
            error: () => {
                alert('error');
            }
        });
    })

    // ##################### Review mode #############################
    $('body').on('click', '#review', function(){    
        // Fetch question and answer pair from API.
        build_review_interface("new");
    })

    $('body').on('click', '.review-answer', function(){    
        // Fetch question and answer pair from API.
        build_review_interface("update");
    })
});

// ##################################################################################
// ###################### Build login interface ####################################
var build_login_interface = function() {
    let body = $('body');
        
    body.empty();

    body.append('<section class="login-section"><h1>COMP426 A4 Q&A APP by Yaxue</h1>' + 
    '<div id="login_div"><input type="text" id="login_user"><br>' + 
    'Password: <input type="text" id="login_pass"><br>' +
    '<button id="login_btn">Login</button></div id="mesg_div"><div></div></section>');

}

// ##################################################################################
// ###################### Build logout interface ####################################
var build_logout_interface = function() {
      let body = $('body');
        
      body.empty();

      // Add navigation.
      body.append('<nav><a id="login">Login</a></nav>');

      // Add logout success message.
      body.append('<section><a>You have logged out.</a></section>');
}

// ##################################################################################
// ###################### Build review interface ####################################
var build_review_interface = function(operation) {
    if (operation === "new") {
        // build review interface.
        let body = $('body');
        
        body.empty();

        // Add navigation.
        body.append('<nav><a id="home">Home</a><a id = "review">Review</a><a id="logout">Logout</a></nav>');

        // Add header and review field section.
        body.append("<section class='header-section'>" + 
            "<div class='container header-container'><h1>Review Mode</h1></div>" + 
            "<p>Choose the answer that looks better. If the answer's are similar, choose the 'equal' option.</p></section>" +
            "<section class='review-section'></section>");
    } else {
        // only empty the section.
        $('.review-section').empty();
    }

     // Add field div for question and answer pair.
     let rlist = $('<div class="container review-containter"></div>');

     $('.review-section').append(rlist);

     $.ajax(root_url + 'review',
     {
         type: 'GET',
         xhrFields: {withCredentials: true},
         data: {

         },
         success: (response) => {
             let rdata = response.data;
             if (response.status) {
                 // Add question.
                 rlist.append('<p class = "review-question">' + rdata.question.question_title + '</p>');
                 // Add answer pair.
                 rlist.append('<p class="review-answer">Answer1: ' + rdata.answer1.text + '</p>');
                 rlist.append('<button class="review-answer">equals</button>');
                 rlist.append('<p class="review-answer">Answer2: ' + rdata.answer2.text + '</p>');
             } else {
                 rlist.append("Get review pair failed. Try again.");
             }
         },
         error: () => {
             alert('error');
         }
     });
}

// ###################### Build or update question interface ########################
var build_question_interface = function (id, operation) {

    let body = $('body');

    // update whole page.
    if (id === "all") {
        body.empty();

        // Add navigation.
        body.append('<nav><a id="home">Home</a><a id = "review">Review</a><a id="logout">Logout</a></nav>');
    
        // Add header.
        body.append('<section class="header-section">' + 
            '<div class="container header-container"><h1>Questions and Answers</h1></div></section>');
        
        // Add main body of questions and answers.
        // Add control buttons and search function.
        // TO DO.
    
        // Add questions and answers.
        body.append('<section class="questions-section"></section>');

        let qlist = $('<div class="container questions-container"></div>');

        $(".questions-section").append(qlist);

        $.ajax(root_url + "questions",
        {
            type: 'GET',
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
            let qarray = response.data;
            for (let i=0; i<qarray.length; i++) {
                let qdiv = create_question_div(qarray[i]);
                qlist.append(qdiv);
                let qid = qarray[i].id;
                $.ajax(root_url + 'answers/' + qid,
                   {
                   type: 'GET',
                   dataType: 'json',
                   xhrFields: {withCredentials: true},
                   success: (response) => {
                       // Bases on has answer or not.
                       if (response.data != null) {
                            let answer = response.data;
                            qdiv.append('<input type="text" value="' + answer.answer_text + '" id="input_' + qid + '">');
                            qdiv.append('<button class = "delete" qid="' + qid + '">Delete</button>');
                            qdiv.append('<button class = "edit" qid="' + qid + '">Edit</button>');
                            qdiv.addClass('answered');
                       } else {
                            qdiv.append('<input id="input_' + qid +'">');
                            qdiv.append('<button class="submit" qid="' + qid + '">Submit</button>');
                       }
                   }
                   }); 
            }
            }
        });
    } else {
        // only update the single changed question field.
        // remove old input and button, add updated one, update answer count.
        $.ajax(root_url + "questions",
        {
            type: 'GET',
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                let qdiv = $('#qid_' + id);

                $.ajax(root_url + 'answers/' + id,
                    {
                    type: 'GET',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    success: (response) => {
                        let answer = response.data;
                        // update answer count.
                        let answerCount = parseInt(qdiv.children(".count").text().replace("Answer count: ", ""));
                        if (operation === "submit") {
                            answerCount += 1;
                        } else if (operation === "delete") {
                            answerCount -= 1;
                        }

                        // Answer count.
                        qdiv.children(".count").remove();
                        qdiv.append('<div class="count">Answer count: ' + answerCount + '</div>');

                        // Input.
                        qdiv.children("input").remove();
                        if (answer !== null) {
                            qdiv.append('<input type="text" value="' + answer.answer_text + '" id="input_' + id + '">');
                        } else {
                            qdiv.append('<input type="text" value="" id="input_' + id + '">');
                        }

                        // Button.
                        qdiv.children("button").remove();
                        if (operation === "submit" || operation === "edit") {
                            // add "delete" and "edit".
                            qdiv.append('<button class = "delete" qid="' + id + '">Delete</button>');
                            qdiv.append('<button class = "edit" qid="' + id + '">Edit</button>');
                            // Change background color.
                            qdiv.css('background-color', '#cdd422');
                        } else if (operation === "delete") {
                            // add "submit".
                            qdiv.append('<button class="submit" qid="' + id + '">Submit</button>');
                            qdiv.css('background-color', '');
                        } 
                        
                    }
                    }); 
            
            }
        });
    }

    let create_question_div = (question) => {
        let qdiv = $('<div class="question" id="qid_' + question.id + '"></div>');
        qdiv.append('<div class="question-header">' + question.title + '</div>');
        qdiv.append('<div class="count">Answer count: ' + question.answerCount + '</div>');
        return qdiv;
    }
};