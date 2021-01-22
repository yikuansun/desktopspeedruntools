smoothscroll = {
    scrollTopAmnt: function(element, amount) {
        element.scrollTop++;
        if (amount > 0) {
            requestAnimationFrame(function() { smoothscroll.scrollTopAmnt(element, amount - 1); });
        }
    }
};