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

$(document).ready(function () {
  $('.navbar-nav a[href*="#"]').on('click', function (event) {
    var target = $(this.hash);
    if (target.length) {
      event.preventDefault();

      var headerOffset = -50;
      var targetOffset = target.offset().top - headerOffset;

      $('html, body').animate(
        {
          scrollTop: targetOffset
        },
        100
      );
    }
  });
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

document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("imagePreviewModal");
  if (modal) {
    modal.classList.add("hidden");
  }
});

function openImagePreview(img) {
  var modal = document.getElementById("imagePreviewModal");
  var modalImg = document.getElementById("imagePreview");
  var captionText = document.getElementById("imageCaption");

  modal.classList.remove("hidden");
  modalImg.src = img.src;
  captionText.innerHTML = img.alt;
}

function closeImagePreview() {
  var modal = document.getElementById("imagePreviewModal");
  modal.classList.add("hidden");
}
