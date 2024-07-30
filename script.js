document.addEventListener("DOMContentLoaded", function () {
  var myButton = document.getElementById("myBtn");

  if (myButton) {
    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 1000 ||
        document.documentElement.scrollTop > 1000
      ) {
        myButton.style.display = "block";
      } else {
        myButton.style.display = "none";
      }
    }

    function topFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    myButton.addEventListener("click", topFunction);
  }
});

$('a[href*="#"]')
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function (event) {
    var target = $(this.hash);
    target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
    if (target.length) {
      event.preventDefault();
      $("html, body").animate(
        {
          scrollTop: target.offset().top,
        },
        1000,
        function () {
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) {
            return false;
          } else {
            $target.attr("tabindex", "-1");
            $target.focus();
          }
        }
      );
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("pdfModal");
  var btn = document.getElementById("openModal");
  var span = document.getElementsByClassName("close")[0];

  btn.onclick = function () {
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
