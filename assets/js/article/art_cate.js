$(function () {
    initArtCateList();
    // var layer = layui.layer;
    var form = layui.form;
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        })
    }
    let indexAdd = null;
    let indexEdit = null;

    $('#btnAdd').on('click', function () {
        // 弹出一个修改文章分类信息的层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        })
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败')
                }
                initArtCateList();
                layer.msg('添加成功')
                layer.close(indexAdd)
            }
        })
    })
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        })



        const id = $(this).attr('data-id');
        console.log(id);

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })



    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('更新失败');
                }
                layer.msg('更新成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    $('body').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id');

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    console.log(index);
                    layer.close(index)
                    initArtCateList()
                }
            })

        })

    })
})