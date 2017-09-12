window.jQuery = $ = require('jquery');
var $ = require('jquery');
var _ = require('underscore');
// Required these in by default, feel free to add more.

$('#blog-link').click(function() {

  if (!$('#blog-content').is(':visible')) {
    $('#main-content').hide();
    $('#blog-content').show();



    $.get('https://mediumblog.herokuapp.com/').done(function(data) {

      $('#loading-spinner').hide();

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
        $('#blog-content').append('<a href="https://medium.com/@graysonhicks/' + posts[i].uniqueSlug + '" class="blog-posts"><img src="https://cdn-images-1.medium.com/max/1000/' + posts[i].virtuals.previewImage.imageId + '" class="blog-thumbnail"/><div class="blog-info-container"><div class="blog-titles heading">' + posts[i].title + '</div><div class="blog-subtitles">' + posts[i].content.subtitle + '</div><div class="blog-descriptions">' + description + '</div></div></a>');
      }

      $('#blog-content').append('<a href="https://medium.com/@graysonhicks/" class="blog-posts text-center see-all"><div class="heading">See more...</div></a>')

    }).fail(function(err) {
      console.log(err);

    });
  }
})

for (var i = 0; i < $('.year-container').length; i++) {
  var today = new Date()
  var year = today.getFullYear()
  $('.year-container')[i].innerHTML = year;
}

$('.project-item').mouseenter(function(e) {

  var item = $(e.currentTarget);

  item.find(".project-image").removeClass('slide-right').addClass("slide");

})

$('.project-item').mouseleave(function(e) {

  var item = $(e.currentTarget);

  item.find(".project-image").removeClass('slide').addClass("slide-right");

});

$('.night-mode').click(function(e) {
  $('#night-mode-stylesheet').attr('href', 'styles/nightmode.css');
  $('.night-mode').hide();
  $('.day-mode').show();
})

$('.day-mode').click(function(e) {
  $('#night-mode-stylesheet').attr('href', 'styles/app.css');
  $('.night-mode').show();
  $('.day-mode').hide();
})
