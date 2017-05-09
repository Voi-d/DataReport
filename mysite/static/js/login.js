/**
 * Created by Void on 4/12/2017.
 */
/**
 * Created by Void on 4/11/2017.
 */

$(document).ready(function () {
    $('form input[type=button]').click(function () {

        var username = $('form input[name=user]').val();
        var pwd = $('form input[name=pwd]').val();

        if(username == ''){
            alert("用户名不能为空!");
        }else if(pwd == ''){
            alert("密码不能为空!");
        }else{
            $.ajax({
                type : 'POST',
                data: $('form').serializeArray(),
                success: function (response, status, xhr) {
                    if(response.toString() == 'ok'){
                        url = window.location.href.replace('login', 'home');
                        window.location.href = url;
                    }else{
                        alert(response);
                    }
                }
            });
        }
    });
});