$(function ($) {
  if (lang == "ru") {
    $("#title-evaluate").css("display", "none");
  }
  var isEvaluate = false;
  var urlArr = window.location.pathname.split("/");
  var isAdd1 = $("#markdown>ul").first().find("li").children().is("ul");
  var isAdd4 = $("#markdown>ul").first().find("li").children().is("p");
  var isAdd2 = $("#markdown>ul").first().find("li").children().is("a");
  var isAdd3 = $("#markdown>.table-of-contents").first().find("ul");
  var evaluateParams = {
    name: "",
    path: "",
    lang: "",
    version: "",
    stars: 0,
  };
  evaluateParams.lang = lang;
  var versionStr = urlArr[3].split("_");
  versionStr = versionStr.join(" ");
  var sourceLast = urlArr[6].replace("html", "md");
  var sourceHref =
    "https://gitee.com/openeuler/docs/tree/stable2-" +
    urlArr[3] +
    "/docs/" +
    lang +
    "/docs/" +
    urlArr[5] +
    "/" +
    sourceLast;
  $("#source").attr("href", sourceHref);
  $("#version-select .option span,#h5-menu-top .option a").each(function () {
    if ($(this).html() === versionStr) {
      $(this).addClass("active");
    }
  });
  if (evaluateParams.lang === "en") {
    $("#version-select>span,#h5-menu .h5-sersion").text(
      "Version: " + versionStr
    );
  } else if (evaluateParams.lang === "zh") {
    $("#version-select>span,#h5-menu .h5-sersion").text("版本: " + versionStr);
  } else {
    $("#version-select>span,#h5-menu .h5-sersion").text(
      "version: " + versionStr
    );
  }

  // $("#h5-menu-top .select-box").find("span").text(versionStr);
  if (location.href.includes("/ru/")) {
    $("#version-select .option").addClass("option-ru");
  }
  $("#version-select").click(function (e) {
    $(this).children(".option").toggleClass("option-active");
    $(this).children(".option-ru").toggleClass("option-ru-active");
    $(this).toggleClass("open-option");
    $(document).one("click", function () {
      $("#version-select .option").removeClass("option-active");
      $("#version-select .option-ru").toggleClass("option-ru-active");
    });
    e.stopPropagation();
  });
  $(".h5_nav_left").click(function (e) {
    $("#app>.left").addClass("show-left");
    $(".h5-mask").show();
    // $("#content .docscontainer").css("height", "0");
    // $("#page").hide();
  });

  // $("#h5-menu .h5-menu").click(function (e) {
  //     $("#menu-box").show();
  //     $("#content .docscontainer").css("height", "0");
  //     $("#page").hide();
  // });
  $("#h5-menu-top .icon-close,.h5-mask").click(function (e) {
    $("#app>.left").removeClass("show-left");
    $(".h5-mask").hide();
    // $("#content .docscontainer").css("height", "auto");
    // $("#page").show();
  });
  $("#h5-menu-top .h5-search")
    .find(".search-btn")
    .click(function (e) {
      keyword = $("#h5-menu-top .h5-search").find("input").val();
      window.location.href = "/" + lang + "/search.html?keyword=" + keyword;
    });
  $("#h5-menu-top .select-box").click(function (e) {
    $("#h5-menu-top .menu-select-box .option").toggleClass("option-show");
    $(".icon-servision").toggleClass("icon-open");
    e.stopPropagation();
  });
  if (isAdd1 && isAdd2 && !isAdd4) {
    let linkEle = $("#markdown>ul").first().clone();
    $("#title-evaluate>.title").append(linkEle);
  } else if (isAdd3) {
    $("#title-evaluate>.title").append(isAdd3);
  }
  $("#title-evaluate>.title")
    .find("li")
    .find("a")
    .click(function (e) {
      $("#title-evaluate>.title").find("li").find("a").removeClass("active");
      $(this).addClass("active");
    });
  $("#title-evaluate .evaluate")
    .find("i")
    .click(function (e) {
      if (isEvaluate) {
        return false;
      } else {
        let arr = urlArr[6].split(".");
        let number = $(this).attr("key");
        evaluateParams.name = decodeURI(arr[0]);
        evaluateParams.path = urlArr[4] + "/" + urlArr[5] + "/" + urlArr[6];
        evaluateParams.version = urlArr[3];
        evaluateParams.stars = number;
        $.ajax({
          type: "POST",
          url: "/docs-search/docs/reviews",
          data: JSON.stringify(evaluateParams),
          contentType: "application/json; charset=utf-8",
          datatype: "json",
          headers: {
            Authorization:
              "Basic b3BlbmV1bGVyc2VydmVyOm9wZW5ldWxlcnNlcnZlckAxMjM0",
          },
          success: function (data) {
            $("#title-evaluate .evaluate")
              .find("i")
              .slice(0, number)
              .addClass("active");
            isEvaluate = true;
          },
          error: function (data) {
            console.error(data);
          },
        });
      }
    })
    .mouseover(function () {
      $(this).find("div").show();
    })
    .mouseleave(function () {
      $("#title-evaluate .evaluate").find("i").find("div").hide();
    });
  $(".question").click(function (e) {
    if ($(".alert").css("display") === "none") {
      e.stopPropagation();
      $(".alert").slideToggle(500);
      $(".baseof_mask").css("display", "block");
    } else {
      $(".alert").slideToggle(500);
      $(".baseof_mask").css("display", "none");
    }
  });
  $(".alert .icon-close").on("click", function (e) {
    e.stopPropagation();
    $(".question").click();
    $(".baseof_mask").css("display", "none");
  });
  $(".btn-submit>span").hover(
    function () {
      let submitType = $(".submit-type .active-submit").attr("attr_type");
      if (submitType === "issue") {
        $(".issue-submit-tip").addClass("tip-show");
      } else if (submitType === "PR") {
        $(".pr-submit-tip").addClass("tip-show");
      }
    },
    function () {
      $(".issue-submit-tip").removeClass("tip-show");
      $(".pr-submit-tip").removeClass("tip-show");
    }
  );
  $(".btn-submit>span").on("click", function () {
    let questionValue = $(".main-input").val().trim();
    const regR = /[\r\n]+/g;
    let submitType = $(".submit-type .active-submit").attr("attr_type");
    let feedback = $(".issue-reason").val().trim();
    let checkedArr = [];
    const first = questionValue.split(regR)[0];
    $(".alert .active-border span").each(function (index) {
      checkedArr.push($(".alert .active-border span")[index].innerHTML);
    });
    let satisfaction = $(".satisfaction .active");
    // 获取要提交的文件的路径
    const urlArr = location.href.split("/");
    const title = urlArr[urlArr.length - 1].replace(".html", "");
    const version = urlArr[urlArr.length - 4];
    const path =
      urlArr[urlArr.length - 2] +
      "/" +
      urlArr[urlArr.length - 1].replace("html", "md");
    // let joinReason = $(".checkbox-list input[type='radio']:checked");
    // let joinReason = $(".checkbox-list input[type='radio']:checked");
    let email = $(".email-input").val().trim();
    let reg = new RegExp(
      "^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"
    );
    let privacy = $(".privacy-box input[type='radio']:checked");
    let tipText = "";
    if (!questionValue) {
      $(".first-input").focus();
      tipText = lang == "zh" ? "请输入“有虫”片段" : "Enter the buggy content";
      tipShow(tipText, 0);
    } else if (!feedback || !submitType) {
      $(".issue-reason").focus();
      tipText =
        lang == "zh"
          ? "请选择提交类型并输入问题描述"
          : "Choose a submission type and describe the bug";
      tipShow(tipText, 1);
    } else if (!email) {
      tipText = lang == "zh" ? "请输入您的邮箱" : "Enter your email";
      tipShow(tipText, 3);
    } else if (!reg.test(email)) {
      tipText = lang == "zh" ? "请输入正确的邮箱" : "Enter a valid email";
      tipShow(tipText, 3);
    } else if (satisfaction.length === 0) {
      tipText =
        lang == "zh"
          ? "请选择满意度"
          : "Rate your satisfaction with this document";
      tipShow(tipText, 2);
    } else if (privacy.length === 0) {
      tipText =
        lang == "zh" ? "请勾选同意隐私声明" : "Agree to Privacy Statement";
      tipShow(tipText, 5);
    } else {
      let postData = {
        bugDocFragment: questionValue,
        existProblem: checkedArr,
        problemDetail: feedback,
        comprehensiveSatisfication: parseInt(satisfaction.attr("key")),
        participateReason: lang == "zh" ? "本职工作" : "Job Duties",
        email: email,
      };
      $("#title-evaluate").css("z-index", "1000");
      $(".baseof_mask img").css("display", "inline-block");
      $.ajax({
        type: "POST",
        url: `/omapi/add/bugquestionnaire?community=openeuler&lang=${lang}`,
        data: JSON.stringify(postData),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        success: function (data) {
          postData.link = window.location.href;
          let body = encodeURIComponent(issueTemplate(postData));
          try {
            if (JSON.parse(data).code === 200) {
              function openUrl(url = "#") {
                let tempALink = document.createElement("a");
                tempALink.setAttribute("target", "_blank");
                tempALink.setAttribute("id", "openWin");
                tempALink.setAttribute("href", url);
                document.body.appendChild(tempALink);
                document.getElementById("openWin").click();
                document.body.removeChild(tempALink);
              }
              if (submitType === "issue") {
                openUrl(
                  `https://gitee.com/openeuler/docs/issues/new?issue%5Bassignee_id%5D=0&issue%5Bmilestone_id%5D=0&title=有奖捉虫&description=${body}`
                );
              } else {
                openUrl(
                  `https://gitee.com/-/ide/project/openeuler/docs/edit/stable2-${version}/-/docs/${lang}/docs/${path}?search=${first}&title=文档捉虫-openEuler ${version}-${title}&description=${feedback}&message=${feedback}&label_names=文档捉虫`
                );
              }
            } else {
              console.error(JSON.parse(data));
            }
          } catch (error) {
            console.error(error);
          }
          $("#title-evaluate").css("z-index", "1003");
          $("#title-evaluate img").css("display", "none");
        },
        error: function (err) {
          $("#title-evaluate").css("z-index", "1003");
          $("#title-evaluate img").css("display", "none");
          console.error(err);
        },
      });
    }
  });
  let template = "";
  for (let i = 1; i <= 10; i++) {
    let rank = "";
    if (i <= 6) {
      rank = lang === "zh" ? "失望" : "Disappointed";
    } else if (i > 6 && i <= 8) {
      rank = lang === "zh" ? "一般" : "Neutral";
    } else {
      rank = lang === "zh" ? "满意" : "Satisfied";
    }
    template =
      template +
      `<div class="score" key="${i}">${i}<div class="score-detail" ">${rank}</div></div>`;
  }
  $(".score-box").html(template);
  $(".evaluates .issue").on("click", function () {
    let text = `\n${this.children[0].innerHTML}:`;
    let preTag = null;
    if ($(".active-border").length) {
      preTag = `\n${$(".active-border")[0].childNodes[1].innerHTML}:\n`;
    }
    const textList = $(this).find(".issue-detail").text().split("●");
    for (let i = 0; i < textList.length; i++) {
      textList[i] = textList[i].trim();
    }
    let itemtext = text + textList.join("\n");
    let preText = null;
    if ($(".active-border").length) {
      preText =
        preTag +
        $(".active-border .issue-detail")
          .text()
          .replace(/\s+/gi, "")
          .replaceAll("；", "\n")
          .replaceAll("●", "");
    }
    text = itemtext;
    if ($(this).hasClass("active-border")) {
      text = text.replaceAll(itemtext.trim(), "");
      $(this).removeClass("active-border");
    } else {
      preText ? (text = text.replaceAll(preText.trim(), "")) : "";
      $(this).addClass("active-border").siblings().removeClass("active-border");
    }
    text = text.trim();
    let count = "";
    if (text.trim().length > 500) {
      $(".issue-reason").val(text.trim().substring(0, 500));
    } else if (text.length === 0) {
      $(".issue-reason").val("");
    } else {
      $(".issue-reason").val(`${text.trim()}\n`);
    }
    count = $(".issue-reason").val().length;
    $("#text-count-tow").text(count);
  });
  $(".submit-type .type-issue,.submit-type .type-PR").on("click", function () {
    $(this).addClass("active-submit").siblings().removeClass("active-submit");
  });
  $(".satisfaction .score").on("click", function () {
    $(this).addClass("active");
    $(this).siblings(".score").removeClass("active");
  });
  $(".first-input").on("input propertychange", function () {
    let _val = $(this).val();
    let count = "";
    if (_val.length > 500) {
      $(this).val(_val.substring(0, 500));
    }
    count = $(this).val().length;
    $("#text-count").text(count);
  });
  $(".issue-reason").on("input propertychange", function () {
    (_val = $(this).val()), (count = "");
    if (_val.length > 500) {
      $(this).val(_val.substring(0, 500));
    }
    count = $(this).val().length;
    $("#text-count-tow").text(count);
  });
  $("#privacy").click(function () {
    let $radio = $(this);
    if ($radio.data("checked")) {
      $radio.prop("checked", false);
      $radio.data("checked", false);
      $(".submit-tip").css("display", "none");
    } else {
      $radio.prop("checked", true);
      $radio.data("checked", true);
      $(".submit-tip").css("display", "block");
    }
  });
  getTreeLink();
});

