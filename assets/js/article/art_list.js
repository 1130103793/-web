$(function () {
    var layer = layui.layer;
    var form = layui.form
    var laypage = layui.laypage
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2,//每页显示几条数据，默认每页显示2条
        cata_id: '',//文章分类ID
        state: '',//文章发布状态

    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initCate()
    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求失败')
                }
                console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmStr = template('tpl-table', res)
                $('tbody').html(htmStr)
                renderPage(res.total)
            }

        })
    }
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求失败')
                }
                var htmStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmStr);
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name = state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cata_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条   
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            jump(obj, first) {
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagenum = obj.curr;
                if (!first) {
                    initTable();
                }

            }
        })
    }

    $('body').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('失败')
                    }
                    layer.msg('成功')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4

                    if (len === 1 && q.pagenum != 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum--;
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})