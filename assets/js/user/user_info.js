$(function () {
    const { form, layer } = layui;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须小于6位'
            }
        }
    })
    initUserinfo();

    function initUserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserinfo();
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求失败')
                }
                layer.msg('请求成功')
                window.parent.getUserInfo()
            }
        })
    })
})