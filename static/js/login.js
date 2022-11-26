
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
    const domain = '.openeuler.org';
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

  createClient(community) {
    const lang = this.getLanguage();
    const obj = {
      openeuler: {
        appId: '62679eab0b22b146d2ea0a3a',
        appHost: 'https://datastat.authing.cn',
        redirectUri: 'https://id.openeuler.org/login',
        lang: lang.language,
      },
    };
    if (obj[community]) {
      return new Authing.AuthenticationClient(obj[community]);
    }
    return new Authing.AuthenticationClient(obj.openeuler);
  },

  showGuard() {
    const origin = 'https://id.openeuler.org';
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
}

$(function($) { 
  $(document).ready(function() {
    if (location.pathname.includes('/ru/')) {
      $('.opt-user').remove()
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
    const origin = 'https://id.openeuler.org';
    window.open(
      `${origin}/${Login.getLanguage().lang}/profile`,
      '_blank'
    );
  });
})
