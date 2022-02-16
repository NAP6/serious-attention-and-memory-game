import { AdministratorController } from '../controller/AdministratorController.js';

(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
        $(".sidebar").toggleClass('toggled');
    }


    // Active actual position on sidebar
    var link = `a[href='${window.location.pathname}']`;

    var a = document.querySelector(`.collapse-inner>${link}, .nav-item>${link}`);
    if(a) {
        var parent_a = a.parentNode;

        if (Object.values(parent_a.classList).indexOf("nav-item") != -1) {
          parent_a.classList.add("active");
        } else {
          var container_div = parent_a.parentNode;
          var nav_item = container_div.parentNode;
          nav_item.classList.add("active");
          a.classList.add("active");
          nav_item.querySelector('a.nav-link').click();
        }
    }
    
    var admin = AdministratorController.get_active_adminitrator();
    $('#admin_profile_name').text(admin.name);
    if(admin.image)
        $('#admin_profile_image').attr("src", admin.image);


})(jQuery); // End of use strict
