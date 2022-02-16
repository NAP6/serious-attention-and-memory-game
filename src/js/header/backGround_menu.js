/*
 * scrooll_from_top
 *
 * Args:
 *
 * This function is the distance that has been scrolled 
 * from the beginning of the page.
 */
function scroll_from_top() {
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    return scrollTop;
}

/*
 * Toggle '.header-scrolled' class to #header when page is scrolled
 */
if (document.getElementById("header")) {
    window.onscroll = (event) => {
        var header = document.getElementById("header");
        var scrollTop = scroll_from_top()
        if (scrollTop > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
}
