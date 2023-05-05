$(document).ready(function () {
  // 读取数据生成版本切换的element元素
  (function () {
    const lang = location.href.split("/")[3];
    const versionObj =
      lang === "zh"
        ? versionObjZh
        : lang === "en"
        ? versionObjEn
        : versionObjRu;
    let spanElement = "";
    Object.keys(versionObj).forEach((key) => {
      spanElement =
        spanElement +
        `<li><a href="/${lang}/docs${versionObj[key].homePath}">${key}</a></li>`;
    });
    $(
      ".version-list,#h5_versions,.h5_nav .menu-select-box .option,#version-select .option,#h5-menu-top .menu-select-box .option"
    ).prepend(spanElement);
  })();
});
