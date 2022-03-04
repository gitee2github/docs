
$(function ($) {
    if (lang !== 'zh') {
        $('#title-evaluate').css('display', 'none')
    }
    var isEvaluate = false;
    var urlArr = (window.location.pathname).split("/");
    var isAdd1 = $("#markdown>ul").first().find("li").children().is("ul");
    var isAdd4 = $("#markdown>ul").first().find("li").children().is("p");
    var isAdd2 = $("#markdown>ul").first().find("li").children().is("a");
    var isAdd3 = $("#markdown>.table-of-contents").first().find("ul");
    var evaluateParams = {
        name: '',
        path: '',
        lang: '',
        version: '',
        stars: 0
    }
    evaluateParams.lang = lang;
    var versionStr = urlArr[3].split("_");
    versionStr = versionStr.join(" ");
    var sourceLast = urlArr[6].replace("html", "md");
    var sourceHref = "https://gitee.com/openeuler/docs/tree/stable2-" + urlArr[3] + "/docs/" + lang + "/docs/" + urlArr[5] + "/" + sourceLast;
    $("#source").attr("href", sourceHref);
    if (evaluateParams.lang === "en") {
        $("#version-select>span").text("Version: " + versionStr);
    }
    else if (evaluateParams.lang === "zh") {
        $("#version-select>span").text("版本: " + versionStr);
    }
    else $("#version-select>span").text("version: " + versionStr);
    $("#h5-menu-top .select-box").find("span").text(versionStr);
    $("#version-select").click(function (e) {
        if ($(this).find(".option").css('display') === 'none') {
            $(this).find(".option").show();
        } else {
            $(this).find(".option").hide();
        }

        $(document).one("click", function () {
            $("#version-select .option").hide();
        });
        e.stopPropagation();
    });

    $("#h5-menu .h5-menu").click(function (e) {
        $("#menu-box").show();
        $("#content .docscontainer").css("height", "0");
        $("#page").hide();
    });
    $("#h5-menu-top .icon-close").click(function (e) {
        $("#menu-box").hide();
        $("#content .docscontainer").css("height", "auto");
        $("#page").show();
    });

    $("#h5-menu-top .h5-search").find(".search-btn").click(function (e) {
        keyword = $("#h5-menu-top .h5-search").find("input").val();
        window.location.href = '/' + lang + '/search.html?keyword=' + keyword;
    });

    $("#h5-menu-top .select-box").click(function (e) {
        if ($(this).find(".option").css('display') === 'none') {
            $(this).find(".option").show();
        } else {
            $(this).find(".option").hide();
        }
        $(document).one("click", function () {
            $(this).find(".option").hide();
        });
        e.stopPropagation();
    });
    if (isAdd1 && isAdd2 && !isAdd4) {
        let linkEle = $("#markdown>ul").first().clone();
        $("#title-evaluate>.title").append(linkEle);
    } else if (isAdd3) {
        $("#title-evaluate>.title").append(isAdd3);
    }
    $("#title-evaluate>.title").find("li").find("a").click(function (e) {
        $("#title-evaluate>.title").find("li").find("a").removeClass("active");
        $(this).addClass("active");
    });
    $("#title-evaluate .evaluate").find("i").click(function (e) {
        if (isEvaluate) {
            return false;
        } else {
            let arr = urlArr[6].split(".");
            let number = $(this).attr("key");
            evaluateParams.name = decodeURI(arr[0]);
            evaluateParams.path = urlArr[4] + '/' + urlArr[5] + '/' + urlArr[6];
            evaluateParams.version = urlArr[3];
            evaluateParams.stars = number;
            $.ajax({
                type: "POST",
                url: '/docs-search/docs/reviews',
                data: JSON.stringify(evaluateParams),
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                headers: {
                    Authorization: 'Basic b3BlbmV1bGVyc2VydmVyOm9wZW5ldWxlcnNlcnZlckAxMjM0'
                },
                success: function (data) {
                    $("#title-evaluate .evaluate").find("i").slice(0, number).addClass("active");
                    isEvaluate = true;
                },
                error: function (data) {
                    console.log(data);
                },
            });
        }
    }).mouseover(function () {
        $(this).find("div").show();
    }).mouseleave(function () {
        $("#title-evaluate .evaluate").find("i").find("div").hide();
    });
    $('.question').click(function (e) {
        if ($('.alert').css('display') === 'none') {
            e.stopPropagation()
            $('.alert').slideToggle(500);
            $(".baseof_mask").css('display', 'block');
        } else {
            $('.alert').slideToggle(500);
            $(".baseof_mask").css('display', 'none');
        }
    });
    $('.alert .icon-close').on('click', function (e) {
        e.stopPropagation()
        $('.question').click()
        $(".baseof_mask").css('display', 'none');
    })
    $('.btn-submit').on('click', function () {
        let questionValue = $('.main-input').val().trim();
        let feedback = $('.issue-reason').val().trim();
        let checkedArr = []
        $('.alert .active-border span').each(function (index) {
            checkedArr.push($('.alert .active-border span')[index].innerHTML)
        });
        let satisfaction = $('.satisfaction .active');
        let joinReason = $(".checkbox-list input[type='radio']:checked");
        let email = $(".email-input").val().trim();
        let reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
        let privacy = $(".privacy-box input[type='radio']:checked");
        if (!questionValue) {
            $('.first-input').focus()
            tipShow('请输入“有虫”片段', 0)
        } else if (!feedback) {
            $('.issue-reason').focus()
            tipShow('请输入问题描述', 1)
        } else if (satisfaction.length === 0) {
            tipShow('请选择满意度', 2)
        } else if (joinReason.length === 0) {
            tipShow('请选择参与原因', 3)
        } else if (!email) {
            tipShow('请输入您的邮箱', 4)
        } else if (!reg.test(email)) {
            tipShow('请输入正确的邮箱', 4)
        }
        else if (privacy.length === 0) {
            tipShow('请勾选同意隐私声明', 5)
        } else {
            let loginData = {
                community: 'OPENEULER',
                username: 'eulerUser',
                password: $.base64.encode('5Am@OpenEuler#94Community'),
            }
            let postData = {
                bugDocFragment: questionValue,
                existProblem: checkedArr,
                problemDetail: feedback,
                comprehensiveSatisfication: parseInt(satisfaction.attr('key')),
                participateReason: joinReason.next()[0].innerHTML,
                email: email,
            }
            $("#title-evaluate").css('z-index', '1000');
            $(".baseof_mask img").css('display', 'inline-block');
            $.ajax({
                type: "POST",
                url: 'https://omapi.osinfra.cn/token/apply',
                data: JSON.stringify(loginData),
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                success: function (data) {
                    let token = JSON.parse(data).token
                    $.ajax({
                        type: "POST",
                        url: '/omapi/add/bugquestionnaire?community=openeuler',
                        data: JSON.stringify(postData),
                        contentType: "application/json; charset=utf-8",
                        datatype: "json",
                        headers: {
                            token: token
                        },
                        success: function (data) {
                            postData.link = window.location.href
                            let body = encodeURIComponent(issueTemplate(postData))
                            try {
                                if (JSON.parse(data).code === 200) {
                                    window.open(`https://gitee.com/openeuler/docs/issues/new?issue%5Bassignee_id%5D=0&issue%5Bmilestone_id%5D=0&title=有奖捉虫&description=${body}`)
                                } else {
                                    console.log(JSON.parse(data));
                                }
                            } catch (error) {
                                console.log(error);
                            }
                            $("#title-evaluate").css('z-index', '1003');
                            $("#title-evaluate img").css('display', 'none');
                        },
                        error: function (err) {
                            $("#title-evaluate").css('z-index', '1003');
                            $("#title-evaluate img").css('display', 'none');
                            console.log(JSON.parse(err));
                        }
                    })
                },
                error: function (err) {
                    $("#title-evaluate").css('z-index', '1003');
                    $("#title-evaluate img").css('display', 'none');
                    console.log(JSON.parse(err));
                },
            });
        }
    })
    let template = ''
    for (let i = 1; i <= 10; i++) {
        let rank = '';
        if (i <= 6) {
            rank = '失望'
        } else if (i > 6 && i <= 8) {
            rank = '一般'
        } else {
            rank = '满意'
        }
        template = template + `<div class="score" key="${i}">${i}<div class="score-detail" ">${rank}</div></div>`
    }
    $('.score-box').html(
        template
    )
    $('.evaluates .issue').on('click', function () {
        let oldValue = $('.issue-reason').val()
        let text = `\n${this.childNodes[1].innerHTML}:\n`
        let itemtext = text +
            $(this).find('.issue-detail').text().replace(/\s+/ig, "").replaceAll("；", '\n').replaceAll("●", '');
        text = oldValue + itemtext
        if ($(this).hasClass("active-border")) {
            text = text.replaceAll(itemtext.trim(), '')
            $(this).removeClass("active-border");
        } else {
            $(this).addClass("active-border");
        }
        text = text.trim();
        let count = "";
        if (text.trim().length > 500) {
            $(".issue-reason").val(text.trim().substring(0, 500));
        } else if (text.length === 0) {
            $('.issue-reason').val('')
        } else {
            $('.issue-reason').val(`${text.trim()}\n`)
        }
        count = $(".issue-reason").val().length;
        $("#text-count-tow").text(count);
    })
    $('.satisfaction .score').on('click', function () {
        $(this).addClass('active');
        $(this).siblings(".score").removeClass('active');
    })
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
        _val = $(this).val(),
            count = "";
        if (_val.length > 500) {
            $(this).val(_val.substring(0, 500));
        }
        count = $(this).val().length;
        $("#text-count-tow").text(count);
    });
    $('#privacy').click(function () {
        let $radio = $(this);
        if ($radio.data('checked')) {
            $radio.prop('checked', false);
            $radio.data('checked', false);
            $('.submit-tip').css('display', 'none')
            $('.login-tip').css('display', 'none')
        } else {
            $radio.prop('checked', true);
            $radio.data('checked', true);
            $('.submit-tip').css('display', 'block')
            $('.login-tip').css('display', 'block')
        }
    });
    getTreeLink();
});

