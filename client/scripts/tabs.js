var currentTab = 0;

var switchTab = function(v)
{
    var tab = [];
    tab[1] = document.getElementById("tabChat");
    tab[2] = document.getElementById("tabSettings");

    if(currentTab == v)
    {
        tab[v].classList.add("tab-contract");
        tab[v].style.zIndex = 2;
        v = 0;
        document.activeElement.blur();
    }
    else
    {
        if(currentTab != 0)
        {
            tab[currentTab].classList.add("tab-contract");
            tab[currentTab].style.zIndex = 2;
        }
        tab[v].classList.remove("tab-contract");
        tab[v].style.zIndex = 1;

        switch(v)
        {
            case 1:
                var wrap = document.getElementById("messagesWrap");
                wrap.scrollTop = wrap.scrollHeight - wrap.clientHeight;
                break;
        }
    }

    currentTab = v;
}