function getTreeLink() {
  setTimeout(function () {
    let openEle = $(" #docstreeview .jstree-container-ul").find(".jstree-open");
    let lastBread = "";
    let h1 = $(".markdown h1");
    let title = "";
    if (h1.html()) {
      title = h1.html().trim();
    }
    if (openEle.length) {
      for (let i = 0; i < openEle.length; i++) {
        if (i < openEle.length) {
          let span = "<i></i>";
          $(".docs-a")
            .append(
              $(" #docstreeview .jstree-container-ul")
                .find(".jstree-open")
                .eq(i)
                .find("a")
                .first()
                .clone()
            )
            .append(span);
          lastBread = $(" #docstreeview .jstree-container-ul")
            .find(".jstree-open")
            .eq(i)
            .find("a")
            .first()
            .text();
        }
        // else {
        //     let text = $(" #docstreeview .jstree-container-ul").find(".jstree-open").eq(i).find("a").first().text();
        //     let span = "<span>" + text + "</span>"
        //     lastBread=text
        //     $(".docs-a").append(span);
        // }
      }
    }
    if (title !== lastBread) {
      $(".docs-a").append(`<a>${title}</a>`);
    } else {
      $(".docs-a i:nth-last-of-type(1)").remove();
    }
    if (!$(".docs-a>a:nth-last-of-type(1)").html()) {
      $(".docs-a>a:nth-last-of-type(1)").remove();
    }
  }, 100);
}

