
const LOGIN_INFO = {
  photo: '',
  username: '',
}

var loginProxy = new Proxy(LOGIN_INFO, {
  get: function(target, key) {
      return target[key] || '';
  },
  set: function(target, key, value) {
      if (key === 'photo') {
        if (value) {
          $('#opt_user .logined').show();
          $('#opt_user .login').hide()
        } else {
          $('#opt_user .logined').hide();
          $('#opt_user .login').show();
        }
        $("#opt_user .img")[0].src = value;
        $("#opt_user .img")[1].src = value;
      }
      if (key === 'username') {
        $("#opt_user .opt-name").text(value);
        $("#opt_user .opt-name")[0].title = value;
        $("#opt_user .opt-name")[1].title = value;
      }
      return target[key] = value || '';
  }
})

// 登录相关接口
var LoginQuery = {
  queryCourse: (params, token) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "get",
        url: '/omapi/authing/user/permission',
        data: params,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        headers: {
            token,
        },
        success(result) {
          if (result) {
              resolve(result);
              return;
          }
          reject(result);
        },
        error(msg) {
            reject(msg);
        }
      });
    });
  },
  queryToken: (params) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "get",
        url: '/omapi/authing/token/apply',
        data: params,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        success(result) {
          if (result) {
              resolve(result);
              return;
          }
          reject(result);
        },
        error(msg) {
            reject(msg);
        }
      });
    });
  },
  queryIDToken: (token) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "get",
        url: '/omapi/authing/logout',
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        headers: {
            token,
        },
        success(result) {
          if (result) {
              resolve(result);
              return;
          }
          reject(result);
        },
        error(msg) {
            reject(msg);
        }
      });
    });
  },
}

