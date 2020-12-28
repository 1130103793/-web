$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show()
  })
  //点击去登陆链接
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide()
  })


  // const { form, layer } = layer;
  var layer = layui.layer
  var form = layui.form
  //自定义了一个叫做pwd 校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码不符合规则'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      const pwd = $('.reg-box [name=password]').val();
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  $('#form_reg').on('submit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message || '注册失败')

        }
        layer.msg(res.message || '注册成功')
        $('#link_login').click();
      }
    })
  })
  // 监听登录表单的提交事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message || '登陆失败')
        }
        layer.msg('登陆成功')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
        // console.log(res);
      }
    })
  })
})
