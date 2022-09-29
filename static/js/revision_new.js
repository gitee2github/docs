$(function ($) {
  $(document).ready(function () {
    const lang = location.href.split("/")[3];
    $(
      "#h5-menu .h5-next i,#h5-menu .h5-prev i"
    ).html(`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32">
<title>arrow-right</title>
<path fill="currentColor"  d="M2.667 16.667v-1.333c0-0.368 0.298-0.667 0.667-0.667h21.56l-5.933-5.92c-0.126-0.125-0.197-0.296-0.197-0.473s0.071-0.348 0.197-0.473l0.947-0.933c0.125-0.126 0.296-0.197 0.473-0.197s0.348 0.071 0.473 0.197l8.187 8.173c0.188 0.187 0.293 0.442 0.293 0.707v0.507c-0.003 0.265-0.108 0.518-0.293 0.707l-8.187 8.173c-0.125 0.126-0.296 0.197-0.473 0.197s-0.348-0.071-0.473-0.197l-0.947-0.947c-0.125-0.123-0.196-0.291-0.196-0.467s0.071-0.344 0.196-0.467l5.933-5.92h-21.56c-0.368 0-0.667-0.298-0.667-0.667z"></path>
</svg>
`);
    $(
      ".pc-prev .icon-prev,.pc-next .icon-next"
    ).html(`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32">
<title>arrow-right</title>
<path fill="currentColor"  d="M2.667 16.667v-1.333c0-0.368 0.298-0.667 0.667-0.667h21.56l-5.933-5.92c-0.126-0.125-0.197-0.296-0.197-0.473s0.071-0.348 0.197-0.473l0.947-0.933c0.125-0.126 0.296-0.197 0.473-0.197s0.348 0.071 0.473 0.197l8.187 8.173c0.188 0.187 0.293 0.442 0.293 0.707v0.507c-0.003 0.265-0.108 0.518-0.293 0.707l-8.187 8.173c-0.125 0.126-0.296 0.197-0.473 0.197s-0.348-0.071-0.473-0.197l-0.947-0.947c-0.125-0.123-0.196-0.291-0.196-0.467s0.071-0.344 0.196-0.467l5.933-5.92h-21.56c-0.368 0-0.667-0.298-0.667-0.667z"></path>
</svg>
`);
    //     $(".icon-servision").html(`<?xml version="1.0" encoding="UTF-8"?>
    // <svg width="16px" height="16px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    //     <title></title>
    //     <g id="" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    //         <path d="M19.2124892,8.85857864 C19.4630756,9.10916506 19.4839578,9.50247139 19.2751358,9.77684446 L19.2124892,9.84852814 L12.8485281,16.2124892 C12.4091883,16.651829 11.7139384,16.6792877 11.2426098,16.2948654 L11.1514719,16.2124892 L4.78751083,9.84852814 C4.51414383,9.57516113 4.51414383,9.13194565 4.78751083,8.85857864 C5.03809725,8.60799222 5.43140358,8.58711002 5.70577665,8.79593204 L5.77746033,8.85857864 L12.0003913,15.080727 L18.2225397,8.85857864 C18.4731261,8.60799222 18.8664324,8.58711002 19.1408055,8.79593204 L19.2124892,8.85857864 Z" id="形状结合" fill="#000000" fill-rule="nonzero"></path>
    //     </g>
    // </svg>
    // `);
    // 根据目前语言激活语言切换相应颜色
    $(function ($) {
      if (lang === "zh") {
        $(`a[href='/zh/']`).addClass("active");
      } else if (lang === "en") {
        $(`a[href='/en/']`).addClass("active");
      } else {
        $(`a[href='/ru/']`).addClass("active");
      }
    });
    // 生成当前页的二级目录导航
    $(function ($) {
      let titleList = $("#markdown h2");
      let tocList = "";
      Object.keys(titleList).forEach((key, index) => {
        if (parseInt(key) === key * 1) {
          tocList =
            tocList +
            `<li><a href="#${titleList[index].id}">${titleList[key].textContent}</a></li>`;
        }
      });
      $("#toc-list").append(tocList);
      let targetUrlArr = [];
      let targetUrl = [];
      $(".book-toc #toc-list a[href]").each(function () {
        targetUrlArr.push($($(this).attr("href")));
      });
      targetUrl = targetUrlArr.filter(function (item) {
        return $(window).scrollTop() + 260 > item.offset().top;
      });
      if (targetUrl.length) {
        $(".book-toc #toc-list a[href]").removeClass("active");
        $(
          "a[href='#" + targetUrl[targetUrl.length - 1].attr("id") + "']"
        ).addClass("active");
      } else if ($(".book-toc #toc-list a[href]").length) {
        $(".book-toc #toc-list a[href]").removeClass("active");
        $(".book-toc #toc-list a[href]").eq(0).addClass("active");
      }
    });
    // 根据滚动激活导航状态
    $(window).scroll(function () {
      targetUrlArr = [];
      $(".book-toc #toc-list li a[href]").each(function () {
        targetUrlArr.push($($(this).attr("href")));
      });
      try {
        targetUrl = targetUrlArr.filter(function (item) {
          return $(window).scrollTop() + 60 > item.offset().top;
        });
        if (targetUrl.length) {
          $(".book-toc #toc-list a[href]").removeClass("active");
          $(".book-toc #toc-list a[href]")
            .eq(targetUrl.length - 1)
            .addClass("active");
        }
      } catch (error) {
        console.log(error);
      }
    });
    // 换肤
    (function () {
      const themeStyle = localStorage.getItem("openeuler-theme");
      const _body = $("html");
      if (!themeStyle) {
        $(".theme-change i").removeClass("light dark").addClass("light");
        // $(".title-h2 .icon-help").removeClass("dark");
        $(".nav-menu a .h5-logo").removeClass("dark");
        _body.removeClass("light dark").addClass("light");
        localStorage.getItem("openeuler-theme", "light");
      } else {
        $(".theme-change i").removeClass("light dark").addClass(themeStyle);
        // $(".title-h2 .icon-help").addClass(themeStyle);
        $(".nav-menu a .h5-logo").addClass(themeStyle);
        _body.removeClass("light dark").addClass(themeStyle);
      }
      $(".theme-change i").click(function () {
        if ($(this).hasClass("light")) {
          // $(".title-h2 .icon-help").addClass("dark");
          $(".nav-menu a .h5-logo").addClass("dark");
          $(this).addClass("dark").removeClass("light");
          localStorage.setItem("openeuler-theme", "dark");
          _body.addClass("dark").removeClass("light");
        } else {
          $(".nav-menu a .h5-logo").removeClass("dark");
          // $(".title-h2 .icon-help").removeClass("dark");
          $(this).addClass("light").removeClass("dark");
          localStorage.setItem("openeuler-theme", "light");
          _body.addClass("light").removeClass("dark");
        }
      });
    })();
    // 点击logo回到文档首页
    $("#h5-menu-top .h5-logo .logo-img,.nav-box .h5-logo,.pc-logo").click(
      () => {
        window.open(`/${lang}/`, "_self");
      }
    );
    // 点击logo去到欧拉首页
    // $(".h5_index .h5-logo .logo-img,.h5_index .h5-logo").click(() => {
    //   window.open(`https://www.openeuler.org/${lang}/`, "_self");
    // });
    // 点击版本出现版本选择
    $(".h5_index .h5_nav .icon-servision").click(function () {
      $(this).toggleClass("open");
      $(".h5_index .h5_nav .option").toggleClass("option-show");
    });
    // 控制移动端菜单栏的显示
    $(".h5_index .h5_nav_left").click(function () {
      $(".h5_index .h5_nav").addClass("h5_nav_show");
      $(".zhezhao").css("display", "block");
      $(".zhezhao").css("height", "100vh");
      $(".zhezhao").css("position", "fixed");
    });
    $(".h5_index .icon-close").click(function () {
      $(".h5_index .h5_nav").removeClass("h5_nav_show");
      $(".zhezhao").css("display", "none");
    });
    // 根据语言控制版本选择的显示
    $("#version-select .option a[href^='/ru/']").addClass("option-ru-a");
    $("#h5-menu-top .option").addClass(`option-${lang}`);
    $("#h5-menu-top .option a[href^='/ru/']").addClass("option-ru-a");
    // 让markdown里面的目录隐藏
    $(function ($) {
      $(".markdown ul li>a[href^='#']").parent().hide();
    });
    // 尾部点击跳转
    $(".footer .footer-content .footer-option .footer-option-item a").click(
      function () {
        if ($(this).attr("link") === "service") {
          window.open(`https://status.openeuler.org/`);
        } else {
          window.open(
            `https://www.openeuler.org/${lang}/other/${$(this).attr("link")}/`
          );
        }
      }
    );
    // 首页卡片点击事件
    $("#document_content>div,.h5_content .hot_documentation>div").click(
      function () {
        window.open($(this).attr("href"), "_self");
      }
    );
    // 版本跳转
    $("#version-select .option>span").click(function () {
      window.open($(this).attr("href"), "_self");
    });
  });
});