var Login = {
  LOGIN_KEYS: {
    USER_TOKEN: '_U_T_',
    USER_INFO: '_U_I_',
  },

  setCookie(cname, cvalue, isDelete) {
    const deleteStr = isDelete ? 'max-age=0; ' : '';
    const domain = this.isTestENV() ? '.test.osinfra.cn' : '.openeuler.org';
    const expires = `${deleteStr}path=/; domain=${domain}`;
    document.cookie = `${cname}=${cvalue}; ${expires}`;
  },

  getCookie(cname) {
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  },

  deleteCookie(cname) {
    this.setCookie(cname, 'null', true);
  },

  saveUserAuth(code = '', photo = '', username='') {
    if (!code) {
      this.deleteCookie(this.LOGIN_KEYS.USER_TOKEN);
      this.deleteCookie(this.LOGIN_KEYS.USER_INFO);
    } else {
      const str = JSON.stringify({photo, username})
      this.setCookie(this.LOGIN_KEYS.USER_TOKEN, code, false);
      this.setCookie(this.LOGIN_KEYS.USER_INFO, str, false);
    }
  },

  getUserAuth() {
    const token = this.getCookie(this.LOGIN_KEYS.USER_TOKEN) || '';
    const str = this.getCookie(this.LOGIN_KEYS.USER_INFO) || '';
    let obj = {};
    try {
      obj = JSON.parse(str)
    } catch {
      obj = {}
    }
    const { photo = '', username='' } = obj;
    if (!token) {
      this.saveUserAuth();
    }
    return {
      token,
      photo,
      username,
    };
  },

  redirectUri: `${location.origin}${location.pathname}`,

  // 退出登录
  logout(community='openeuler') {
    const { token } = this.getUserAuth();
    LoginQuery.queryIDToken(token).then((res) => {
      const idToken = res.data.id_token;
      const client1 = this.createClient(community);
      const logoutUrl = client1.buildLogoutUrl({
        expert: true,
        redirectUri: `${location.origin}`,
        idToken,
      });
      this.saveUserAuth();
      location.href = logoutUrl;
    }).catch(() => {
      this.tokenFailIndicateLogin();
    });
  },

  // 刷新页面
  refreshPage() {
    window.location.reload()
  },

  getCodeByUrl(community='openeuler') {
    const query = this.getUrlParam();
    if (query.code && query.state) {
      const param = {
        code: query.code,
        permission: 'sigRead',
        community,
        redirect: this.redirectUri,
      };
      LoginQuery.queryToken(param).then((res) => {
        const { data = {} } = res;
        const { token = '', photo = '', username = '' } = data;
        this.saveUserAuth(token, photo, username);
        this.deleteUrlCode(query);
        window.parent.window.location.reload();
      });
    }
  },

  // 删除url上的code
  deleteUrlCode(query) {
    const arr = Object.entries(query);
    let url = location.origin + location.pathname;
    if (arr.length > 2) {
      const _arr = arr.filter((item) => !['code', 'state'].includes(item[0]))
      const search = _arr.reduce((pre, next) => {
        pre += `${next[0]}=${next[1]}`;
        return pre;
      }, '?')
      url += search;
    }
    history.replaceState(null, null, url);
  },

  getUrlParam(url = window.location.search) {
    const param = {};
    const arr = url.split('?');
    if (arr[1]) {
      const _arr = arr[1].split('&') || [];
      _arr.forEach((item) => {
        const it = item.split('=');
        if (it.length === 2) {
          const obj = {
            [it[0]]: it[1],
          };
          Object.assign(param, obj);
        }
      });
    }
    return param;
  },

  createClient(community) {
    const lang = this.getLanguage();
    const obj = {
      openeuler: {
        appId: '62679eab0b22b146d2ea0a3a',
        appHost: 'https://datastat.authing.cn',
        redirectUri: this.redirectUri,
        lang: lang.language,
      },
    };
    if (obj[community]) {
      return new Authing.AuthenticationClient(obj[community]);
    }
    return new Authing.AuthenticationClient(obj.openeuler);
  },

  // scope配置，设置登录后用户返回信息
  scopeConfig: {
    scope: 'openid profile username',
  },

  showGuard() {
    const origin = this.isTestENV()
      ? 'https://openeuler-usercenter.test.osinfra.cn'
      : 'https://id.openeuler.org';
    location.href = `${origin}/login?redirect_uri=${location.href}`;
  },

  setLogInfo(data) {
    const { photo = '', username = '' } = data;
    loginProxy.photo = photo;
    loginProxy.username = username;
  },

  // token失效
  tokenFailIndicateLogin() {
    this.setLogInfo({});
    this.saveUserAuth();
  },

  // 刷新后重新请求登录用户信息
  refreshInfo(community='openeuler') {
    const { token, photo, username } = this.getUserAuth();
    if (token) {
      this.setLogInfo({photo, username})
      LoginQuery.queryCourse({ community }, token).then((res) => {
        const { data } = res;
        if (
          !loginProxy.photo &&
          Object.prototype.toString.call(data) === '[object Object]'
        ) {
          this.setLogInfo(data);
          this.saveUserAuth(token, data.photo, data.username);
        }
      }).catch(() => {
        this.tokenFailIndicateLogin();
      });
    }
  },
  getLanguage() {
    if (location.pathname.includes('/zh/')) {
      return {
        lang: 'zh',
        language: 'zh-CN',
      }
    }
    return {
      lang: 'en',
      language: 'en-US',
    }
  },
  // 判断测试环境,true为测试环境
  isTestENV() {
    let bool = false;
    try {
      bool = location?.host?.includes('test');
    } catch {
      bool = false;
    }
    return bool;
  }
}

$(function($) { 
  $(document).ready(function() {
    if (location.pathname.includes('/ru/')) {
      $('.opt-user').hide()
    }
  });
  Login.refreshInfo();
  $("#opt_user>.login").click(function (e) {
    Login.showGuard();
  });
  $("#opt_user .logout").click(function (e) {
    Login.logout();
  });
  $("#opt_user .zone").click(function (e) {
    const origin = Login.isTestENV()
      ? 'https://openeuler-usercenter.test.osinfra.cn'
      : 'https://id.openeuler.org';
    window.open(
      `${origin}/${Login.getLanguage().lang}/profile`,
      '_blank'
    );
  });
})