function tipShow(value, index) {
  if (index === 5) {
    $(".privacy-box").addClass("shake1");
    setTimeout(function () {
      $(".privacy-box").removeClass("shake1");
    }, 1000);
  } else if (index === 3) {
    const enEmailClass = lang === "zh" ? "" : "email-en";
    let tipBox = $(`<div class='tip-box shake ${enEmailClass}'></div>`);
    $(".text-email")[0].appendChild(tipBox[0]);
    $(".tip-box").text(value).slideToggle(500);
    setTimeout(function () {
      $(".tip-box").slideToggle("slow");
      setTimeout(function () {
        $(".tip-box").remove();
      }, 500);
    }, 2500);
  } else {
    let tipBox = $("<div class='tip-box shake'></div>");
    $(".title-h3")[index].appendChild(tipBox[0]);
    $(".tip-box").text(value).slideToggle(500);
    setTimeout(function () {
      $(".tip-box").slideToggle("slow");
      setTimeout(function () {
        $(".tip-box").remove();
      }, 500);
    }, 2500);
  }
}
// 选中文字出现捉虫图标
window.onload = function () {
  if (lang !== "ru") {
    function selectText() {
      if (document.selection) {
        return document.selection.createRange().text;
      } else {
        return window.getSelection().toString();
      }
    }
    let content = document.querySelector("#content");
    let feedback = document.querySelector(".feedback");
    content.onmouseup = function (event) {
      let ev = event || window.event;
      let left = ev.clientX;
      let top = ev.clientY + 30;
      let select = selectText().trim();
      setTimeout(function () {
        if (
          select.length > 0 &&
          window.getSelection() &&
          window.getSelection().type === "Range"
        ) {
          feedback.style.display = "block";
          feedback.style.left = left + "px";
          feedback.style.top = top + "px";
        } else {
          feedback.style.display = "none";
        }
      }, 100);
    };
    content.onclick = function (ev) {
      var ev = ev || window.event;
      ev.cancelBubble = true;
    };
    document.onclick = function () {
      feedback.style.display = "none";
    };

    feedback.onclick = function (e) {
      e.stopPropagation();
      let count = "";
      if (selectText().trim().length > 500) {
        $(".first-input").val(selectText().trim().substring(0, 500));
      } else {
        $(".first-input").val(selectText().trim());
      }
      count = 500 - $(".first-input").val().length;
      $("#text-count").text(count);
      $(".question").click();
    };
  }
};

function issueTemplate(data) {
  let Problem = "";
  data.existProblem.length == 0
    ? ""
    : (Problem = `- ${data.existProblem.join("、")}`);
  return `1. 【文档链接】

> ${data.link}

2. 【"有虫"文档片段】

> ${data.bugDocFragment.replace(/(\r\n|\r|\n)+/g, "$1")}

3. 【存在的问题】

${Problem}
> ${data.problemDetail.replace(/(\r\n|\r|\n)+/g, "$1")}

4. 【预期结果】
- 请填写预期结果`;
}
