window.jQuery = $ = require('jquery');
var $ = require('jquery');
var _ = require('underscore');
// Required these in by default, feel free to add more.

$(function(){
  var blogPosts = '';
  $.get('https://mediumblog.herokuapp.com/').done(function(data) {
  
   

    var posts = [];
    $.each(data.payload.references.Post, function(index, item) {
      posts.push(item);
    })
    posts = _.sortBy(data.payload.references.Post, function(obj) {
      return obj.firstPublishedAt;
    }).reverse();

    for (var i = 0; i < 5; i++) {
      console.log(posts[i]);
      var description = posts[i].content.metaDescription
        ? posts[i].content.metaDescription
        : '';
        blogPosts += '<a href="https://medium.com/@graysonhicks/' + posts[i].uniqueSlug + '" class="blog-posts"><div class="row"><div class="col-md-3 blog-thumbnail-container"><img src="https://cdn-images-1.medium.com/max/1000/' + posts[i].virtuals.previewImage.imageId + '" class="blog-thumbnail img-responsive"/></div><div class="col-md-9"><div class="blog-info-container"><div class="blog-titles heading">' + posts[i].title + '</div><div class="blog-subtitles">' + posts[i].content.subtitle + '</div><div class="blog-descriptions">' + description + '</div></div></div></div></a>';
    }
    
  }).fail(function(err) {
    $('#blog-content').empty();
    console.log(err);
    $('#blog-content').html('<div class="row error"><div class="col-xs-12"><div class="blog-titles heading text-center">Sorry! There was an error loading the blog posts from <a href="https://Medium.com">Medium.com</a>!<div class="blog-descriptions">Please visit <a href="https://medium.com/@graysonhicks">https://medium.com/@graysonhicks</a> to give them a read.</div></div></div></div>');


  });
  
  $('#blog-link').click(function() {

    if (!$('#blog-content').is(':visible')) {
      if($('#blog-content').hasClass('shown')){
        $('#main-content').hide();
        $('#blog-content').show();
        return;
      } else {
        $('#main-content').hide();
        $('#blog-content').show().addClass('shown');;
        setTimeout(function(){
          $('#loading-spinner').hide();
          $('#blog-content').append(blogPosts);
          $('#blog-content').append('<a href="https://medium.com/@graysonhicks/" class="blog-posts text-center see-all"><div class="heading">See more...</div></a>');
        }, 1000);
      }
 
    }
  });
  
  $('#home-link').click(function() {
  console.log('click');
    if (!$('#main-content').is(':visible')) {
      $('#blog-content').hide();
      $('#main-content').show();
    }
  });
  
  for (var i = 0; i < $('.year-container').length; i++) {
    var today = new Date()
    var year = today.getFullYear()
    $('.year-container')[i].innerHTML = year;
  }
  
  $('.project-item').mouseenter(function(e) {
  
    var item = $(e.currentTarget);
  
    item.find(".project-image").removeClass('slide-right').addClass("slide");
  
  });
  
  $('.project-item').mouseleave(function(e) {
  
    var item = $(e.currentTarget);
  
    item.find(".project-image").removeClass('slide').addClass("slide-right");
  
  });
  
  $('.night-mode').click(function(e) {
    $('#night-mode-stylesheet').attr('href', 'styles/nightmode.css');
    $('.night-mode').hide();
    $('.day-mode').show();
  });
  
  $('.day-mode').click(function(e) {
    $('#night-mode-stylesheet').attr('href', 'styles/app.css');
    $('.night-mode').show();
    $('.day-mode').hide();
  });
  
})();