function getTreeLink() {
    setTimeout(function () {
        let openEle = $("#docstreeview .jstree-container-ul").find(".jstree-open");
        for (let i = 0; i < openEle.length; i++) {
            if (i < openEle.length - 1) {
                let span = "<i></i>"
                $(".link-container>.docs-a").append($("#docstreeview .jstree-container-ul").find(".jstree-open").eq(i).find("a").first().clone()).append(span);
            } else {
                let text = $("#docstreeview .jstree-container-ul").find(".jstree-open").eq(i).find("a").first().text();
                let span = "<span>" + text + "</span>"
                $(".link-container>.docs-a").append(span);
            }
        }
    }, 500);
}

function tipShow(value, index) {
    if (index === 5) {
        $('.privacy-box').addClass('shake1')
        setTimeout(function () {
            $('.privacy-box').removeClass('shake1');
        }, 1000)
    } else {
        let tipBox = $("<div class='tip-box shake'></div>");
        $('.title-h3')[index].appendChild(tipBox[0]);
        $('.tip-box').text(value).slideToggle(500)
        setTimeout(function () {
            $('.tip-box').slideToggle("slow");
            setTimeout(function () {
                $('.tip-box').remove()
            }, 500)
        }, 2500)
    }
}

window.onload = function () {
    if (lang === 'zh') {
        function selectText() {
            if (document.selection) {
                return document.selection.createRange().text;
            }
            else {
                return window.getSelection().toString();
            }
        }
        let content = document.querySelector('#content');
        let feedback = document.querySelector('.feedback');
        content.onmouseup = function (event) {
            let ev = event || window.event;
            let left = ev.clientX;
            let top = ev.clientY;
            let select = selectText().trim()
            if (select.length > 0) {
                setTimeout(function () {
                    feedback.style.display = 'block';
                    feedback.style.left = left + 'px';
                    feedback.style.top = top + 'px';
                }, 100);
            }
            else {
                feedback.style.display = 'none';
            }
        };
        content.onclick = function (ev) {
            var ev = ev || window.event;
            ev.cancelBubble = true;
        };
        document.onclick = function () {
            feedback.style.display = 'none';
        };

        feedback.onclick = function (e) {
            e.stopPropagation()
            let count = "";
            if (selectText().trim().length > 500) {
                $(".first-input").val(selectText().trim().substring(0, 500));
            } else {
                $('.first-input').val(selectText().trim())

            }
            count = 500 - $(".first-input").val().length;
            $("#text-count").text(count);
            $('.question').click()
        };
    }
};

function issueTemplate(data) {
    let Problem = ''
    data.existProblem.length == 0 ? '': Problem = `- ${data.existProblem.join('、')}`
    return `1. 【文档链接】

> ${data.link}

2. 【"有虫"文档片段】

> ${data.bugDocFragment.replace(/(\r\n|\r|\n)+/g, '$1')}

3. 【存在的问题】

${Problem}
> ${data.problemDetail.replace(/(\r\n|\r|\n)+/g, '$1')}

4. 【预期结果】
- 请填写预期结果`
}

