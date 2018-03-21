window.jQuery = $ = require('jquery');
var $ = require('jquery');
var _ = require('underscore');
// Required these in by default, feel free to add more.

(function(){
  // init function
  var blogPosts = '';
  setYear();
  getBlogPosts();

  //
  // EVENTS
  //
  $('#blog-link').on("click", blogClick);
  $('#home-link').on("click", homeClick);
  $('.project-item').on("mouseenter", itemEnter);
  $('.project-item').on("mouseleave", itemLeave);
  $('.night-mode').on("click", startNightMode);
  $('.day-mode').on("click", endNightMode);

  //
  // FUNCTIONS
  //
    //
    // BLOG FUNCTIONS
    //
    function getBlogPosts(){
      //fetch
      $.get('https://mediumblog.herokuapp.com/').done(function(data) {
        // build array
        var posts = [];
        $.each(data.payload.references.Post, function(index, item) {
          posts.push(item);
        })
        // sort array
        posts = _.sortBy(data.payload.references.Post, function(obj) {
          return obj.firstPublishedAt;
        }).reverse();

        // concat html and store in global
        for (var i = 0; i < 5; i++) {
          var description = posts[i].content.metaDescription
            ? posts[i].content.metaDescription
            : '';
            blogPosts += '<a href="https://medium.com/@graysonhicks/' + posts[i].uniqueSlug + '" class="blog-posts"><div class="row"><div class="col-md-3 blog-thumbnail-container"><img src="https://cdn-images-1.medium.com/max/1000/' + posts[i].virtuals.previewImage.imageId + '" class="blog-thumbnail img-responsive"/></div><div class="col-md-9"><div class="blog-info-container"><div class="blog-titles heading">' + posts[i].title + '</div><div class="blog-subtitles">' + posts[i].content.subtitle + '</div><div class="blog-descriptions">' + description + '</div></div></div></div></a>';
        }
        
      }).fail(function(err) {
        $('#blog-content').empty();
        $('#blog-content').html('<div class="row error"><div class="col-xs-12"><div class="blog-titles heading text-center">Sorry! There was an error loading the blog posts from <a href="https://Medium.com">Medium.com</a>!<div class="blog-descriptions">Please visit <a href="https://medium.com/@graysonhicks">https://medium.com/@graysonhicks</a> to give them a read.</div></div></div></div>');
      });
    }

    function blogClick(){
        // if blog content not already visible, proceed
        if (!$('#blog-content').is(':visible')) {
          hideHomeShowBlog();
          // if its already been shown, just hide and show without loading/appending again
          if($('#blog-content').hasClass('shown')){
            return;
          } else {
            // if first show, hide main, show blog, and add flag class
            $('#blog-content').addClass('shown');
            // then set timeout so loader shows, then append html that was build on page load
            setTimeout(function(){
            loadBlogPage();
            }, 1000);
          }
    
        }
    }

    function loadBlogPage(){
      $('#loading-spinner').hide();
      $('#blog-content').append(blogPosts);
      // append see more link
      $('#blog-content').append('<a href="https://medium.com/@graysonhicks/" class="blog-posts text-center see-all"><div class="heading">See more...</div></a>');
    }

    //
    // HOME FUNCTIONS
    //

    function homeClick(){
      if (!$('#main-content').is(':visible')) {
        hideBlogShowMain();
      }
    }

    function itemEnter(e){
      $(e.currentTarget).find(".project-image").removeClass('slide-right').addClass("slide");
    }

    function itemLeave(e){
      $(e.currentTarget).find(".project-image").removeClass('slide').addClass("slide-right");
    }

    //
    // MISC FUNCTIONS
    //
    function hideHomeShowBlog(){
      $('#main-content').hide();
      $('#blog-content').show();
    }

    function hideBlogShowMain(){
      $('#blog-content').hide();
      $('#main-content').show();
    }

    function setYear(){
      for (var i = 0; i < $('.year-container').length; i++) {
        var today = new Date()
        var year = today.getFullYear()
        $('.year-container')[i].innerHTML = year;
      }
    }

    function startNightMode(){
      $('#night-mode-stylesheet').attr('href', 'styles/nightmode.css');
      $('.night-mode').hide();
      $('.day-mode').show();
    }

    function endNightMode(){
      $('#night-mode-stylesheet').attr('href', 'styles/app.css');
      $('.night-mode').show();
      $('.day-mode').hide();
    }
  
})();
